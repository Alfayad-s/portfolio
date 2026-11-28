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
      <article className="spotlight-card flex min-h-[168px] flex-col overflow-hidden rounded-[24px] bg-white p-3.5 ring-1 ring-black/5 lg:h-full xl:min-h-[180px] xl:rounded-[28px] xl:p-4 2xl:rounded-[32px] 2xl:p-5">
        <p className="card-label flex items-center gap-2 text-[13px] font-semibold text-neutral-950 xl:text-sm 2xl:text-base">
          <Quote className="card-icon size-3.5 shrink-0 text-violet-500 xl:size-4 2xl:size-5" />
          Testimonials
        </p>
        <p className="card-body mt-auto text-xs leading-snug text-neutral-500 xl:text-sm 2xl:text-base">
          No testimonials yet.
        </p>
      </article>
    );
  }

  return (
    <article
      className="spotlight-card flex min-h-[168px] cursor-pointer flex-col overflow-hidden rounded-[24px] bg-white p-3.5 text-left ring-1 ring-black/5 lg:h-full xl:min-h-[180px] xl:rounded-[28px] xl:p-4 2xl:rounded-[32px] 2xl:p-5"
      onClick={() => setOpen(true)}
    >
      <p className="card-label flex items-center gap-2 text-[13px] font-semibold text-neutral-950 xl:text-sm 2xl:text-base">
        <Quote className="card-icon size-3.5 shrink-0 text-violet-500 xl:size-4 2xl:size-5" />
        Testimonials
      </p>
      <p className="card-body mt-2 line-clamp-2 min-h-0 flex-1 text-xs leading-snug text-neutral-600 xl:mt-2.5 xl:text-sm 2xl:line-clamp-3 2xl:text-base">
        “{item.message}”
      </p>
      <div className="mt-3 flex items-center justify-between gap-2 2xl:mt-4">
        <p className="card-meta flex min-w-0 items-center gap-2 text-xs font-medium text-neutral-800 xl:text-sm 2xl:gap-2.5 2xl:text-base">
          {item.image ? (
            <Image
              src={item.image}
              alt=""
              width={28}
              height={28}
              className="card-avatar size-5 shrink-0 rounded-full object-cover 2xl:size-7"
            />
          ) : item.name === "Team Codeteak" ? (
            <Image
              src="/codeteak-logo.png"
              alt=""
              width={28}
              height={28}
              className="card-avatar size-5 shrink-0 object-contain 2xl:size-7"
            />
          ) : (
            <span className="card-avatar grid size-5 shrink-0 place-items-center rounded-full bg-neutral-100 text-[10px] font-semibold text-neutral-700 2xl:size-7 2xl:text-xs">
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
            className="grid size-6 place-items-center rounded-full hover:bg-neutral-100 2xl:size-8"
          >
            <ChevronLeft className="size-3.5 2xl:size-4" />
          </button>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => step(1)}
            className="grid size-6 place-items-center rounded-full hover:bg-neutral-100 2xl:size-8"
          >
            <ChevronRight className="size-3.5 2xl:size-4" />
          </button>
          <span className="ml-1 flex items-center gap-1" aria-hidden>
            {testimonials.slice(0, 3).map((entry, dot) => (
              <span
                key={entry.id}
                className={`size-1.5 rounded-full 2xl:size-2 ${dot === index ? "bg-neutral-800" : "bg-neutral-300"}`}
              />
            ))}
          </span>
        </div>
      </div>
      {open ? <TestimonialsOverlay testimonials={testimonials} onClose={() => setOpen(false)} /> : null}
    </article>
  );
}
