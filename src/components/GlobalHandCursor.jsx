"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import Webcam from "react-webcam";
import { useHandCursor } from "@/context/HandCursorContext";
import {
  INDEX_TIP,
  PINCH_CLICK_COOLDOWN_MS,
  clickAtCursor,
  createHandScrollState,
  isPointingGesture,
  isScrollGesture,
  isThumbIndexPinch,
  landmarkToViewportClient,
  locateMediaPipeFile,
  restoreNativeCursor,
  syncBrowserCursor,
  updateHandScroll,
  updateSmoothedCursor,
} from "@/lib/handCursor";

const VISION_PRO_PATH = "/work/vision-pro";

export default function GlobalHandCursor() {
  const pathname = usePathname();
  const { enabled, setTracking, setStatus, setError, status } = useHandCursor();

  const webcamRef = useRef(null);
  const handsRef = useRef(null);
  const runningRef = useRef(false);
  const processingRef = useRef(false);
  const rafRef = useRef(0);
  const cursorRef = useRef({ x: 0, y: 0, active: false });
  const browserCursorElRef = useRef(null);
  const lastHoverElRef = useRef(null);
  const wasPinchingRef = useRef(false);
  const lastClickAtRef = useRef(0);
  const [pinchFlash, setPinchFlash] = useState(false);
  const scrollStateRef = useRef(createHandScrollState());

  const [portalReady, setPortalReady] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [initializing, setInitializing] = useState(false);

  const isVisionProPage = pathname === VISION_PRO_PATH;
  const active = enabled && !isVisionProPage;

  const stopLoop = useCallback(() => {
    runningRef.current = false;
    cancelAnimationFrame(rafRef.current);
    processingRef.current = false;
    cursorRef.current.active = false;
    wasPinchingRef.current = false;
    const scrollState = scrollStateRef.current;
    scrollState.active = false;
    scrollState.lastY = null;
    scrollState.smoothedDelta = 0;
    syncBrowserCursor(browserCursorElRef.current, cursorRef.current, lastHoverElRef);
    restoreNativeCursor();
    setTracking(false);
  }, [setTracking]);

  const paintResults = useCallback(
    (results) => {
      const hands = results.multiHandLandmarks ?? [];
      const cursor = cursorRef.current;
      const now = performance.now();

      const scrollState = scrollStateRef.current;

      if (hands.length === 1 && isScrollGesture(hands[0])) {
        updateSmoothedCursor(cursor, null);
        wasPinchingRef.current = false;
        updateHandScroll(scrollState, hands[0]);
        setStatus("Scroll — move index+middle up/down slowly");
        setTracking(true);
      } else if (hands.length === 1 && isPointingGesture(hands[0])) {
        scrollState.lastY = null;
        scrollState.smoothedDelta = 0;
        const tip = hands[0][INDEX_TIP];
        updateSmoothedCursor(cursor, landmarkToViewportClient(tip));

        const pinching = isThumbIndexPinch(hands[0]);
        if (
          pinching &&
          !wasPinchingRef.current &&
          now - lastClickAtRef.current > PINCH_CLICK_COOLDOWN_MS
        ) {
          if (clickAtCursor(cursor)) {
            lastClickAtRef.current = now;
            setPinchFlash(true);
            window.setTimeout(() => setPinchFlash(false), 300);
          }
        }
        wasPinchingRef.current = pinching;

        setStatus(
          pinching
            ? "Pinch detected — click"
            : "Index point · move cursor · thumb+index pinch to click"
        );
        setTracking(true);
      } else {
        scrollState.lastY = null;
        scrollState.smoothedDelta = 0;
        updateSmoothedCursor(cursor, null);
        wasPinchingRef.current = false;
        setTracking(false);
        setStatus(
          hands.length === 0
            ? "One hand: index point · index+middle scroll"
            : "One hand only · index+middle up/down to scroll"
        );
      }

      syncBrowserCursor(browserCursorElRef.current, cursor, lastHoverElRef);
      processingRef.current = false;
    },
    [setStatus, setTracking]
  );

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
      try {
        await hands.send({ image: video });
      } catch {
        processingRef.current = false;
      }
    }

    rafRef.current = requestAnimationFrame(processLoop);
  }, []);

  const initMediaPipe = useCallback(async () => {
    const { Hands } = await import("@mediapipe/hands");
    const hands = new Hands({ locateFile: locateMediaPipeFile });
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
      selfieMode: true,
    });
    hands.onResults(paintResults);
    await hands.initialize();
    handsRef.current = hands;
  }, [paintResults]);

  const waitForVideo = useCallback(async () => {
    const start = performance.now();
    while (performance.now() - start < 12000) {
      const video = webcamRef.current?.video;
      if (video && video.readyState >= 2 && video.videoWidth > 0) {
        try {
          await video.play();
        } catch {
          /* already playing */
        }
        return;
      }
      await new Promise((r) => requestAnimationFrame(r));
    }
    throw new Error("Camera not ready — allow webcam access.");
  }, []);

  useEffect(() => {
    setPortalReady(true);
    return () => {
      stopLoop();
      handsRef.current?.close();
      handsRef.current = null;
      restoreNativeCursor();
    };
  }, [stopLoop]);

  useEffect(() => {
    if (!active) {
      stopLoop();
      setCameraOn(false);
      setInitializing(false);
      if (!enabled) setStatus("Off");
      else if (isVisionProPage) setStatus("Use demo below on Vision Pro page");
      return;
    }

    let cancelled = false;

    (async () => {
      setInitializing(true);
      setStatus("Starting camera…");
      setError(null);
      setCameraOn(true);

      try {
        await waitForVideo();
        if (cancelled) return;

        setStatus("Loading hand tracking…");
        if (!handsRef.current) await initMediaPipe();
        if (cancelled) return;

        runningRef.current = true;
        rafRef.current = requestAnimationFrame(processLoop);
        setStatus("Point index finger to move cursor");
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to start");
          setStatus("Error");
          setCameraOn(false);
        }
      } finally {
        if (!cancelled) setInitializing(false);
      }
    })();

    return () => {
      cancelled = true;
      stopLoop();
    };
  }, [
    active,
    enabled,
    initMediaPipe,
    isVisionProPage,
    processLoop,
    setError,
    setStatus,
    stopLoop,
    waitForVideo,
  ]);

  if (!portalReady) return null;

  return (
    <>
      {active && (
        <div
          className="pointer-events-none fixed left-0 top-0 z-[9998] h-px w-px overflow-hidden opacity-0"
          aria-hidden
        >
          <Webcam
            ref={webcamRef}
            audio={false}
            muted
            mirrored
            playsInline
            videoConstraints={{
              facingMode: "user",
              width: { ideal: 1280 },
              height: { ideal: 720 },
            }}
          />
        </div>
      )}

      {enabled &&
        createPortal(
          <>
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
                className="-translate-x-[5px] -translate-y-[4px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]"
              >
                <path
                  d="M5 4L5 26L11 19.5L15.5 28L19 26.5L14 18.5L23 17L5 4Z"
                  fill="white"
                  stroke="#0f172a"
                  strokeWidth="1.75"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {pinchFlash && cursorRef.current.active && (
              <div
                className="pointer-events-none fixed z-[99998] rounded-full border-2 border-amber-400/90 bg-amber-400/20"
                style={{
                  left: cursorRef.current.x - 20,
                  top: cursorRef.current.y - 20,
                  width: 40,
                  height: 40,
                }}
              />
            )}

            {active && initializing && (
              <div className="fixed bottom-24 left-1/2 z-[99997] -translate-x-1/2 rounded-full border border-white/15 bg-black/80 px-4 py-2 text-xs text-blue-200 backdrop-blur-md">
                Hand cursor — {status}
              </div>
            )}
          </>,
          document.body
        )}
    </>
  );
}
