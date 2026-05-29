"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Webcam from "react-webcam";
import type { Results } from "@mediapipe/hands";
import {
  PINCH_CLICK_COOLDOWN_MS,
  clickAtCursor,
  createHandScrollState,
  isScrollGesture,
  isThumbIndexPinch,
  landmarkToViewportClient,
  restoreNativeCursor,
  syncBrowserCursor,
  updateHandScroll,
  updateSmoothedCursor,
} from "@/lib/handCursor";

const MEDIAPIPE_CDN =
  "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240";

/** MediaPipe landmark indices */
const WRIST = 0;
const INDEX_TIP = 8;
const INDEX_PIP = 6;
const MIDDLE_TIP = 12;
const RING_TIP = 16;
const PINKY_TIP = 20;

/** MediaPipe fingertip landmark indices */
const FINGERTIPS = [4, 8, 12, 16, 20] as const;
const FINGER_NAMES = ["thumb", "index", "middle", "ring", "pinky"] as const;
const ELASTIC_MAX_PX = 200;
/** Pinch to latch a band; pinch the same pair again to remove */
const PINCH_ON_RATIO = 0.11;
const TOGGLE_COOLDOWN_MS = 400;
const SPARKLE_LIFE_MS = 700;
const SPARKLE_BURST_COUNT = 14;
type Point = { x: number; y: number; z: number };

type Sparkle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
  life: number;
  size: number;
  color: string;
  rotation: number;
  spin: number;
};

function locateFile(file: string) {
  return `${MEDIAPIPE_CDN}/${file}`;
}

function landmarkToPixel(
  lm: { x: number; y: number; z: number },
  width: number,
  height: number
): Point {
  return { x: lm.x * width, y: lm.y * height, z: lm.z };
}

function lerpColor(t: number) {
  const r = Math.round(59 + t * (255 - 59));
  const g = Math.round(130 + t * (50 - 130));
  const b = Math.round(246 + t * (80 - 246));
  return `rgb(${r}, ${g}, ${b})`;
}

function drawJoint(ctx: CanvasRenderingContext2D, pt: Point) {
  const depthBoost = Math.max(0, Math.min(1, 0.5 - pt.z)) * 4;
  ctx.fillStyle = "rgba(96, 165, 250, 0.95)";
  ctx.shadowColor = "#60a5fa";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(pt.x, pt.y, 4 + depthBoost, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function handSpan(pts: Point[]) {
  return Math.hypot(pts[0].x - pts[9].x, pts[0].y - pts[9].y) || 100;
}

function pinchThreshold(span: number, ratio: number) {
  return Math.max(28, span * ratio);
}

function crossPairKey(tipIndex: number) {
  return `cross:${tipIndex}`;
}

function fingerLabel(tipLandmark: number) {
  const i = FINGERTIPS.indexOf(tipLandmark as (typeof FINGERTIPS)[number]);
  return i >= 0 ? FINGER_NAMES[i] : "finger";
}

const SPARKLE_COLORS = [
  "#fbbf24",
  "#f472b6",
  "#60a5fa",
  "#34d399",
  "#ffffff",
] as const;

function spawnSparkleBurst(
  particles: Sparkle[],
  x: number,
  y: number,
  now: number,
  intensity = 1
) {
  const count = Math.round(SPARKLE_BURST_COUNT * intensity);
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
    const speed = (2.5 + Math.random() * 5) * intensity;
    particles.push({
      x: x + (Math.random() - 0.5) * 6,
      y: y + (Math.random() - 0.5) * 6,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      born: now,
      life: SPARKLE_LIFE_MS * (0.85 + Math.random() * 0.3),
      size: (2 + Math.random() * 5) * intensity,
      color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.2,
    });
  }
}

function drawSparkleStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number
) {
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const a = rotation + (i * Math.PI) / 2;
    const r = i % 2 === 0 ? size : size * 0.35;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function updateAndDrawSparkles(
  ctx: CanvasRenderingContext2D,
  particles: Sparkle[],
  now: number
) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    const age = now - p.born;
    if (age >= p.life) {
      particles.splice(i, 1);
      continue;
    }

    const t = age / p.life;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.12;
    p.vx *= 0.98;
    p.rotation += p.spin;

    const alpha = (1 - t) * (1 - t);
    const size = p.size * (1 - t * 0.4);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 12 * (1 - t);
    drawSparkleStar(ctx, p.x, p.y, size, p.rotation);
    ctx.restore();
  }
}

function drawRubberBand(
  ctx: CanvasRenderingContext2D,
  a: Point,
  b: Point,
  pulsePhase: number,
  options?: { latched?: boolean; justCreated?: boolean }
) {
  const dist = Math.hypot(a.x - b.x, a.y - b.y);
  const t = Math.min(1, dist / ELASTIC_MAX_PX);
  const pulsing = dist > ELASTIC_MAX_PX;
  const thickness = Math.max(1.5, 6.5 - t * 4.5);
  const pulseBoost = pulsing ? pulsePhase * 5 : 0;
  const color =
    options?.justCreated && t < 0.15
      ? "rgb(52, 211, 153)"
      : lerpColor(t);

  const sag = Math.min(40, dist * 0.2);
  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2 + sag;

  ctx.strokeStyle = color;
  ctx.lineWidth = thickness + pulseBoost;
  ctx.lineCap = "round";
  ctx.shadowColor = color;
  ctx.shadowBlur = 18 + (pulsing ? pulsePhase * 10 : 0);

  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.quadraticCurveTo(midX, midY, b.x, b.y);
  ctx.stroke();
  ctx.shadowBlur = 0;

  return { tension: t, pulsing };
}

type HandPoints = Point[];

type LatchState = {
  latched: boolean;
  wasPinching: boolean;
  lastToggleAt: number;
  /** Brief green flash right after link is created */
  createdAt: number;
};

type LatchedBand = {
  a: Point;
  b: Point;
  label: string;
  justCreated: boolean;
};

function getLatchState(store: Map<string, LatchState>, key: string) {
  let state = store.get(key);
  if (!state) {
    state = {
      latched: false,
      wasPinching: false,
      lastToggleAt: 0,
      createdAt: 0,
    };
    store.set(key, state);
  }
  return state;
}

type LatchEvent = { type: "latch" | "unlatch"; a: Point; b: Point };

/** Pinch once to latch; pinch same pair again to unlatch. */
function updateLatch(
  store: Map<string, LatchState>,
  key: string,
  isPinching: boolean,
  now: number
): { state: LatchState; event: LatchEvent["type"] | null } {
  const state = getLatchState(store, key);
  let event: LatchEvent["type"] | null = null;

  if (isPinching && !state.wasPinching) {
    if (now - state.lastToggleAt >= TOGGLE_COOLDOWN_MS) {
      if (state.latched) {
        state.latched = false;
        event = "unlatch";
      } else {
        state.latched = true;
        state.createdAt = now;
        event = "latch";
      }
      state.lastToggleAt = now;
    }
  }

  state.wasPinching = isPinching;
  return { state, event };
}

function collectCrossHandLatches(
  ptsA: HandPoints,
  ptsB: HandPoints,
  store: Map<string, LatchState>,
  now: number
) {
  const span = (handSpan(ptsA) + handSpan(ptsB)) / 2;
  const onPx = pinchThreshold(span, PINCH_ON_RATIO);
  const drawn: LatchedBand[] = [];
  const events: LatchEvent[] = [];

  for (const tip of FINGERTIPS) {
    const dist = Math.hypot(ptsA[tip].x - ptsB[tip].x, ptsA[tip].y - ptsB[tip].y);
    const key = crossPairKey(tip);
    const isPinching = dist <= onPx;
    const { state, event } = updateLatch(store, key, isPinching, now);

    if (event) {
      events.push({ type: event, a: ptsA[tip], b: ptsB[tip] });
    }

    if (state.latched) {
      drawn.push({
        a: ptsA[tip],
        b: ptsB[tip],
        label: `${fingerLabel(tip)} ↔ ${fingerLabel(tip)}`,
        justCreated: now - state.createdAt < 500,
      });
    }
  }

  return { bands: drawn, events };
}

function countLatched(store: Map<string, LatchState>) {
  let n = 0;
  for (const state of store.values()) {
    if (state.latched) n += 1;
  }
  return n;
}

function pruneLatchStore(store: Map<string, LatchState>, handCount: number) {
  for (const key of [...store.keys()]) {
    if (key.startsWith("h")) store.delete(key);
    if (handCount < 2 && key.startsWith("cross:")) store.delete(key);
  }
}

function dist2(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Index extended, other fingers curled — pointing gesture */
function isPointingGesture(pts: HandPoints) {
  const wrist = pts[WRIST];
  const indexTip = pts[INDEX_TIP];
  const indexPip = pts[INDEX_PIP];
  const indexTipDist = dist2(indexTip, wrist);
  const indexPipDist = dist2(indexPip, wrist);

  if (indexTipDist < indexPipDist * 1.08) return false;

  const curledMax = indexTipDist * 0.92;
  return (
    dist2(pts[MIDDLE_TIP], wrist) < curledMax &&
    dist2(pts[RING_TIP], wrist) < curledMax &&
    dist2(pts[PINKY_TIP], wrist) < curledMax
  );
}

type CursorState = {
  x: number;
  y: number;
  active: boolean;
};

function drawHandJoints(
  ctx: CanvasRenderingContext2D,
  pts: HandPoints,
  hideIndexTip = false
) {
  pts.forEach((p, i) => {
    if (hideIndexTip && i === INDEX_TIP) return;
    drawJoint(ctx, p);
  });
}

type ElasticHandTrackerProps = {
  variant?: "default" | "fullscreen";
};

export default function ElasticHandTracker({
  variant = "default",
}: ElasticHandTrackerProps) {
  const isFullscreen = variant === "fullscreen";
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handsRef = useRef<import("@mediapipe/hands").Hands | null>(null);
  const runningRef = useRef(false);
  const processingRef = useRef(false);
  const rafRef = useRef(0);
  const pulseRef = useRef(0);
  const latchStoreRef = useRef<Map<string, LatchState>>(new Map());
  const sparklesRef = useRef<Sparkle[]>([]);
  const fingerCursorRef = useRef<CursorState>({ x: 0, y: 0, active: false });
  const browserCursorElRef = useRef<HTMLDivElement | null>(null);
  const lastHoverElRef = useRef<Element | null>(null);
  const wasPinchingRef = useRef(false);
  const lastClickAtRef = useRef(0);
  const scrollStateRef = useRef(createHandScrollState());
  const [portalReady, setPortalReady] = useState(false);
  const autoStartedRef = useRef(false);
  const fpsFramesRef = useRef(0);
  const fpsLastRef = useRef(performance.now());

  const [cameraActive, setCameraActive] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [fps, setFps] = useState(0);
  const [handsCount, setHandsCount] = useState(0);
  const [tension, setTension] = useState(0);
  const [pulsing, setPulsing] = useState(false);
  const [pinchCount, setPinchCount] = useState(0);
  const [cursorActive, setCursorActive] = useState(false);
  const [status, setStatus] = useState("Idle");

  const syncCanvasSize = useCallback(() => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }, []);

  const paintResults = useCallback((results: Results) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    if (!w || !h) return;

    ctx.clearRect(0, 0, w, h);

    const hands = results.multiHandLandmarks ?? [];
    const store = latchStoreRef.current;
    const now = performance.now();

    const handPts = hands.map((landmarks) =>
      landmarks.map((lm) => landmarkToPixel(lm, w, h))
    );

    let maxTension = 0;
    let anyPulse = false;
    const linkLabels: string[] = [];
    const cursor = fingerCursorRef.current;
    const scrollState = scrollStateRef.current;
    let pointing = false;
    let scrolling = false;

    if (hands.length === 1 && isScrollGesture(hands[0])) {
      scrolling = true;
      updateHandScroll(scrollState, hands[0]);
      updateSmoothedCursor(cursor, null);
      wasPinchingRef.current = false;
    } else if (hands.length === 1 && isPointingGesture(handPts[0])) {
      pointing = true;
      scrollState.lastY = null;
      scrollState.smoothedDelta = 0;
      updateSmoothedCursor(
        cursor,
        landmarkToViewportClient(hands[0][INDEX_TIP])
      );

      const pinching = isThumbIndexPinch(hands[0]);
      if (
        pinching &&
        !wasPinchingRef.current &&
        now - lastClickAtRef.current > PINCH_CLICK_COOLDOWN_MS
      ) {
        if (clickAtCursor(cursor)) {
          lastClickAtRef.current = now;
        }
      }
      wasPinchingRef.current = pinching;
    } else {
      scrollState.lastY = null;
      scrollState.smoothedDelta = 0;
      updateSmoothedCursor(cursor, null);
      wasPinchingRef.current = false;
    }

    syncBrowserCursor(browserCursorElRef.current, cursor, lastHoverElRef);

    for (let i = 0; i < handPts.length; i++) {
      const hideIndexTip = hands.length === 1 && pointing && i === 0;
      drawHandJoints(ctx, handPts[i], hideIndexTip);
    }

    if (handPts.length === 2) {
      const { bands: crossBands, events } = collectCrossHandLatches(
        handPts[0],
        handPts[1],
        store,
        now
      );

      for (const ev of events) {
        const midX = (ev.a.x + ev.b.x) / 2;
        const midY = (ev.a.y + ev.b.y) / 2;
        if (ev.type === "latch") {
          spawnSparkleBurst(sparklesRef.current, midX, midY, now, 1.2);
          spawnSparkleBurst(sparklesRef.current, ev.a.x, ev.a.y, now, 0.75);
          spawnSparkleBurst(sparklesRef.current, ev.b.x, ev.b.y, now, 0.75);
        } else {
          spawnSparkleBurst(sparklesRef.current, midX, midY, now, 0.5);
        }
      }

      for (const band of crossBands) {
        const m = drawRubberBand(ctx, band.a, band.b, pulseRef.current, {
          latched: true,
          justCreated: band.justCreated,
        });
        maxTension = Math.max(maxTension, m.tension);
        anyPulse = anyPulse || m.pulsing;
        linkLabels.push(`L/R ${band.label}`);
      }
    }

    updateAndDrawSparkles(ctx, sparklesRef.current, now);

    if (hands.length === 0) {
      store.clear();
      sparklesRef.current.length = 0;
    } else {
      pruneLatchStore(store, hands.length);
    }

    const latchedCount = countLatched(store);

    setHandsCount(hands.length);
    setPinchCount(latchedCount);
    setCursorActive(cursor.active);
    setTension(Math.round(maxTension * 100));
    setPulsing(anyPulse);
    setStatus(
      hands.length === 0
        ? "No hands — show one hand to point, two to link"
        : hands.length === 1
          ? scrolling
            ? "Scrolling — move index+middle up/down"
            : pointing
              ? "Cursor on — pinch thumb+index to click"
              : "Index point = cursor · index+middle = scroll"
          : linkLabels.length > 0
            ? `Linked: ${linkLabels.slice(0, 2).join(", ")}${linkLabels.length > 2 ? "…" : ""} — pull to stretch`
            : "Two hands — pinch matching fingertips L↔R to link"
    );

    fpsFramesRef.current += 1;
    if (now - fpsLastRef.current >= 1000) {
      setFps(fpsFramesRef.current);
      fpsFramesRef.current = 0;
      fpsLastRef.current = now;
    }
  }, []);

  const initMediaPipe = useCallback(async () => {
    const { Hands } = await import("@mediapipe/hands");
    const hands = new Hands({ locateFile });
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
      selfieMode: true,
    });
    hands.onResults((results) => {
      paintResults(results);
      processingRef.current = false;
    });
    await hands.initialize();
    handsRef.current = hands;
  }, [paintResults]);

  const processLoop = useCallback(async () => {
    if (!runningRef.current) return;

    const video = webcamRef.current?.video;
    const hands = handsRef.current;

    if (
      hands &&
      video &&
      video.readyState >= 2 &&
      video.videoWidth > 0 &&
      !processingRef.current
    ) {
      processingRef.current = true;
      pulseRef.current = (Math.sin(performance.now() / 120) + 1) / 2;
      try {
        await hands.send({ image: video });
      } catch {
        processingRef.current = false;
      }
    }

    rafRef.current = requestAnimationFrame(processLoop);
  }, []);

  const waitForVideo = useCallback(async () => {
    const start = performance.now();
    while (performance.now() - start < 12000) {
      const video = webcamRef.current?.video;
      if (video && video.readyState >= 2 && video.videoWidth > 0) {
        try {
          await video.play();
        } catch {
          /* autoplay may already be running */
        }
        return video;
      }
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
    }
    throw new Error(
      "Camera not ready — allow webcam access in your browser settings."
    );
  }, []);

  const start = useCallback(() => {
    setLoadError(null);
    setInitializing(true);
    setCameraActive(true);
    setStatus("Starting camera…");
  }, []);

  useEffect(() => {
    if (isFullscreen && !autoStartedRef.current) {
      autoStartedRef.current = true;
      start();
    }
  }, [isFullscreen, start]);

  useEffect(() => {
    if (!cameraActive || !initializing) return;

    let cancelled = false;

    (async () => {
      try {
        await waitForVideo();
        if (cancelled) return;

        syncCanvasSize();
        setStatus("Downloading MediaPipe models…");

        if (!handsRef.current) {
          await initMediaPipe();
        }
        if (cancelled) return;

        runningRef.current = true;
        setStatus("Calibrated — move your hands");
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(processLoop);
      } catch (err) {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : "Failed to start");
        runningRef.current = false;
        setCameraActive(false);
        setStatus("Idle");
      } finally {
        if (!cancelled) setInitializing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    cameraActive,
    initializing,
    initMediaPipe,
    processLoop,
    syncCanvasSize,
    waitForVideo,
  ]);

  const stop = useCallback(() => {
    runningRef.current = false;
    cancelAnimationFrame(rafRef.current);
    setInitializing(false);
    setCameraActive(false);
    setHandsCount(0);
    setTension(0);
    setPulsing(false);
    setPinchCount(0);
    setCursorActive(false);
    setFps(0);
    setStatus("Idle");
    latchStoreRef.current.clear();
    sparklesRef.current.length = 0;
    fingerCursorRef.current.active = false;
    const scrollState = scrollStateRef.current;
    scrollState.lastY = null;
    scrollState.smoothedDelta = 0;
    syncBrowserCursor(browserCursorElRef.current, fingerCursorRef.current, lastHoverElRef);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    if (!cameraActive) return;
    const onResize = () => syncCanvasSize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [cameraActive, syncCanvasSize]);

  useEffect(() => {
    setPortalReady(true);
    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      handsRef.current?.close();
      restoreNativeCursor();
      lastHoverElRef.current = null;
    };
  }, []);

  const browserCursorPortal =
    portalReady && cameraActive
      ? createPortal(
          <div
            ref={browserCursorElRef}
            className="pointer-events-none fixed left-0 top-0 z-[99999] hidden will-change-[left,top]"
            aria-hidden
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              className="-translate-x-[5px] -translate-y-[4px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]"
            >
              <path
                d="M5 4L5 26L11 19.5L15.5 28L19 26.5L14 18.5L23 17L5 4Z"
                fill="white"
                stroke="#0f172a"
                strokeWidth="1.75"
                strokeLinejoin="round"
              />
            </svg>
          </div>,
          document.body
        )
      : null;

  const videoBlock = (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-0 bg-black"
          : "relative aspect-[4/3] w-full bg-zinc-950 sm:aspect-video"
      }
    >
          {cameraActive && (
            <div className="absolute inset-0 overflow-hidden">
              <Webcam
                ref={webcamRef}
                audio={false}
                muted
                mirrored
                playsInline
                onLoadedMetadata={syncCanvasSize}
                onUserMedia={syncCanvasSize}
                onUserMediaError={(err) => {
                  const message =
                    err instanceof DOMException
                      ? err.message
                      : "Could not access webcam";
                  setLoadError(message);
                  setCameraActive(false);
                  setInitializing(false);
                  runningRef.current = false;
                }}
                videoConstraints={{
                  facingMode: "user",
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                }}
                className="absolute inset-0 z-0 h-full w-full object-cover"
              />
              <canvas
                ref={canvasRef}
                className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover"
                aria-hidden
              />
            </div>
          )}

          {!cameraActive && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-zinc-950 via-black to-blue-950/20 p-6 text-center">
              <p className="max-w-md text-sm text-zinc-400">
                One hand + point index finger for cursor. Two hands for
                cross-hand links and sparkles.
              </p>
              <button
                type="button"
                onClick={start}
                disabled={initializing}
                className="rounded-full border border-blue-500/40 bg-blue-600/90 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
              >
                {initializing ? "Starting…" : "Start Camera"}
              </button>
              {loadError && (
                <p className="max-w-sm text-xs text-red-400">{loadError}</p>
              )}
            </div>
          )}

          {cameraActive && initializing && (
            <div className="pointer-events-none absolute inset-x-0 bottom-14 z-20 flex justify-center px-4 sm:bottom-16">
              <p className="rounded-full border border-white/15 bg-black/70 px-4 py-2 text-xs text-blue-200 backdrop-blur-md">
                {status}
              </p>
            </div>
          )}

          {cameraActive && !initializing && !isFullscreen && (
            <div className="pointer-events-none absolute inset-x-0 top-0 z-30 p-3 sm:p-4">
              <div className="rounded-xl border border-white/15 bg-black/55 px-4 py-3 backdrop-blur-md">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-400">
                  MediaPipe Hands
                </p>
                <dl className="space-y-1.5 text-xs text-zinc-200">
                  <div className="flex justify-between gap-6">
                    <dt className="text-zinc-500">FPS</dt>
                    <dd className="font-mono tabular-nums">{fps}</dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-zinc-500">Hands</dt>
                    <dd className="font-mono tabular-nums">{handsCount}</dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-zinc-500">Links</dt>
                    <dd className="font-mono tabular-nums">{pinchCount}</dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-zinc-500">Cursor</dt>
                    <dd
                      className={`font-mono tabular-nums ${cursorActive ? "text-amber-400" : "text-zinc-500"}`}
                    >
                      {cursorActive ? "On" : "Off"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-zinc-500">Tension</dt>
                    <dd className="font-mono tabular-nums">{tension}%</dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-zinc-500">Status</dt>
                    <dd className="max-w-[140px] text-right text-[10px] leading-snug">
                      {status}
                    </dd>
                  </div>
                  {pulsing && (
                    <p className="text-[10px] uppercase tracking-wider text-red-400">
                      Elastic snap — max stretch
                    </p>
                  )}
                </dl>
              </div>
            </div>
          )}

          {cameraActive && !isFullscreen && (
            <div className="absolute bottom-3 right-3 z-30 sm:bottom-4 sm:right-4">
              <button
                type="button"
                onClick={stop}
                className="rounded-lg border border-white/20 bg-black/50 px-3 py-1.5 text-xs text-zinc-300 backdrop-blur-md transition hover:border-red-500/50 hover:text-white"
              >
                Stop camera
              </button>
            </div>
          )}

          {cameraActive && !initializing && isFullscreen && (
            <div className="pointer-events-none absolute inset-x-0 bottom-4 z-30 flex justify-center px-4">
              <div className="rounded-xl border border-white/15 bg-black/55 px-4 py-2 text-[10px] text-zinc-300 backdrop-blur-md sm:text-xs">
                {status} · FPS {fps} · Links {pinchCount}
              </div>
            </div>
          )}
        </div>
  );

  if (isFullscreen) {
    return (
      <>
        {browserCursorPortal}
        {videoBlock}
      </>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {browserCursorPortal}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl shadow-red-950/20 backdrop-blur-xl">
        {videoBlock}
        <div className="grid gap-3 border-t border-white/10 bg-white/5 p-4 text-xs text-zinc-400 sm:grid-cols-3 sm:text-sm">
          <p>
            <span className="text-blue-400">Cursor</span> — point to move, pinch
            thumb+index to click
          </p>
          <p>
            <span className="text-emerald-400">Cross-hand only</span> — same
            finger L↔R; no links within one hand
          </p>
          <p>
            <span className="text-amber-400">Pinch</span> — thumb+index tap to
            click links
          </p>
        </div>
      </div>
    </div>
  );
}
