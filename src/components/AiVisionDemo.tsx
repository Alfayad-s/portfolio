"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import type { Config, FaceResult, HandResult, Result } from "@vladmandic/human";

const MODEL_BASE = "/models/";
const ELASTIC_MAX_PX = 200;
const THUMB_TIP = 4;

/** MediaPipe fingertip indices — matched across left/right hands only. */
const FINGER_TIPS = [4, 8, 12, 16, 20] as const;

type HumanInstance = {
  detect: (input: HTMLVideoElement) => Promise<Result>;
  load: () => Promise<void>;
  warmup: (profile?: string) => Promise<void>;
};

type Point = { x: number; y: number };

type FingerName = "thumb" | "index" | "middle" | "ring" | "pinky";

type HumanPoint =
  | Point
  | [number, number]
  | [number, number, number]
  | { position: [number, number] | [number, number, number] };

type CoordSpace = {
  detW: number;
  detH: number;
  outW: number;
  outH: number;
  mirror: boolean;
};

function readHumanPoint(raw: HumanPoint): Point | null {
  if (Array.isArray(raw)) {
    const [x, y] = raw;
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    return { x, y };
  }
  if (raw && typeof raw === "object") {
    if ("position" in raw && Array.isArray(raw.position)) {
      const [x, y] = raw.position;
      if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
      return { x, y };
    }
    if ("x" in raw && "y" in raw) {
      const { x, y } = raw as Point;
      if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
      return { x, y };
    }
  }
  return null;
}

/** Map Human landmark → canvas pixel (detection space → video size → mirror). */
function mapPoint(raw: HumanPoint, space: CoordSpace): Point | null {
  const base = readHumanPoint(raw);
  if (!base) return null;

  let { x, y } = base;

  if (x <= 1 && y <= 1 && x >= 0 && y >= 0) {
    x *= space.detW;
    y *= space.detH;
  }

  x *= space.outW / space.detW;
  y *= space.outH / space.detH;

  if (space.mirror) {
    x = space.outW - x;
  }

  return { x, y };
}

const FINGER_ANN_MAP: { finger: FingerName; startIdx: number }[] = [
  { finger: "thumb", startIdx: 1 },
  { finger: "index", startIdx: 5 },
  { finger: "middle", startIdx: 9 },
  { finger: "ring", startIdx: 13 },
  { finger: "pinky", startIdx: 17 },
];

function fillHandPoints(points: (Point | undefined)[]): Point[] | null {
  let last: Point | undefined;
  for (let i = 0; i < 21; i++) {
    if (points[i]) last = points[i];
    else if (last) points[i] = last;
  }
  const valid = points.filter((p): p is Point => Boolean(p));
  return valid.length >= 8 ? (points as Point[]) : null;
}

function resolveHandKeypoints(
  hand: HandResult,
  space: CoordSpace
): Point[] | null {
  const ann = hand.annotations;

  if (ann?.palm?.[0]) {
    const wrist = mapPoint(ann.palm[0] as HumanPoint, space);
    if (!wrist) return null;

    const points: (Point | undefined)[] = new Array(21);
    points[0] = wrist;

    for (const { finger, startIdx } of FINGER_ANN_MAP) {
      const chain = ann[finger];
      if (!chain?.length) continue;
      chain.forEach((raw, i) => {
        const pt = mapPoint(raw as HumanPoint, space);
        if (pt) points[startIdx + i] = pt;
      });
    }

    const filled = fillHandPoints(points);
    if (filled) return filled;
  }

  if (hand.keypoints?.length) {
    const points: (Point | undefined)[] = new Array(21);
    for (let i = 0; i < Math.min(21, hand.keypoints.length); i++) {
      points[i] =
        mapPoint(hand.keypoints[i] as HumanPoint, space) ?? undefined;
    }
    const filled = fillHandPoints(points);
    if (filled) return filled;
  }

  return null;
}

function mapBox(
  box: [number, number, number, number],
  space: CoordSpace
): [number, number, number, number] {
  const x1 = box[0] * (space.outW / space.detW);
  const y1 = box[1] * (space.outH / space.detH);
  const bw = box[2] * (space.outW / space.detW);
  const bh = box[3] * (space.outH / space.detH);
  if (space.mirror) {
    return [space.outW - x1 - bw, y1, bw, bh];
  }
  return [x1, y1, bw, bh];
}

function capitalizeEmotion(emotion: string) {
  return emotion.charAt(0).toUpperCase() + emotion.slice(1);
}

function getBestFace(faces: FaceResult[] | undefined) {
  if (!faces?.length) return null;
  return faces.reduce((best, face) =>
    face.score > best.score ? face : best
  );
}

function getPrimaryEmotion(face: FaceResult | null) {
  if (!face?.emotion?.length) return "Neutral";
  const top = face.emotion.reduce((a, b) => (a.score > b.score ? a : b));
  return capitalizeEmotion(top.emotion);
}

function euclidean(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function lerpColor(t: number, variant: "default" | "cross" = "default") {
  if (variant === "cross") {
    const r = Math.round(96 + t * (224 - 96));
    const g = Math.round(165 * (1 - t));
    const b = Math.round(250 * (1 - t * 0.5));
    return `rgb(${r}, ${g}, ${b})`;
  }
  const r = Math.round(34 + t * (224 - 34));
  const g = Math.round(197 * (1 - t));
  return `rgb(${r}, ${g}, 64)`;
}

type BandMetrics = { tension: number; pulsing: boolean };

function drawElasticBand(
  ctx: CanvasRenderingContext2D,
  a: Point,
  b: Point,
  pulsePhase: number,
  options?: { variant?: "default" | "cross" }
): BandMetrics {
  if (
    !Number.isFinite(a.x) ||
    !Number.isFinite(a.y) ||
    !Number.isFinite(b.x) ||
    !Number.isFinite(b.y)
  ) {
    return { tension: 0, pulsing: false };
  }

  const dist = euclidean(a, b);
  const t = Math.min(1, dist / ELASTIC_MAX_PX);
  const pulsing = dist > ELASTIC_MAX_PX;
  const variant = options?.variant ?? "default";
  const color = lerpColor(t, variant);
  const thickness = Math.max(3, 7 - t * 4);
  const pulseBoost = pulsing ? pulsePhase * 4 : 0;

  ctx.strokeStyle = color;
  ctx.lineWidth = thickness + pulseBoost;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowColor = color;
  ctx.shadowBlur = 16;

  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  ctx.shadowBlur = 0;

  return { tension: t, pulsing };
}

function drawJoint(
  ctx: CanvasRenderingContext2D,
  pt: Point,
  color: string,
  pulsePhase: number,
  pulsing: boolean
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(pt.x, pt.y, 6 + (pulsing ? pulsePhase * 2 : 0), 0, Math.PI * 2);
  ctx.fill();
}

/** Fingertip markers only — no bands within the same hand. */
function drawHandFingertips(
  ctx: CanvasRenderingContext2D,
  hand: HandResult,
  space: CoordSpace
): boolean {
  const kp = resolveHandKeypoints(hand, space);
  if (!kp) return false;

  for (const tipIdx of FINGER_TIPS) {
    drawJoint(ctx, kp[tipIdx], "#22c55e", 0, false);
  }
  return true;
}

/** Elastic bands: left thumb↔right thumb, index↔index, … (same finger only). */
function drawCrossHandMatchingFingers(
  ctx: CanvasRenderingContext2D,
  hands: HandResult[],
  pulsePhase: number,
  space: CoordSpace
): BandMetrics {
  let maxTension = 0;
  let anyPulsing = false;

  const valid = hands
    .map((h) => ({ hand: h, kp: resolveHandKeypoints(h, space) }))
    .filter((entry): entry is { hand: HandResult; kp: Point[] } =>
      Boolean(entry.kp)
    )
    .sort((a, b) => a.kp[THUMB_TIP].x - b.kp[THUMB_TIP].x);

  if (valid.length < 2) {
    return { tension: 0, pulsing: false };
  }

  const left = valid[0].kp;
  const right = valid[valid.length - 1].kp;

  const record = (m: BandMetrics) => {
    maxTension = Math.max(maxTension, m.tension);
    anyPulsing = anyPulsing || m.pulsing;
  };

  for (const tip of FINGER_TIPS) {
    record(
      drawElasticBand(ctx, left[tip], right[tip], pulsePhase, {
        variant: "cross",
      })
    );
  }

  return { tension: maxTension, pulsing: anyPulsing };
}

function createHumanConfig(): Partial<Config> {
  return {
    backend: "webgl",
    modelBasePath: MODEL_BASE,
    debug: false,
    async: true,
    cacheModels: true,
    face: {
      enabled: true,
      description: { enabled: false },
      iris: { enabled: false },
      attention: { enabled: false },
      antispoof: { enabled: false },
      liveness: { enabled: false },
    },
    hand: {
      enabled: true,
      rotation: true,
      landmarks: true,
      maxDetected: 2,
      minConfidence: 0.15,
      skipFrames: 0,
      skipTime: 0,
      detector: { modelPath: "handtrack.json" },
      skeleton: { modelPath: "handlandmark-lite.json" },
    },
    body: { enabled: false },
    object: { enabled: false },
    gesture: { enabled: false },
    segmentation: { enabled: false },
  };
}

async function createHuman(): Promise<HumanInstance> {
  const { default: Human } = await import("@vladmandic/human");
  const human = new Human(createHumanConfig()) as HumanInstance;
  await human.load();
  await human.warmup("full");
  return human;
}

async function waitForWebcamVideo(
  getVideo: () => HTMLVideoElement | null | undefined,
  timeoutMs = 8000
) {
  const start = performance.now();
  while (performance.now() - start < timeoutMs) {
    const video = getVideo();
    if (video && video.readyState >= 2 && video.videoWidth > 0) {
      return video;
    }
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  }
  throw new Error("Camera video not ready — allow webcam access and retry.");
}

export default function AiVisionDemo() {
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const humanRef = useRef<HumanInstance | null>(null);
  const rafRef = useRef<number>(0);
  const detectingRef = useRef(false);
  const runningRef = useRef(false);
  const fpsFramesRef = useRef(0);
  const fpsLastRef = useRef(performance.now());

  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [fps, setFps] = useState(0);
  const [emotion, setEmotion] = useState("—");
  const [tension, setTension] = useState(0);
  const [pulsing, setPulsing] = useState(false);
  const [handsCount, setHandsCount] = useState(0);
  const [trackedCount, setTrackedCount] = useState(0);
  const [status, setStatus] = useState("Idle");

  const syncCanvasSize = useCallback(() => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }, []);

  const drawFrame = useCallback((result: Result, pulsePhase: number) => {
    const canvas = canvasRef.current;
    const video = webcamRef.current?.video;
    if (!canvas || !video?.videoWidth) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const outW = video.videoWidth;
    const outH = video.videoHeight;
    const detW = result.width > 0 ? result.width : outW;
    const detH = result.height > 0 ? result.height : outH;

    if (canvas.width !== outW || canvas.height !== outH) {
      canvas.width = outW;
      canvas.height = outH;
    }

    // Webcam `mirrored` already flips the preview; landmarks stay in raw video space.
    const space: CoordSpace = {
      detW,
      detH,
      outW,
      outH,
      mirror: true,
    };

    ctx.clearRect(0, 0, outW, outH);

    const face = getBestFace(result.face);
    setEmotion(getPrimaryEmotion(face));

    if (face?.box) {
      const [bx, by, bw, bh] = mapBox(face.box, space);
      const label = getPrimaryEmotion(face);
      const labelX = bx + bw / 2;
      const labelY = Math.max(24, by - 16);

      ctx.font = "600 15px system-ui, sans-serif";
      const tw = ctx.measureText(label).width;
      const padX = 14;
      const boxW = tw + padX * 2;
      const boxH = 36;

      ctx.fillStyle = "rgba(8, 8, 8, 0.75)";
      ctx.strokeStyle = "rgba(224, 28, 28, 0.6)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(labelX - boxW / 2, labelY - boxH, boxW, boxH, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#f5f5f0";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, labelX, labelY - boxH / 2);
    }

    const hands = result.hand ?? [];
    let maxTension = 0;
    let isPulsing = false;
    let tracked = 0;

    for (const hand of hands) {
      if (drawHandFingertips(ctx, hand, space)) tracked += 1;
    }

    const crossMetrics = drawCrossHandMatchingFingers(
      ctx,
      hands,
      pulsePhase,
      space
    );
    maxTension = Math.max(maxTension, crossMetrics.tension);
    isPulsing = isPulsing || crossMetrics.pulsing;

    setTension(Math.round(maxTension * 100));
    setPulsing(isPulsing);
    setHandsCount(hands.length);
    setTrackedCount(tracked);
    setStatus(
      hands.length === 0
        ? "No hands detected"
        : tracked > 0
          ? `${tracked} hand(s) tracked`
          : `${hands.length} hand(s) found`
    );
  }, []);

  const tickFps = useCallback(() => {
    fpsFramesRef.current += 1;
    const now = performance.now();
    if (now - fpsLastRef.current >= 1000) {
      setFps(fpsFramesRef.current);
      fpsFramesRef.current = 0;
      fpsLastRef.current = now;
    }
  }, []);

  const runLoop = useCallback(async () => {
    if (!runningRef.current) return;

    const human = humanRef.current;
    const video = webcamRef.current?.video;

    if (
      human &&
      video?.readyState >= 2 &&
      video.videoWidth > 0 &&
      !detectingRef.current
    ) {
      detectingRef.current = true;
      try {
        const result = await human.detect(video);
        const pulsePhase = (Math.sin(performance.now() / 120) + 1) / 2;
        drawFrame(result, pulsePhase);
        tickFps();
      } catch (err) {
        setStatus(
          err instanceof Error ? err.message : "Detection error"
        );
      } finally {
        detectingRef.current = false;
      }
    }

    rafRef.current = requestAnimationFrame(runLoop);
  }, [drawFrame, tickFps]);

  const startCamera = useCallback(async () => {
    setLoadError(null);
    setLoading(true);

    try {
      setStatus("Loading AI models…");
      if (!humanRef.current) {
        humanRef.current = await createHuman();
      }

      setCameraActive(true);
      setStatus("Starting camera…");

      await waitForWebcamVideo(() => webcamRef.current?.video);
      syncCanvasSize();

      runningRef.current = true;
      setStatus("Ready — show your hands");
      cancelAnimationFrame(rafRef.current);
      runLoop();
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Failed to initialize"
      );
      runningRef.current = false;
      setCameraActive(false);
    } finally {
      setLoading(false);
    }
  }, [runLoop, syncCanvasSize]);

  const stopCamera = useCallback(() => {
    runningRef.current = false;
    cancelAnimationFrame(rafRef.current);
    setCameraActive(false);
    setFps(0);
    setEmotion("—");
    setTension(0);
    setPulsing(false);
    setHandsCount(0);
    setTrackedCount(0);
    setStatus("Idle");

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!cameraActive) return;
    const onResize = () => syncCanvasSize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [cameraActive, syncCanvasSize]);

  return (
    <div className="relative mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl shadow-red-950/20 backdrop-blur-xl">
        <div
          ref={containerRef}
          className="relative aspect-[4/3] w-full bg-zinc-950 sm:aspect-video"
        >
          {cameraActive && (
            <div className="absolute inset-0">
              <Webcam
                ref={webcamRef}
                audio={false}
                muted
                mirrored
                playsInline
                onLoadedMetadata={syncCanvasSize}
                onUserMedia={syncCanvasSize}
                videoConstraints={{
                  facingMode: "user",
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                }}
                className="absolute inset-0 z-0 h-full w-full object-contain"
              />
              <canvas
                ref={canvasRef}
                className="pointer-events-none absolute inset-0 z-10 h-full w-full object-contain"
                aria-hidden
              />
            </div>
          )}

          {!cameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-gradient-to-br from-zinc-950 via-black to-red-950/30 p-6 text-center">
              <p className="max-w-md text-sm text-zinc-400">
                Enable your camera for on-device emotion detection and elastic
                finger tracking. All processing stays in your browser.
              </p>
              <button
                type="button"
                onClick={startCamera}
                disabled={loading}
                className="rounded-full border border-red-500/40 bg-red-600/90 px-8 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Loading models…" : "Start Camera"}
              </button>
              {loadError && (
                <p className="max-w-sm text-xs text-red-400">{loadError}</p>
              )}
            </div>
          )}

          {cameraActive && (
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 p-3 sm:p-4">
              <div className="rounded-xl border border-white/15 bg-black/55 px-4 py-3 backdrop-blur-md">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-400">
                  Tech Specs
                </p>
                <dl className="space-y-1.5 text-xs text-zinc-200">
                  <div className="flex justify-between gap-6">
                    <dt className="text-zinc-500">FPS</dt>
                    <dd className="font-mono tabular-nums">{fps}</dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-zinc-500">Emotion</dt>
                    <dd className="font-medium">{emotion}</dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-zinc-500">Hands detected</dt>
                    <dd className="font-mono tabular-nums">{handsCount}</dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-zinc-500">Hands tracked</dt>
                    <dd className="font-mono tabular-nums">{trackedCount}</dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-zinc-500">Status</dt>
                    <dd className="max-w-[140px] text-right text-[10px] leading-snug text-zinc-300">
                      {status}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-zinc-500">Elastic Tension</dt>
                    <dd className="font-mono tabular-nums">{tension}%</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {cameraActive && (
            <div className="absolute bottom-3 right-3 z-20 sm:bottom-4 sm:right-4">
              <button
                type="button"
                onClick={stopCamera}
                className="pointer-events-auto rounded-lg border border-white/20 bg-black/50 px-3 py-1.5 text-xs text-zinc-300 backdrop-blur-md transition hover:border-red-500/50 hover:text-white"
              >
                Stop camera
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-3 border-t border-white/10 bg-white/5 p-4 text-xs text-zinc-400 sm:grid-cols-3 sm:text-sm">
          <p>
            <span className="text-red-400">Emotion</span> — highest-confidence
            face via Human.js
          </p>
          <p>
            <span className="text-emerald-400">Elastic bands</span> — thumb↔thumb,
            index↔index, etc. across both hands (not within one hand)
          </p>
          <p>
            <span className="text-amber-400">Tension</span> — green when close,
            red + pulse beyond 200px
          </p>
        </div>
      </div>
    </div>
  );
}
