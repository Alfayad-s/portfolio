"use client";

import { Hand } from "lucide-react";
import { useHandCursor } from "@/context/HandCursorContext";

export default function HandCursorToggle() {
  const { enabled, toggle, tracking, error } = useHandCursor();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Disable hand cursor" : "Enable hand cursor"}
      title={
        error ??
        (enabled
          ? "Hand on — index point moves cursor, index+middle scrolls, pinch to click"
          : "Enable hand cursor")
      }
      className={`flex h-9 w-9 items-center justify-center border transition ${
        enabled
          ? tracking
            ? "border-amber-500/60 bg-amber-500/15 text-amber-400"
            : "border-blue-500/50 bg-blue-500/15 text-blue-400"
          : "border-[rgba(224,28,28,0.25)] text-[#888] hover:border-[#e01c1c] hover:text-[#f5f5f0]"
      }`}
    >
      <Hand size={18} strokeWidth={1.75} />
    </button>
  );
}
