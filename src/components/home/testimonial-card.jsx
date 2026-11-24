"use client";

import TestimonialsOverlay from "@/components/home/testimonials-overlay";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function TestimonialCard({ testimonials }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const count = testimonials.length;
  const item = testimonials[index] ?? testimonials[0];

  function step(direction) {
    if (count < 2) return;
    setIndex((current) => (current + direction + count) % count);
  }

  if (!item) {
    return (
      <article className="flex h-full flex-col rounded-[24px] bg-white px-4 py-3 ring-1 ring-black/5">
        <p className="flex items-center gap-2 text-[13px] font-semibold text-neutral-950">
          <Quote className="size-3.5 text-violet-500" />
          Testimonials
        </p>
        <p className="mt-auto text-xs leading-snug text-neutral-500">No testimonials yet.</p>
      </article>
    );
  }

  return (
    <article
      className="flex h-full cursor-pointer flex-col rounded-[24px] bg-white px-4 py-3 text-left ring-1 ring-black/5"
      onClick={() => setOpen(true)}
    >
      <p className="flex items-center justify-between gap-2 text-[13px] font-semibold text-neutral-950">
        <span className="inline-flex items-center gap-2">
          <Quote className="size-3.5 text-violet-500" />
          Testimonials
        </span>
      </p>
      <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-neutral-600">“{item.message}”</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <p className="flex min-w-0 items-center gap-2 text-xs font-medium text-neutral-800">
          {item.image ? (
            <Image
              src={item.image}
              alt=""
              width={22}
              height={22}
              className="size-5 shrink-0 rounded-full object-cover"
            />
          ) : item.name === "Team Codeteak" ? (
            <Image
              src="/codeteak-logo.png"
              alt=""
              width={22}
              height={22}
              className="size-5 shrink-0 object-contain"
            />
          ) : (
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-neutral-100 text-[10px] font-semibold text-neutral-700">
              {item.name.slice(0, 1)}
            </span>
          )}
          <span className="truncate">{item.name}</span>
        </p>
        <div
          className="flex shrink-0 items-center gap-1 text-neutral-400"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <button type="button" aria-label="Previous testimonial" onClick={() => step(-1)} className="grid size-5 place-items-center">
            <ChevronLeft className="size-3.5" />
          </button>
          <button type="button" aria-label="Next testimonial" onClick={() => step(1)} className="grid size-5 place-items-center">
            <ChevronRight className="size-3.5" />
          </button>
          <span className="ml-1 flex items-center gap-1" aria-hidden>
            {testimonials.slice(0, 3).map((entry, dot) => (
              <span
                key={entry.id}
                className={`size-1.5 rounded-full ${dot === index ? "bg-neutral-800" : "bg-neutral-300"}`}
              />
            ))}
          </span>
        </div>
      </div>
      {open ? <TestimonialsOverlay testimonials={testimonials} onClose={() => setOpen(false)} /> : null}
    </article>
  );
}
