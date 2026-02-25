"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { MessageCircle, X, Send, Loader2, ExternalLink, Maximize2, Minimize2 } from "lucide-react";

const chatTransport = new DefaultChatTransport({ api: "/api/chat" });

const URL_REGEX = /https?:\/\/[^\s<>"']+/gi;

function getMessageText(m) {
  if (!m.parts || !Array.isArray(m.parts)) return "";
  return m.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("");
}

function getDomain(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

const PORTFOLIO_HOST = "alfayad.vercel.app";

function isPortfolioUrl(href) {
  try {
    const domain = getDomain(href);
    return domain === PORTFOLIO_HOST || domain.endsWith(".alfayad.vercel.app");
  } catch {
    return false;
  }
}

function LinkCard({ href }) {
  if (isPortfolioUrl(href)) return null;
  const domain = getDomain(href);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-3 py-2.5 text-left transition hover:border-red-500/40 hover:bg-white/10"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/20 text-red-400">
        <ExternalLink className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{domain}</p>
        <p className="truncate text-xs text-white/60">Open link</p>
      </div>
    </a>
  );
}

function trimUrlTrailingPunctuation(url) {
  return url.replace(/[.,;:!?)]+$/, "");
}

/** Splits text into segments: [{ type: 'text' | 'url', content }] */
function splitTextAndUrls(text) {
  const segments = [];
  let lastIndex = 0;
  let match;
  const re = new RegExp(URL_REGEX.source, "gi");
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, match.index).trim() });
    }
    segments.push({ type: "url", content: trimUrlTrailingPunctuation(match[0]) });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    const rest = text.slice(lastIndex).trim();
    if (rest) segments.push({ type: "text", content: rest });
  }
  return segments;
}

function AssistantMessageContent({ text }) {
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());
  return (
    <div className="space-y-4 text-[15px] leading-[1.6]">
      {paragraphs.map((para, i) => {
        const segments = splitTextAndUrls(para);
        const hasUrl = segments.some((s) => s.type === "url");
        return (
          <div key={i} className="space-y-2">
            {hasUrl ? (
              segments.map((seg, j) =>
                seg.type === "text" ? (
                  <p key={j} className="text-white/95">
                    {seg.content}
                  </p>
                ) : (
                  <LinkCard key={j} href={seg.content} />
                )
              )
            ) : (
              <p className="whitespace-pre-line text-white/95">{para}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

const TEASER_STORAGE_KEY = "chatTeaserDismissed";
const CHAT_REVEAL_DELAY_MS = 2500;
const CHAT_REVEAL_FALLBACK_MS = 4500;

/** Maps user message to { path, hash } for auto-navigation. Covers home sections and pages. */
function getNavigationForMessage(text) {
  if (!text || typeof text !== "string") return null;
  const lower = text.toLowerCase().trim();
  const words = lower.split(/\s+/);
  const has = (...keys) => keys.some((k) => lower.includes(k));
  if (has("project", "work", "portfolio", "show me project", "my work", "my project")) return { path: "/work" };
  if (has("resume", "experience", "education", "skill", "contact info", "cv")) return { path: "/", hash: "resume" };
  if (has("about", "about me", "who are you", "about you")) return { path: "/", hash: "about" };
  if (has("tech stack", "technologies", "tools", "tech")) return { path: "/", hash: "tech-stack" };
  if (has("contact", "get in touch", "email", "hire", "reach")) return { path: "/contact" };
  if (has("service", "services", "offer", "pricing")) return { path: "/services" };
  if (has("home", "main page", "landing")) return { path: "/" };
  return null;
}

function scrollToHash(hash) {
  if (!hash) return;
  const el = document.getElementById(hash);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ChatWidgetContent() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);
  const [chatRevealed, setChatRevealed] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const { messages, sendMessage, status } = useChat({
    transport: chatTransport,
  });

  useEffect(() => {
    try {
      if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(TEASER_STORAGE_KEY)) {
        setShowTeaser(false);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let timeoutId;
    const onSplashComplete = () => {
      timeoutId = setTimeout(() => setChatRevealed(true), CHAT_REVEAL_DELAY_MS);
    };
    window.addEventListener("splashComplete", onSplashComplete);
    const fallback = setTimeout(() => setChatRevealed(true), CHAT_REVEAL_FALLBACK_MS);
    return () => {
      window.removeEventListener("splashComplete", onSplashComplete);
      clearTimeout(timeoutId);
      clearTimeout(fallback);
    };
  }, []);

  function dismissTeaser() {
    setShowTeaser(false);
    try {
      sessionStorage.setItem(TEASER_STORAGE_KEY, "true");
    } catch (_) {}
  }

  function openChatAndDismiss() {
    setOpen(true);
    dismissTeaser();
  }

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ text });

    const nav = getNavigationForMessage(text);
    if (nav) {
      const fullPath = nav.hash ? `${nav.path}#${nav.hash}` : nav.path;
      const current = pathname || "/";
      const currentHash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
      if (current !== nav.path || currentHash !== (nav.hash || "")) {
        router.push(fullPath);
        setTimeout(() => scrollToHash(nav.hash), 700);
      } else {
        setTimeout(() => scrollToHash(nav.hash), 150);
      }
    }
  }

  return (
    <>
      {/* Bottom-right eye-catcher teaser, just above the chat button (first visit per session) */}
      {chatRevealed && showTeaser && (
        <div
          className="animate-chat-in fixed bottom-20 right-6 z-[99998] flex items-center gap-3 rounded-2xl border border-white/15 bg-black/90 px-3 py-2 shadow-xl backdrop-blur-sm"
          role="banner"
          aria-label="Chat with Fayad - AI assistant"
        >
          <button
            type="button"
            onClick={openChatAndDismiss}
            className="flex items-center gap-2 rounded-xl transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Open chat"
          >
            <span className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-black">
              <img
                src="/ai.gif"
                alt=""
                className="h-full w-full object-cover"
                width={56}
                height={56}
                loading="eager"
                decoding="async"
                style={{ display: "block" }}
              />
            </span>
            <span className="text-sm font-medium text-white">Chat with Fayad</span>
          </button>
          <button
            type="button"
            onClick={dismissTeaser}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Toggle button - bottom right (revealed after splash + 2.5s with animation) */}
      {chatRevealed && (
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="animate-chat-in-delay fixed bottom-6 right-6 z-[99999] flex flex-col items-center gap-2 bg-transparent sm:bg-black/95 px-3 py-3 text-white sm:shadow-xl transition focus:outline-none focus:ring-2 focus:ring-white/40"
        aria-label={open ? "Close chat" : "Start chat with Fayad"}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 99999,
          background: "transparent",
          color: "#fff",
          padding: "10px 12px",
      
          cursor: "pointer",
          boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "14px",
          fontWeight: 500,
        }}
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <>
            {/* Mobile: bubble itself acts as the button */}
            <div className="sm:hidden">
              <div className="rounded-2xl bg-red-700 px-4 py-2 shadow-[0_0_18px_rgba(4,10,110,0.7)]">
                <span className="text-sm text-white font-bold font-offbit whitespace-nowrap">
                  Start chat with Fayad
                </span>
              </div>
            </div>

            {/* Desktop / tablet: bubble + GIF */}
            <div className="relative mt-1 hidden sm:block sm:h-32 sm:w-32">
              {/* Message bubble floating above orb, with tail pointing to the orb */}
              <div className="pointer-events-none absolute -top-9 right-0">
                <div className="relative rounded-2xl bg-red-700 px-4 py-2 shadow-[0_0_18px_rgba(4,10,110,0.7)]">
                  <span className="text-lg text-white font-bold font-offbit whitespace-nowrap">
                    Start chat with Fayad
                  </span>
                  {/* Tail on bottom edge, pointing toward the GIF */}
                  <div className="absolute -bottom-1 right-3 h-3 w-3 bg-red-700 rotate-45" />
                </div>
              </div>

              {/* AI orb gif */}
              <div className="flex h-32 w-32 rounded-lg bg-black items-center justify-center overflow-hidden">
                <img
                  src="/ai-red-1.gif"
                  alt=""
                  className="h-full w-full rounded-lg object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </>
        )}
      </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className={`fixed right-6 z-[99999] flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-black shadow-2xl transition-all duration-300 ease-out ${
            expanded
              ? "bottom-6 h-[85vh] w-[50vw] min-w-[360px] max-w-[720px]"
              : "bottom-24 h-[420px] w-[360px] max-w-[calc(100vw-3rem)]"
          }`}
          style={{ position: "fixed" }}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <h3 className="font-semibold text-white">Chat with Fayad</h3>
              <p className="text-xs text-white/60">Full-Stack Developer & AI</p>
            </div>
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label={expanded ? "Collapse chat" : "Expand chat"}
            >
              {expanded ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {messages.length === 0 && (
              <p className="text-sm leading-relaxed text-white/70">
                Hi! I&apos;m Fayad. Ask me about my work, projects, or tech stack.
              </p>
            )}
            {messages.map((m) => {
              const text = getMessageText(m);
              if (!text) return null;
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm ${
                      isUser
                        ? "bg-white text-black"
                        : "rounded-2xl border border-white/10 bg-white/5 shadow-inner"
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap break-words leading-relaxed">
                        {text}
                      </p>
                    ) : (
                      <AssistantMessageContent text={text} />
                    )}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-white/70" />
                  <span className="text-sm text-white/70">Thinking…</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="border-t border-white/10 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-xl bg-white px-4 py-2.5 text-black transition hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-white"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default function ChatWidget() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(<ChatWidgetContent />, document.body);
}
