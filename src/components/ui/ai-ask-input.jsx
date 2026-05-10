"use client";

import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  MessageCircle,
  Send,
  Keyboard,
  Volume2,
  VolumeX,
  PanelBottomClose,
  Loader2,
  AudioLines,
} from "lucide-react";
import { VirtualKeyboard } from "@/components/ui/virtual-keyboard";
import { MovingBorder } from "@/components/ui/moving-border";
import ElasticSlider from "@/components/ui/elastic-slider";
import { OverlayChatRichText } from "@/components/ui/overlay-chat-rich-text";
import {
  ensureKeyboardAudio,
  playKeyboardSoundDown,
  playKeyboardSoundUp,
} from "@/lib/keyboard-audio";
import { cn } from "@/lib/utils";
import { VoiceChatMic } from "@/components/ui/voice-chat-mic";
import { chunkTextForTts } from "@/lib/tts-chunk";

const DEFAULT_SUGGESTIONS = [
  "Ask anything about Fayad…",
  "What projects has Fayad built?",
  "Show me Fayad's featured work",
  "What tech stack does Fayad use?",
  "Does Fayad work with Next.js and React?",
  "What backend tools does Fayad use?",
  "How can I hire or contact Fayad?",
  "What services does Fayad offer?",
  "Does Fayad build full-stack web apps?",
  "Can Fayad help with AI integration?",
  "What's Fayad's experience with MongoDB?",
  "Where is Fayad based or available to work?",
  "Does Fayad take freelance or contract work?",
  "How fast can Fayad start on a new project?",
  "What's Fayad's approach to UI and UX?",
  "Can Fayad help with an e-commerce site?",
  "Does Fayad use TypeScript?",
  "How do I see Fayad's resume or experience?",
];

const KEYBOARD_SOUND_VOLUME_STEP = 10;

/** Keys some browsers emit for hardware/OS volume (still no API to read actual mixer %). */
const MEDIA_VOL_MUTE = new Set(["AudioVolumeMute", "VolumeMute"]);
const MEDIA_VOL_DOWN = new Set(["AudioVolumeDown", "VolumeDown"]);
const MEDIA_VOL_UP = new Set(["AudioVolumeUp", "VolumeUp"]);

const headerAskTransport = new DefaultChatTransport({ api: "/api/chat" });

const GROQ_ORPHEUS_TERMS_URL =
  "https://console.groq.com/playground?model=canopylabs%2Forpheus-v1-english";

/** Profile image for overlay assistant replies (same asset as About). */
const FAYAD_CHAT_AVATAR_SRC = "/about1.png";

function FayadChatAvatar({ className = "" }) {
  return (
    <img
      src={FAYAD_CHAT_AVATAR_SRC}
      alt="Fayad"
      width={64}
      height={64}
      draggable={false}
      className={cn(
        "shrink-0 rounded-full object-cover object-top ring-2 ring-neutral-800/90 ring-offset-2 ring-offset-black",
        className
      )}
    />
  );
}

/** Shown while waiting for the first assistant token. */
function FayadThinkingLabel() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setPhase((p) => (p + 1) % 4), 380);
    return () => clearInterval(id);
  }, []);
  const dots = ["", ".", "..", "..."][phase % 4];
  return (
    <span className="font-medium tracking-tight text-neutral-200">
      Fayad is Thinking{" "}
      <span className="inline-block min-w-[3ch] font-normal text-neutral-400">
        {dots}
      </span>
    </span>
  );
}

function getMessageText(m) {
  if (!m.parts || !Array.isArray(m.parts)) return "";
  return m.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("");
}

/**
 * Large overlay reply with a visible typewriter: chases streamed tokens, then
 * finishes any tail one character at a time after the stream closes.
 */
function OverlayAssistantTypingText({
  messageId,
  fullText,
  streaming,
  scrollContainerRef,
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    setN(0);
  }, [messageId]);

  useEffect(() => {
    if (n >= fullText.length) return;

    const behind = fullText.length - n;
    let delayMs;
    let step;

    if (streaming) {
      // Still receiving: catch bursts quickly but keep a readable “typing” tick.
      delayMs = behind > 80 ? 12 : behind > 36 ? 18 : behind > 12 ? 26 : 34;
      step =
        behind > 100 ? 6 : behind > 48 ? 4 : behind > 18 ? 2 : 1;
    } else {
      // Stream finished: classic 1-char typewriter for any remaining text.
      delayMs = 20;
      step = 1;
    }

    const id = window.setTimeout(() => {
      setN((x) => Math.min(x + step, fullText.length));
    }, delayMs);
    return () => clearTimeout(id);
  }, [fullText, n, streaming]);

  useLayoutEffect(() => {
    const root = scrollContainerRef?.current;
    if (!root) return;
    root.scrollTo({ top: root.scrollHeight, behavior: "auto" });
  }, [n, fullText, streaming, scrollContainerRef]);

  const shown = fullText.slice(0, n);
  const showCaret =
    streaming || n < fullText.length;

  return (
    <div className="font-overlay-chat-dotted m-0 whitespace-pre-wrap break-words text-3xl leading-snug tracking-tight text-neutral-100 sm:text-4xl md:text-5xl md:leading-tight">
      <OverlayChatRichText text={shown} />
      {showCaret ? (
        <motion.span
          aria-hidden
          className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-px bg-red-500 align-middle shadow-[0_0_12px_rgba(239,68,68,0.65)]"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{
            duration: 0.85,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.52, 0.53, 1],
          }}
        />
      ) : null}
    </div>
  );
}

const NO_TYPING_SOUND_CODES = new Set([
  "F10",
  "F11",
  "F12",
  ...MEDIA_VOL_MUTE,
  ...MEDIA_VOL_DOWN,
  ...MEDIA_VOL_UP,
]);

export default function AiAskInput({
  suggestions: suggestionsProp,
  onSubmit,
  className = "",
}) {
  const suggestions =
    suggestionsProp?.length > 0 ? suggestionsProp : DEFAULT_SUGGESTIONS;

  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const prevValueRef = useRef("");
  const inputRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [vkOpen, setVkOpen] = useState(false);
  const [keyboardSoundVolume, setKeyboardSoundVolume] = useState(72);
  const soundVolumeRef = useRef(72);
  const preMuteVolumeRef = useRef(72);
  /** Black overlay + bottom chrome stay until Close screen (blur / clicks elsewhere do not dismiss). */
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [ttsError, setTtsError] = useState(null);
  /** When on, each assistant reply is read aloud after streaming finishes. */
  const [autoReadAloud, setAutoReadAloud] = useState(false);
  const lastAutoTtsMessageIdRef = useRef(null);

  const chatTransport = useMemo(() => headerAskTransport, []);
  const {
    messages,
    sendMessage,
    setMessages,
    status,
    error: chatError,
    clearError,
  } = useChat({
    id: "hdr-ai-ask",
    transport: chatTransport,
  });
  const chatLoading = status === "streaming" || status === "submitted";
  const prevChatLoadingRef = useRef(chatLoading);
  const overlayScrollRef = useRef(null);
  const overlayChatBodyRef = useRef(null);

  const lastAssistantMessageId = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") return messages[i].id;
    }
    return null;
  }, [messages]);

  const canReadLastReply = useMemo(() => {
    if (!lastAssistantMessageId || chatLoading) return false;
    const m = messages.find((x) => x.id === lastAssistantMessageId);
    return Boolean(getMessageText(m || "").trim());
  }, [lastAssistantMessageId, chatLoading, messages]);

  const showReadReplyControl = autoReadAloud || canReadLastReply;

  useEffect(() => {
    soundVolumeRef.current = keyboardSoundVolume;
    if (keyboardSoundVolume > 0) {
      preMuteVolumeRef.current = keyboardSoundVolume;
    }
  }, [keyboardSoundVolume]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    void ensureKeyboardAudio();
  }, []);

  const showDim = overlayOpen;

  const applyVolumeMuteToggle = useCallback(() => {
    setKeyboardSoundVolume((v) => {
      if (v > 0) {
        preMuteVolumeRef.current = v;
        return 0;
      }
      const restore =
        preMuteVolumeRef.current > 0 ? preMuteVolumeRef.current : 72;
      return restore;
    });
  }, []);

  const applyVolumeDown = useCallback(() => {
    setKeyboardSoundVolume((v) =>
      Math.max(0, v - KEYBOARD_SOUND_VOLUME_STEP)
    );
  }, []);

  const applyVolumeUp = useCallback(() => {
    setKeyboardSoundVolume((v) =>
      Math.min(100, v + KEYBOARD_SOUND_VOLUME_STEP)
    );
  }, []);

  useEffect(() => {
    if (!showDim) return;

    const onVolumeKeyDown = (e) => {
      const { code } = e;
      const fnVolume =
        code === "F10" || code === "F11" || code === "F12";

      if (fnVolume) {
        if (code === "F10" && e.repeat) return;
        e.preventDefault();
        e.stopPropagation();
        if (code === "F10") applyVolumeMuteToggle();
        else if (code === "F11") applyVolumeDown();
        else applyVolumeUp();
        return;
      }

      if (
        MEDIA_VOL_MUTE.has(code) ||
        MEDIA_VOL_DOWN.has(code) ||
        MEDIA_VOL_UP.has(code)
      ) {
        // No preventDefault — OS still adjusts device volume when the browser allows it.
        // Mirror the same step into keyboard gain / elastic UI (true mixer % is not readable on the web).
        if (MEDIA_VOL_MUTE.has(code)) {
          if (!e.repeat) applyVolumeMuteToggle();
        } else if (MEDIA_VOL_DOWN.has(code)) {
          applyVolumeDown();
        } else {
          applyVolumeUp();
        }
      }
    };

    window.addEventListener("keydown", onVolumeKeyDown, true);
    return () =>
      window.removeEventListener("keydown", onVolumeKeyDown, true);
  }, [showDim, applyVolumeMuteToggle, applyVolumeDown, applyVolumeUp]);

  useEffect(() => {
    if (!showDim) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showDim]);

  useEffect(() => {
    if (!focused || vkOpen) return;

    const onDown = (e) => {
      if (e.repeat) return;
      if (NO_TYPING_SOUND_CODES.has(e.code)) return;
      if (document.activeElement !== inputRef.current) return;
      playKeyboardSoundDown(e.code, soundVolumeRef.current);
    };

    const onUp = (e) => {
      if (NO_TYPING_SOUND_CODES.has(e.code)) return;
      if (document.activeElement !== inputRef.current) return;
      playKeyboardSoundUp(e.code, soundVolumeRef.current);
    };

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [focused, vkOpen]);

  useEffect(() => {
    if (prevValueRef.current !== "" && value === "") {
      setTypedText("");
      setWordIndex(0);
      setIsDeleting(false);
    }
    prevValueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (value !== "") return;

    const current = suggestions[wordIndex];
    const isComplete = typedText === current;
    const isEmpty = typedText.length === 0;

    let delay = isDeleting ? 42 : 72;
    if (isComplete && !isDeleting) delay = 1600;
    if (isEmpty && isDeleting) delay = 320;

    const timer = setTimeout(() => {
      if (isComplete && !isDeleting) {
        setIsDeleting(true);
        return;
      }
      if (isEmpty && isDeleting) {
        setIsDeleting(false);
        setWordIndex((i) => (i + 1) % suggestions.length);
        return;
      }
      setTypedText(
        isDeleting
          ? current.slice(0, typedText.length - 1)
          : current.slice(0, typedText.length + 1)
      );
    }, delay);

    return () => clearTimeout(timer);
  }, [typedText, wordIndex, isDeleting, value, suggestions]);

  const showTypingPlaceholder = value === "";
  const currentSuggestion = suggestions[wordIndex];
  const pausedAtFull =
    showTypingPlaceholder &&
    typedText.length > 0 &&
    typedText === currentSuggestion &&
    !isDeleting;

  const submitValue = () => {
    const trimmed = value.trim();
    if (!trimmed || chatLoading) return;
    setValue("");
    onSubmit?.(trimmed);
    sendMessage({ text: trimmed });
  };

  const handleVoiceTranscript = useCallback(
    (text) => {
      const trimmed = String(text || "").trim();
      if (!trimmed || chatLoading) return;
      setValue("");
      onSubmit?.(trimmed);
      sendMessage({ text: trimmed });
    },
    [chatLoading, onSubmit, sendMessage]
  );

  const playAssistantTtsById = useCallback(
    async (messageId) => {
      if (!messageId || ttsPlaying) return false;
      const m = messages.find((x) => x.id === messageId);
      const raw = getMessageText(m || {});
      let plain = raw.replace(/<[^>]+>/g, " ");
      plain = plain.replace(/\*\*/g, "");
      plain = plain.replace(/https?:\/\/[^\s]+/g, "link");
      plain = plain.replace(/\s+/g, " ").trim();
      if (!plain) return false;

      const chunks = chunkTextForTts(plain, 180);
      if (chunks.length === 0) return false;

      setTtsError(null);
      setTtsPlaying(true);
      let success = true;
      try {
        for (const chunk of chunks) {
          const res = await fetch("/api/speech", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: chunk }),
          });
          if (!res.ok) {
            let msg = `Read aloud failed (${res.status})`;
            try {
              const j = await res.json();
              if (typeof j?.error === "string") msg = j.error;
              else if (j?.error?.message) msg = String(j.error.message);
            } catch {
              /* ignore */
            }
            setTtsError(msg);
            success = false;
            break;
          }
          const blob = await res.blob();
          if (blob.size < 64) {
            setTtsError("Empty audio response");
            success = false;
            break;
          }
          const url = URL.createObjectURL(blob);
          await new Promise((resolve, reject) => {
            const audio = new Audio(url);
            audio.onended = () => {
              URL.revokeObjectURL(url);
              resolve();
            };
            audio.onerror = () => {
              URL.revokeObjectURL(url);
              reject(new Error("audio"));
            };
            void audio.play().catch(reject);
          });
        }
      } catch {
        setTtsError("Could not play audio in this browser.");
        success = false;
      } finally {
        setTtsPlaying(false);
      }
      return success;
    },
    [ttsPlaying, messages]
  );

  const handleReadReplyButtonClick = useCallback(
    (e) => {
      setTtsError(null);
      if (e.shiftKey) {
        if (ttsPlaying || chatLoading || !lastAssistantMessageId) return;
        void playAssistantTtsById(lastAssistantMessageId);
        return;
      }
      if (autoReadAloud) {
        setAutoReadAloud(false);
        lastAutoTtsMessageIdRef.current = null;
        return;
      }
      setAutoReadAloud(true);
      if (lastAssistantMessageId && !chatLoading) {
        void playAssistantTtsById(lastAssistantMessageId).then((ok) => {
          if (ok) lastAutoTtsMessageIdRef.current = lastAssistantMessageId;
        });
      }
    },
    [
      autoReadAloud,
      ttsPlaying,
      chatLoading,
      lastAssistantMessageId,
      playAssistantTtsById,
    ]
  );

  useEffect(() => {
    const prev = prevChatLoadingRef.current;
    prevChatLoadingRef.current = chatLoading;
    const streamJustEnded = prev && !chatLoading;
    if (!streamJustEnded || !autoReadAloud) return;
    if (ttsPlaying) return;
    const id = lastAssistantMessageId;
    if (!id) return;
    if (lastAutoTtsMessageIdRef.current === id) return;
    void playAssistantTtsById(id).then((ok) => {
      if (ok) lastAutoTtsMessageIdRef.current = id;
    });
  }, [
    chatLoading,
    autoReadAloud,
    lastAssistantMessageId,
    messages,
    ttsPlaying,
    playAssistantTtsById,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitValue();
  };

  const handleCloseScreen = () => {
    setOverlayOpen(false);
    setVkOpen(false);
    setMessages([]);
    setTtsError(null);
    setAutoReadAloud(false);
    lastAutoTtsMessageIdRef.current = null;
    clearError();
    inputRef.current?.blur();
  };

  const scrollOverlayChatToEnd = useCallback(() => {
    const root = overlayScrollRef.current;
    if (!root) return;
    requestAnimationFrame(() => {
      root.scrollTop = root.scrollHeight;
    });
  }, []);

  useEffect(() => {
    if (!showDim) return;
    scrollOverlayChatToEnd();
  }, [showDim, messages, chatLoading, scrollOverlayChatToEnd]);

  useLayoutEffect(() => {
    if (!showDim) return;
    if (typeof ResizeObserver === "undefined") return;
    const root = overlayScrollRef.current;
    const body = overlayChatBodyRef.current;
    if (!root || !body) return;
    scrollOverlayChatToEnd();
    const ro = new ResizeObserver(() => scrollOverlayChatToEnd());
    ro.observe(body);
    return () => ro.disconnect();
  }, [showDim, scrollOverlayChatToEnd]);

  const handleVirtualKey = (action) => {
    if (action.type === "volumeMute") {
      applyVolumeMuteToggle();
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }
    if (action.type === "volumeDown") {
      applyVolumeDown();
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }
    if (action.type === "volumeUp") {
      applyVolumeUp();
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }
    if (action.type === "char" && action.char) {
      setValue((v) => v + action.char);
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }
    if (action.type === "backspace") {
      setValue((v) => v.slice(0, -1));
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }
    if (action.type === "enter") {
      submitValue();
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }
    if (action.type === "escape") {
      setVkOpen(false);
    }
  };

  const showVkToggle = overlayOpen || vkOpen;

  const closeScreenButton = (
    <button
      type="button"
      aria-label="Close screen"
      onClick={handleCloseScreen}
      className="pointer-events-auto flex shrink-0 items-center gap-2 rounded-full border border-neutral-700/70 bg-black/90 px-4 py-2 text-xs font-medium text-neutral-300 shadow-lg backdrop-blur-md transition-colors hover:border-neutral-600 hover:bg-neutral-900/95 hover:text-white"
    >
      <PanelBottomClose className="size-3.5 opacity-90" aria-hidden />
      Close screen
    </button>
  );

  return (
    <>
      {mounted &&
        showDim &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-black"
            aria-hidden
          />,
          document.body
        )}

      {mounted &&
        showDim &&
        createPortal(
          <div
            className="pointer-events-none fixed inset-0 z-[91] flex w-full flex-col pt-[calc(5rem+env(safe-area-inset-top,0px))] pb-[calc(11rem+env(safe-area-inset-bottom,0px))] pl-0 pr-0"
            aria-live="polite"
          >
            <div
              ref={overlayScrollRef}
              className={cn(
                "pointer-events-auto max-h-full min-h-0 w-full max-w-none flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]",
                "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              )}
            >
              <div
                ref={overlayChatBodyRef}
                className="w-full px-4 sm:px-6 md:px-10 lg:px-14"
              >
              {chatError && (
                <div
                  role="alert"
                  className="mb-4 rounded-xl border border-red-500/40 bg-red-950/50 px-4 py-3 text-left text-sm text-red-100"
                >
                  <p className="m-0 font-medium">Could not reach the assistant</p>
                  <p className="mt-1 mb-3 text-red-200/90">
                    {chatError.message ||
                      "Check your connection and that GROQ_API_KEY is set in .env.local."}
                  </p>
                  <button
                    type="button"
                    onClick={() => clearError()}
                    className="rounded-lg border border-red-400/50 bg-red-900/40 px-3 py-1.5 text-xs font-medium text-red-50 transition-colors hover:bg-red-900/70"
                  >
                    Dismiss
                  </button>
                </div>
              )}
              {messages.length === 0 && !chatLoading ? (
                <p className="px-2 text-center text-lg text-neutral-500 sm:text-xl">
                  Ask a question, then press{" "}
                  <kbd className="font-mono text-neutral-300 underline decoration-neutral-600 decoration-1 underline-offset-4">
                    Enter
                  </kbd>{" "}
                  or send — or tap the{" "}
                  <span className="text-neutral-400">mic</span> to speak.
                </p>
              ) : (
                <div className="flex flex-col gap-10 pb-6 sm:gap-12">
                  {messages.map((m) => {
                    const text = getMessageText(m);
                    const isUser = m.role === "user";
                    if (isUser && !text.trim()) return null;
                    if (!isUser && !text.trim() && m.id !== lastAssistantMessageId)
                      return null;

                    const isLastAssistant =
                      m.role === "assistant" && m.id === lastAssistantMessageId;
                    const streamThis = isLastAssistant && chatLoading;

                    return (
                      <div
                        key={m.id}
                        className="grid w-full grid-cols-1 gap-6 sm:grid-cols-[minmax(0,70vw)_minmax(0,1fr)] sm:gap-x-6 md:gap-x-10 lg:gap-x-14"
                      >
                        <div
                          className={cn(
                            "min-w-0",
                            isUser
                              ? "hidden sm:flex sm:justify-start sm:pr-2"
                              : "flex justify-start sm:pr-2"
                          )}
                        >
                          {!isUser && (
                            <div className="flex w-full max-w-[70vw] min-w-0 items-start gap-3 sm:max-w-none sm:gap-4">
                              <FayadChatAvatar className="size-11 sm:size-14 md:size-16" />
                              <div className="min-w-0 flex-1 pt-0.5">
                                <OverlayAssistantTypingText
                                  messageId={m.id}
                                  fullText={text}
                                  streaming={streamThis}
                                  scrollContainerRef={overlayScrollRef}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div
                          className={cn(
                            "min-w-0",
                            isUser
                              ? "flex justify-end sm:justify-end sm:pl-2"
                              : "hidden sm:flex sm:justify-end sm:pl-2"
                          )}
                        >
                          {isUser && (
                            <p className="m-0 max-w-full whitespace-pre-wrap break-words text-right text-2xl font-medium leading-snug tracking-tight text-red-400/95 sm:text-3xl md:text-4xl md:leading-tight">
                              {text}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {chatLoading && !messages.some((m) => m.role === "assistant") && (
                    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-[minmax(0,70vw)_minmax(0,1fr)] sm:gap-x-6 md:gap-x-10 lg:gap-x-14">
                      <div className="flex max-w-[70vw] min-w-0 items-start gap-3 sm:max-w-none sm:gap-4">
                        <FayadChatAvatar className="size-11 sm:size-14 md:size-16" />
                        <div className="flex min-w-0 flex-1 items-start gap-3 pt-0.5 text-xl text-neutral-400 sm:text-2xl md:text-3xl">
                          <Loader2
                            className="size-6 shrink-0 animate-spin text-red-500/85 sm:size-7"
                            aria-hidden
                          />
                          <FayadThinkingLabel />
                        </div>
                      </div>
                      <div className="hidden sm:block" aria-hidden />
                    </div>
                  )}
                </div>
              )}
              </div>
            </div>
          </div>,
          document.body
        )}

    <div className={cn("relative z-[101] w-full", className)}>
      <div className="relative w-full overflow-hidden rounded-full p-[2px]">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
        aria-hidden
      >
        <MovingBorder duration={3800} rx="48%" ry="48%">
          <div className="size-[5rem] bg-[radial-gradient(#e01c1c_38%,transparent_62%)] opacity-[0.88]" />
        </MovingBorder>
      </div>

      <form
        onSubmit={handleSubmit}
        className={cn(
          "relative z-10 flex h-12 w-full items-center overflow-hidden rounded-full border border-neutral-800/60 bg-black/95 px-3 shadow-none backdrop-blur-xl transition-colors",
          focused && "border-neutral-700/80"
        )}
      >
        <div className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-0 bg-transparent text-red-400">
          <MessageCircle size={15} strokeWidth={2} />
        </div>

        <div className="relative min-w-0 flex-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => {
              setFocused(true);
              setOverlayOpen(true);
            }}
            onBlur={() => setFocused(false)}
            placeholder=""
            aria-label={suggestions[0]?.replace("…", "") ?? "Ask about Fayad"}
            autoComplete="off"
            className="relative z-[1] h-full min-h-12 w-full bg-transparent text-sm text-gray-100 outline-none ring-0 border-0 placeholder:text-transparent focus:border-0 focus:ring-0 focus-visible:outline-none"
          />
          {showTypingPlaceholder && (
            <div
              className="pointer-events-none absolute inset-y-0 left-0 right-0 z-[2] flex min-w-0 justify-start items-center overflow-hidden pr-1 text-left text-sm text-gray-500"
              aria-hidden
            >
              <div className="flex min-w-0 max-w-full items-center gap-px overflow-hidden">
                <span className="min-w-0 shrink truncate">{typedText}</span>
                {pausedAtFull ? (
                  <motion.span
                    className="shrink-0 select-none font-mono text-base font-semibold leading-none text-red-500"
                    aria-hidden
                    animate={{ opacity: [1, 1, 0, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                      times: [0, 0.55, 0.56, 1],
                    }}
                  >
                    |
                  </motion.span>
                ) : (
                  <motion.span
                    key={`caret-${wordIndex}-${typedText}-${isDeleting}`}
                    className="shrink-0 select-none font-mono text-base font-semibold leading-none text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.45)]"
                    aria-hidden
                    initial={{ opacity: 0.2, scaleY: 0.92 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 0.11, ease: [0.22, 1, 0.36, 1] }}
                  >
                    |
                  </motion.span>
                )}
              </div>
            </div>
          )}
        </div>

        {overlayOpen && (
          <VoiceChatMic
            overlayOpen={overlayOpen}
            disabled={false}
            chatBusy={chatLoading}
            onTranscript={handleVoiceTranscript}
          />
        )}

        {showVkToggle && (
          <button
            type="button"
            aria-label={vkOpen ? "Hide keyboard" : "Show keyboard"}
            aria-pressed={vkOpen}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setVkOpen((o) => !o)}
            className={cn(
              "relative z-[1] ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-0 bg-transparent transition-colors",
              vkOpen
                ? "text-red-400 bg-red-500/15 hover:bg-red-500/25"
                : "text-gray-400 hover:text-red-400 hover:bg-white/5"
            )}
          >
            <Keyboard size={16} strokeWidth={2} />
          </button>
        )}

        <button
          type="submit"
          aria-label="Ask AI"
          className="relative z-[1] ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-0 bg-transparent text-red-400 transition-colors hover:text-red-300 hover:bg-red-500/10 disabled:opacity-40"
          disabled={!value.trim() || chatLoading}
        >
          <Send size={14} />
        </button>
      </form>
      </div>
    </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {vkOpen && (
              <motion.div
                key="vk"
                role="dialog"
                aria-label="Virtual keyboard"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="fixed bottom-4 left-1/2 z-[115] w-[calc(100vw-8px)] max-w-[100vw] -translate-x-1/2 overflow-x-auto overflow-y-visible overscroll-x-contain pb-[env(safe-area-inset-bottom,0px)] [-webkit-overflow-scrolling:touch]"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="flex w-full flex-col items-center gap-3 px-1">
                  {closeScreenButton}
                  <ElasticSlider
                    value={keyboardSoundVolume}
                    onChange={setKeyboardSoundVolume}
                    variant="dark"
                    leftIcon={<VolumeX className="size-4 opacity-80" />}
                    rightIcon={<Volume2 className="size-4 opacity-80" />}
                    className="max-w-[min(22rem,calc(100vw-2rem))]"
                  />
                  <VirtualKeyboard
                    onEmit={handleVirtualKey}
                    enableSound
                    soundVolumeRef={soundVolumeRef}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {mounted &&
        showDim &&
        !vkOpen &&
        createPortal(
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none fixed bottom-6 left-1/2 z-[112] flex w-[min(22rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-col items-center gap-3 pb-[env(safe-area-inset-bottom,0px)]"
          >
            <div className="pointer-events-auto flex flex-col items-center gap-2">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {closeScreenButton}
                {showReadReplyControl ? (
                  <button
                    type="button"
                    title="Click: turn auto-read on (reads this reply, then new replies). Click again to turn off. Shift+click: read this reply only."
                    aria-label={
                      autoReadAloud
                        ? "Auto-read replies on; click to turn off"
                        : "Turn on auto-read for new replies, or Shift-click to read this reply only"
                    }
                    aria-pressed={autoReadAloud}
                    onClick={handleReadReplyButtonClick}
                    disabled={ttsPlaying && !autoReadAloud}
                    className={cn(
                      "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium shadow-lg backdrop-blur-md transition-colors",
                      autoReadAloud
                        ? "border-sky-500/60 bg-sky-950/50 text-sky-100 hover:border-sky-400/80 hover:bg-sky-950/70"
                        : "border-neutral-700/70 bg-black/90 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-900/95 hover:text-white",
                      ttsPlaying && !autoReadAloud && "opacity-50"
                    )}
                  >
                    {ttsPlaying && !autoReadAloud ? (
                      <Loader2 className="size-3.5 animate-spin" aria-hidden />
                    ) : (
                      <AudioLines className="size-3.5 opacity-90" aria-hidden />
                    )}
                    {autoReadAloud ? "Auto read on" : "Read reply"}
                  </button>
                ) : null}
              </div>
              {ttsError ? (
                <div
                  role="alert"
                  className="pointer-events-auto max-w-[min(22rem,90vw)] text-center text-xs leading-snug text-red-400/95"
                >
                  <p className="m-0">{ttsError}</p>
                  {ttsError.toLowerCase().includes("terms acceptance") ? (
                    <p className="mt-2 mb-0 text-[11px] leading-snug text-neutral-400">
                      Groq org admin: accept Orpheus terms once, then use Read reply
                      again —{" "}
                      <a
                        href={GROQ_ORPHEUS_TERMS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-sky-400 underline decoration-sky-500/50 underline-offset-2 hover:text-sky-300"
                      >
                        Open Groq Playground
                      </a>
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
            <ElasticSlider
              value={keyboardSoundVolume}
              onChange={setKeyboardSoundVolume}
              variant="dark"
              leftIcon={<VolumeX className="size-4 opacity-80" />}
              rightIcon={<Volume2 className="size-4 opacity-80" />}
              className="pointer-events-auto"
            />
          </motion.div>,
          document.body
        )}
    </>
  );
}
