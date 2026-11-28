"use client";

import { MapPin } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

const parts = [
  { kind: "text", value: "I design " },
  { kind: "word", id: "design", emoji: "🎨", label: "digital experiences," },
  { kind: "text", value: " build " },
  { kind: "word", id: "code", emoji: "💻", label: "full-stack products," },
  { kind: "text", value: " and explore " },
  { kind: "word", id: "explore", emoji: "🤖", label: "intelligent software." },
];

const MAP_SRC =
  "https://maps.google.com/maps?q=Alappuzha,Kerala,India&z=13&hl=en&output=embed";

export default function HeroLine() {
  const [active, setActive] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="mt-2 max-w-2xl">
      <p className="text-xl leading-snug tracking-[-0.03em] lg:text-[1.55rem] lg:leading-[1.35] xl:text-[1.85rem] 2xl:text-[2.15rem]">
        {parts.map((part, index) => {
          const dimmed = Boolean(active && active !== part.id);
          const motionState = reduce
            ? { opacity: dimmed ? 0.35 : 1 }
            : {
                opacity: dimmed ? 0.32 : 1,
                filter: dimmed ? "blur(2.5px)" : "blur(0px)",
              };

          if (part.kind === "text") {
            return (
              <motion.span
                key={`text-${index}`}
                className="text-neutral-400"
                animate={motionState}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {part.value}
              </motion.span>
            );
          }

          return (
            <motion.span
              key={part.id}
              className="mx-0.5 inline-flex translate-y-[-0.08em] cursor-default items-center gap-1.5 rounded-xl px-1.5 py-0.5 align-middle font-semibold text-neutral-950"
              animate={{
                ...motionState,
                backgroundColor:
                  active === part.id ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0)",
                scale: active === part.id && !reduce ? 1.04 : 1,
              }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setActive(part.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(part.id)}
              onBlur={() => setActive(null)}
              tabIndex={0}
            >
              <span aria-hidden className="text-[1.05em] leading-none">
                {part.emoji}
              </span>
              {part.label}
            </motion.span>
          );
        })}
      </p>

      <div
        className="relative mt-3 w-max"
        onMouseEnter={() => setMapOpen(true)}
        onMouseLeave={() => setMapOpen(false)}
      >
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500"
          onFocus={() => setMapOpen(true)}
          onBlur={() => setMapOpen(false)}
        >
          <MapPin className="size-3.5 text-neutral-400" />
          Software Engineer · Kerala, India
        </button>
        {mapOpen ? (
          <div className="absolute top-full left-0 z-30 w-[280px] pt-2">
            <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
              <iframe
                title="Map of Alappuzha, Kerala"
                src={MAP_SRC}
                className="pointer-events-none h-[180px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <p className="px-3 py-2 text-xs font-medium text-neutral-700">
                Alappuzha, Kerala
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
