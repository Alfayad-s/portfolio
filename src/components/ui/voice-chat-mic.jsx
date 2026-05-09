"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function pickMimeType() {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
  ];
  for (const t of candidates) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return "";
}

/**
 * Push-to-talk: tap to start recording, tap again to stop and transcribe via /api/transcribe.
 */
export function VoiceChatMic({
  overlayOpen,
  disabled,
  chatBusy,
  onTranscript,
  className,
}) {
  const [phase, setPhase] = useState("idle");
  const recRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const stopStream = useCallback(() => {
    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const stopRecorder = useCallback(() => {
    const r = recRef.current;
    if (r && r.state !== "inactive") {
      try {
        r.stop();
      } catch {
        /* ignore */
      }
    }
    recRef.current = null;
  }, []);

  useEffect(() => {
    if (!overlayOpen) {
      stopRecorder();
      stopStream();
      setPhase((p) => (p === "transcribing" ? p : "idle"));
    }
  }, [overlayOpen, stopRecorder, stopStream]);

  useEffect(
    () => () => {
      stopRecorder();
      stopStream();
    },
    [stopRecorder, stopStream]
  );

  const toggle = useCallback(async () => {
    if (disabled || chatBusy) return;

    if (phase === "transcribing") return;

    if (phase === "recording") {
      stopRecorder();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;
      chunksRef.current = [];

      const mime = pickMimeType();
      const rec = new MediaRecorder(
        stream,
        mime ? { mimeType: mime } : undefined
      );
      recRef.current = rec;

      rec.ondataavailable = (e) => {
        if (e.data?.size) chunksRef.current.push(e.data);
      };

      rec.onerror = () => {
        stopStream();
        setPhase("idle");
      };

      rec.onstop = async () => {
        stopStream();
        const mimeType = rec.mimeType || mime || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];

        if (blob.size < 256) {
          setPhase("idle");
          return;
        }

        setPhase("transcribing");
        try {
          const fd = new FormData();
          fd.append(
            "file",
            blob,
            mimeType.includes("mp4") ? "recording.m4a" : "recording.webm"
          );
          const res = await fetch("/api/transcribe", { method: "POST", body: fd });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(data.error || "Transcription failed");
          }
          const text = String(data.text || "").trim();
          if (text) onTranscript(text);
        } catch {
          /* non-fatal */
        } finally {
          setPhase("idle");
        }
      };

      rec.start(220);
      setPhase("recording");
    } catch {
      stopStream();
      setPhase("idle");
    }
  }, [
    phase,
    disabled,
    chatBusy,
    onTranscript,
    stopRecorder,
    stopStream,
  ]);

  const recording = phase === "recording";
  const transcribing = phase === "transcribing";
  const micDisabled =
    disabled || chatBusy || transcribing || !overlayOpen;

  return (
    <button
      type="button"
      aria-label={
        transcribing
          ? "Transcribing voice"
          : recording
            ? "Stop recording and send"
            : "Record voice message"
      }
      aria-pressed={recording}
      onMouseDown={(e) => e.preventDefault()}
      disabled={micDisabled}
      onClick={toggle}
      className={cn(
        "relative z-[1] ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-0 bg-transparent transition-colors",
        recording
          ? "text-red-400 bg-red-500/20 ring-2 ring-red-500/40 animate-pulse"
          : transcribing
            ? "text-neutral-400"
            : "text-gray-400 hover:bg-white/5 hover:text-red-400",
        micDisabled && !recording && "opacity-40",
        className
      )}
    >
      {transcribing ? (
        <Loader2 className="size-4 animate-spin" strokeWidth={2} aria-hidden />
      ) : recording ? (
        <Square className="size-3.5 fill-current" aria-hidden />
      ) : (
        <Mic className="size-[15px]" strokeWidth={2} aria-hidden />
      )}
    </button>
  );
}
