"use client";

import { useCallback, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

export function MovingBorder({
  children,
  duration = 3500,
  rx,
  ry,
  className,
  ...otherProps
}) {
  const pathRef = useRef(null);
  const progress = useMotionValue(0);

  useAnimationFrame((time) => {
    const node = pathRef.current;
    const length = node?.getTotalLength?.();
    if (!length) return;
    const pxPerMillisecond = length / duration;
    progress.set((time * pxPerMillisecond) % length);
  });

  const pointOnPath = useCallback((val) => {
    const node = pathRef.current;
    if (!node || typeof node.getTotalLength !== "function") {
      return { x: 0, y: 0 };
    }
    const len = node.getTotalLength();
    if (!Number.isFinite(len) || len <= 0) {
      return { x: 0, y: 0 };
    }
    const t = Math.min(Math.max(0, val), len);
    try {
      return node.getPointAtLength(t);
    } catch {
      return { x: 0, y: 0 };
    }
  }, []);

  const x = useTransform(progress, (val) => pointOnPath(val).x);
  const y = useTransform(progress, (val) => pointOnPath(val).y);

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className={cn("absolute h-full w-full", className)}
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
