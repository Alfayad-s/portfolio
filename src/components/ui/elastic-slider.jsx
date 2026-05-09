"use client";

import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const MAX_OVERFLOW = 50;

function decay(value, max) {
  if (max === 0) return 0;
  const entry = value / max;
  const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
  return sigmoid * max;
}

export default function ElasticSlider({
  value: controlledValue,
  onChange,
  defaultValue = 60,
  startingValue = 0,
  maxValue = 100,
  className = "",
  isStepped = false,
  stepSize = 1,
  leftIcon,
  rightIcon,
  variant = "dark",
}) {
  const [value, setValue] = useState(
    controlledValue !== undefined ? controlledValue : defaultValue
  );

  useEffect(() => {
    if (controlledValue !== undefined) setValue(controlledValue);
  }, [controlledValue]);

  const emit = (v) => {
    setValue(v);
    onChange?.(v);
  };

  return (
    <div
      className={cn(
        "relative flex w-full max-w-[min(18rem,calc(100vw-2rem))] flex-col items-center justify-center gap-2",
        className
      )}
    >
      <SliderInner
        value={value}
        onValueChange={emit}
        startingValue={startingValue}
        maxValue={maxValue}
        isStepped={isStepped}
        stepSize={stepSize}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        variant={variant}
      />
      <p
        className={cn(
          "text-xs font-medium tracking-wide",
          variant === "dark" ? "text-neutral-400" : "text-gray-500"
        )}
      >
        Volume · {Math.round(value)}%
      </p>
    </div>
  );
}

function SliderInner({
  value,
  onValueChange,
  startingValue,
  maxValue,
  isStepped,
  stepSize,
  leftIcon,
  rightIcon,
  variant,
}) {
  const sliderRef = useRef(null);
  const [region, setRegion] = useState("middle");

  const scale = useMotionValue(1);
  const clientX = useMotionValue(0);
  const overflow = useMotionValue(0);
  const regionMotion = useMotionValue("middle");

  const opacity = useTransform(scale, [1, 1.2], [0.65, 1]);

  const leftIconX = useTransform([overflow, regionMotion, scale], ([ov, r, sc]) =>
    r === "left" ? -ov / sc : 0
  );
  const rightIconX = useTransform([overflow, regionMotion, scale], ([ov, r, sc]) =>
    r === "right" ? ov / sc : 0
  );

  const trackScaleY = useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.82]);
  const trackHeight = useTransform(scale, [1, 1.2], [6, 11]);
  const marginY = useTransform(scale, [1, 1.2], [0, -2]);

  useMotionValueEvent(clientX, "change", (latest) => {
    if (!sliderRef.current) return;
    const { left, right } = sliderRef.current.getBoundingClientRect();
    let dist = 0;
    let r = "middle";
    if (latest < left) {
      r = "left";
      dist = left - latest;
    } else if (latest > right) {
      r = "right";
      dist = latest - right;
    }
    regionMotion.set(r);
    setRegion(r);
    overflow.jump(decay(dist, MAX_OVERFLOW));
  });

  const handlePointerMove = (e) => {
    if (e.buttons <= 0 || !sliderRef.current) return;
    const { left, width } = sliderRef.current.getBoundingClientRect();
    let newValue =
      startingValue + ((e.clientX - left) / width) * (maxValue - startingValue);
    if (isStepped) {
      newValue = Math.round(newValue / stepSize) * stepSize;
    }
    newValue = Math.min(Math.max(newValue, startingValue), maxValue);
    onValueChange(newValue);
    clientX.jump(e.clientX);
  };

  const handlePointerDown = (e) => {
    handlePointerMove(e);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = () => {
    animate(overflow, 0, { type: "spring", bounce: 0.45 });
  };

  const pct =
    maxValue === startingValue
      ? 0
      : ((value - startingValue) / (maxValue - startingValue)) * 100;

  const trackBg =
    variant === "dark" ? "bg-neutral-600" : "bg-gray-400";
  const fillBg =
    variant === "dark" ? "bg-red-500/90" : "bg-gray-600";

  return (
    <motion.div
      style={{ scale, opacity }}
      onHoverStart={() => animate(scale, 1.12)}
      onHoverEnd={() => animate(scale, 1)}
      className="flex w-full touch-none select-none items-center justify-center gap-3 sm:gap-4"
    >
      <motion.div
        animate={{
          scale: region === "left" ? [1, 1.25, 1] : 1,
          transition: { duration: 0.22 },
        }}
        style={{ x: leftIconX }}
        className="flex shrink-0 text-neutral-400"
      >
        {leftIcon ?? <span className="text-sm font-bold">−</span>}
      </motion.div>

      <div
        ref={sliderRef}
        className="relative flex min-w-0 flex-1 cursor-grab touch-none select-none items-center py-3 active:cursor-grabbing"
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onLostPointerCapture={handlePointerUp}
      >
        <motion.div
          style={{
            scaleY: trackScaleY,
            height: trackHeight,
            marginTop: marginY,
            marginBottom: marginY,
          }}
          className="flex w-full flex-grow"
        >
          <div
            className={cn(
              "relative h-full w-full flex-grow overflow-hidden rounded-full",
              trackBg
            )}
          >
            <div
              className={cn(
                "absolute h-full rounded-full transition-[width] duration-75",
                fillBg
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        animate={{
          scale: region === "right" ? [1, 1.25, 1] : 1,
          transition: { duration: 0.22 },
        }}
        style={{ x: rightIconX }}
        className="flex shrink-0 text-neutral-400"
      >
        {rightIcon ?? <span className="text-sm font-bold">+</span>}
      </motion.div>
    </motion.div>
  );
}
