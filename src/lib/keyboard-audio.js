import {
  SOUND_DEFINES_DOWN,
  SOUND_DEFINES_UP,
} from "@/components/ui/virtual-keyboard-sounds";

let audioCtx = null;
let audioBuffer = null;
let spriteLoaded = false;
let initPromise = null;

export function normalizeKeyboardVolume(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, n)) / 100;
}

function playSynthTap(ctx, phase, gainMul) {
  if (!ctx || gainMul <= 0) return;
  try {
    if (ctx.state === "suspended") void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(phase === "down" ? 920 : 740, ctx.currentTime);
    const t0 = ctx.currentTime;
    const peak = 0.052 * gainMul;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t0 + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.036);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + 0.04);
  } catch {
    /* ignore */
  }
}

/**
 * Warm up AudioContext and optionally load /sounds/sound.ogg sprite.
 */
export function ensureKeyboardAudio() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (audioCtx) return Promise.resolve({ ctx: audioCtx, buffer: audioBuffer, spriteLoaded });

  if (!initPromise) {
    initPromise = (async () => {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
      try {
        const response = await fetch("/sounds/sound.ogg");
        if (response.ok) {
          const raw = await response.arrayBuffer();
          audioBuffer = await audioCtx.decodeAudioData(raw);
          spriteLoaded = true;
        }
      } catch {
        /* synth only */
      }
      return { ctx: audioCtx, buffer: audioBuffer, spriteLoaded };
    })();
  }

  return initPromise;
}

export function playKeyboardSoundDown(keyCode, volumePct = 100) {
  const g = normalizeKeyboardVolume(volumePct);
  if (g <= 0) return;
  const ctx = audioCtx;
  if (!ctx) {
    void ensureKeyboardAudio().then(() => playKeyboardSoundDown(keyCode, volumePct));
    return;
  }

  if (spriteLoaded && audioBuffer) {
    const def = SOUND_DEFINES_DOWN[keyCode];
    if (!def) {
      playSynthTap(ctx, "down", g);
      return;
    }
    const [startMs, durationMs] = def;
    try {
      if (ctx.state === "suspended") void ctx.resume();
      const src = ctx.createBufferSource();
      const gn = ctx.createGain();
      gn.gain.value = g;
      src.buffer = audioBuffer;
      src.connect(gn);
      gn.connect(ctx.destination);
      src.start(0, startMs / 1000, durationMs / 1000);
    } catch {
      playSynthTap(ctx, "down", g);
    }
    return;
  }

  playSynthTap(ctx, "down", g);
}

export function playKeyboardSoundUp(keyCode, volumePct = 100) {
  const g = normalizeKeyboardVolume(volumePct);
  if (g <= 0) return;
  const ctx = audioCtx;
  if (!ctx) {
    void ensureKeyboardAudio().then(() => playKeyboardSoundUp(keyCode, volumePct));
    return;
  }

  if (spriteLoaded && audioBuffer) {
    const def = SOUND_DEFINES_UP[keyCode];
    if (!def) {
      playSynthTap(ctx, "up", g * 0.85);
      return;
    }
    const [startMs, durationMs] = def;
    try {
      if (ctx.state === "suspended") void ctx.resume();
      const src = ctx.createBufferSource();
      const gn = ctx.createGain();
      gn.gain.value = g;
      src.buffer = audioBuffer;
      src.connect(gn);
      gn.connect(ctx.destination);
      src.start(0, startMs / 1000, durationMs / 1000);
    } catch {
      playSynthTap(ctx, "up", g * 0.85);
    }
    return;
  }

  playSynthTap(ctx, "up", g * 0.85);
}
