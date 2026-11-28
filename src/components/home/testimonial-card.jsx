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
      <article className="flex min-h-[168px] flex-col overflow-hidden rounded-[24px] bg-white p-3.5 ring-1 ring-black/5 lg:h-full xl:min-h-[180px] xl:rounded-[28px] xl:p-4 2xl:rounded-[32px]">
        <p className="flex items-center gap-2 text-[13px] font-semibold text-neutral-950 xl:text-sm">
          <Quote className="size-3.5 shrink-0 text-violet-500 xl:size-4" />
          Testimonials
        </p>
        <p className="mt-auto text-xs leading-snug text-neutral-500 xl:text-sm">No testimonials yet.</p>
      </article>
    );
  }

  return (
    <article
      className="flex min-h-[168px] cursor-pointer flex-col overflow-hidden rounded-[24px] bg-white p-3.5 text-left ring-1 ring-black/5 lg:h-full xl:min-h-[180px] xl:rounded-[28px] xl:p-4 2xl:rounded-[32px]"
      onClick={() => setOpen(true)}
    >
      <p className="flex items-center gap-2 text-[13px] font-semibold text-neutral-950 xl:text-sm">
        <Quote className="size-3.5 shrink-0 text-violet-500 xl:size-4" />
        Testimonials
      </p>
      <p className="mt-1.5 line-clamp-2 min-h-0 flex-1 text-xs leading-snug text-neutral-600 xl:text-sm">
        “{item.message}”
      </p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="flex min-w-0 items-center gap-2 text-xs font-medium text-neutral-800 xl:text-sm">
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
          className="flex shrink-0 items-center gap-0.5 text-neutral-400"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => step(-1)}
            className="grid size-6 place-items-center rounded-full hover:bg-neutral-100"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => step(1)}
            className="grid size-6 place-items-center rounded-full hover:bg-neutral-100"
          >
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
