"use client";

import { X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const revealVariants = {
  hidden: { filter: "blur(10px)", y: -20, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { delay: i * 0.12, duration: 0.45 },
  }),
};

function Portrait({ item, dark }) {
  if (item.image) {
    return (
      <Image
        src={item.image}
        alt=""
        width={96}
        height={96}
        className="size-16 shrink-0 rounded-xl object-cover xl:size-20 xl:rounded-2xl 2xl:size-24"
      />
    );
  }

  return (
    <span
      className={`grid size-16 shrink-0 place-items-center rounded-xl text-lg font-semibold xl:size-20 xl:rounded-2xl xl:text-xl 2xl:size-24 2xl:text-2xl ${
        dark ? "bg-white/10 text-white" : "bg-neutral-100 text-neutral-700"
      }`}
    >
      {item.name.slice(0, 1)}
    </span>
  );
}

function QuoteCard({ item, index, reduce }) {
  const dark = index % 2 === 1;

  return (
    <motion.article
      custom={index + 2}
      variants={reduce ? undefined : revealVariants}
      initial={reduce ? false : "hidden"}
      animate={reduce ? undefined : "visible"}
      className={`relative flex min-h-[190px] flex-col justify-between overflow-hidden rounded-xl border p-5 xl:min-h-[240px] xl:rounded-2xl xl:p-7 2xl:min-h-[280px] 2xl:p-8 ${
        dark
          ? "border-neutral-800 bg-neutral-950 text-white"
          : "border-neutral-200 bg-white text-neutral-950"
      }`}
    >
      {dark ? null : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:50px_56px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] xl:bg-[size:56px_64px]"
        />
      )}
      <p className="relative text-sm leading-relaxed xl:text-base xl:leading-relaxed 2xl:text-lg 2xl:leading-relaxed">
        “{item.message}”
      </p>
      <div className="relative mt-5 flex items-end justify-between gap-4 xl:mt-7 2xl:mt-8">
        <div className="min-w-0">
          <h3 className="text-base font-semibold xl:text-lg 2xl:text-xl">{item.name}</h3>
          {item.role ? (
            <p className={`mt-0.5 text-sm xl:mt-1 xl:text-base 2xl:text-lg ${dark ? "text-white/65" : "text-neutral-500"}`}>
              {item.role}
            </p>
          ) : null}
        </div>
        <Portrait item={item} dark={dark} />
      </div>
    </motion.article>
  );
}

export default function TestimonialsOverlay({ testimonials, onClose }) {
  const panelRef = useRef(null);
  const reduce = useReducedMotion();
  const columns = [[], [], []];
  testimonials.forEach((item, index) => {
    columns[index % 3].push({ item, index });
  });

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto p-4 sm:p-8 xl:p-10 2xl:p-12"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        aria-label="Close testimonials"
        className="absolute inset-0 bg-[#e6e6e6]/55 backdrop-blur-xl"
        onClick={onClose}
      />
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Testimonials"
        className="relative z-10 my-auto w-full max-w-6xl rounded-2xl bg-white px-4 py-8 text-neutral-950 sm:px-8 xl:max-w-7xl xl:rounded-3xl xl:px-12 xl:py-12 2xl:max-w-[92rem] 2xl:px-16 2xl:py-14"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 grid size-9 place-items-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950 xl:top-6 xl:right-6 xl:size-11 2xl:size-12"
        >
          <X className="size-4 xl:size-5 2xl:size-6" />
        </button>
        <div className="mx-auto max-w-xl space-y-2 text-center xl:max-w-3xl xl:space-y-3 2xl:max-w-4xl">
          <motion.h2
            custom={0}
            variants={reduce ? undefined : revealVariants}
            initial={reduce ? false : "hidden"}
            animate={reduce ? undefined : "visible"}
            className="text-3xl font-medium tracking-[-0.03em] xl:text-5xl 2xl:text-6xl"
          >
            What people say about working with me
          </motion.h2>
          <motion.p
            custom={1}
            variants={reduce ? undefined : revealVariants}
            initial={reduce ? false : "hidden"}
            animate={reduce ? undefined : "visible"}
            className="text-neutral-500 xl:text-lg 2xl:text-xl"
          >
            Notes from clients and teammates.
          </motion.p>
        </div>
        <div
          className={`grid grid-cols-1 gap-3 pt-8 xl:gap-4 xl:pt-12 2xl:gap-5 2xl:pt-14 ${
            testimonials.length >= 3 ? "lg:grid-cols-3" : testimonials.length === 2 ? "lg:grid-cols-2" : ""
          }`}
        >
          {columns
            .filter((column) => column.length > 0)
            .map((column, columnIndex) => (
              <div key={columnIndex} className="flex flex-col gap-3 xl:gap-4 2xl:gap-5">
                {column.map(({ item, index }) => (
                  <QuoteCard key={item.id} item={item} index={index} reduce={reduce} />
                ))}
              </div>
            ))}
        </div>
      </section>
    </div>,
    document.body,
  );
}
