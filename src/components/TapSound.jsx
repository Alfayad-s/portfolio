"use client";

import { playTapSound } from "@/lib/tap-sound";
import { useEffect } from "react";

export default function TapSound() {
  useEffect(() => {
    const onPointerDown = (event) => {
      if (event.button != null && event.button !== 0) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const control = target.closest("button, a, [role='button']");
      if (!control || control.closest("[data-silent]")) return;
      if (control.matches(":disabled, [aria-disabled='true']")) return;
      playTapSound();
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, []);

  return null;
}
