"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const STARTED = new Date(2025, 3, 10);

const earlier = [
  {
    name: "Brototype",
    role: "Intern",
    when: "Jan 2024 – Dec 2025",
    description:
      "Offline internship building and managing full-stack apps with the MERN stack, alongside a team.",
    image: "/brototype-logo.png",
  },
  {
    name: "Freelance",
    role: "Full-Stack Developer",
    when: "Jan 2024 – Present",
    description:
      "Remote product work from the interface through the backend, including APIs and payments.",
    image: "/freelance-logo.png",
  },
];

function elapsedSince(from, to) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

function Unit({ value, label }) {
  return (
    <p className="text-2xl leading-none font-semibold tracking-[-0.04em] text-neutral-950 tabular-nums xl:text-3xl 2xl:text-4xl">
      {value}
      <span className="ml-0.5 text-base font-medium text-neutral-400 xl:text-lg">{label}</span>
    </p>
  );
}

export default function CurrentCompany() {
  const [elapsed, setElapsed] = useState(null);

  useEffect(() => {
    const tick = () => setElapsed(elapsedSince(STARTED, new Date()));
    tick();
    const timer = window.setInterval(tick, 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  const years = elapsed?.years ?? 0;
  const months = elapsed?.months ?? 0;
  const days = elapsed?.days ?? 0;

  return (
    <section className="flex h-auto w-full flex-col self-start bg-transparent p-0">
      <div>
        <p className="flex items-center gap-2 text-xs font-medium tracking-[0.08em] text-neutral-500 uppercase">
          <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.16)]" />
          Now
        </p>
        <a
          href="https://codeteak.com"
          target="_blank"
          rel="noreferrer"
          className="mt-2.5 flex items-center gap-3 rounded-2xl"
        >
          <Image
            src="/codeteak-logo.png"
            alt=""
            width={44}
            height={44}
            className="size-11 object-contain xl:size-14"
          />
          <span className="min-w-0">
            <span className="block truncate text-base font-semibold tracking-[-0.03em] text-neutral-950 xl:text-lg 2xl:text-xl">
              Codeteak
            </span>
            <span className="block truncate text-sm text-neutral-500 xl:text-base">
              Full-Stack Developer & UI/UX
            </span>
          </span>
        </a>
        <p className="mt-2.5 text-[13px] leading-snug text-neutral-500 xl:text-sm 2xl:text-base">
          Currently working in Bengaluru at Codeteak Technologies. Product
          studio based in Bengaluru, now also in Dubai. I design the interface
          and build the web and mobile products with the team.
        </p>
        <div
          className="mt-2.5 flex items-end gap-6"
          aria-label={
            elapsed
              ? `${years} years, ${months} months, ${days} days at Codeteak`
              : "Time at Codeteak"
          }
        >
          <Unit value={years} label="y" />
          <Unit value={months} label="m" />
          <Unit value={days} label="d" />
        </div>
      </div>

      <div className="mt-3 border-t border-neutral-100 pt-2 xl:mt-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400 uppercase">
          Also
        </p>
        <ul className="mt-1.5 flex flex-col gap-2 xl:mt-2 xl:gap-3">
          {earlier.map((item) => (
            <li key={item.name} className="flex gap-2.5">
              <Image
                src={item.image}
                alt=""
                width={44}
                height={44}
                className="size-11 shrink-0 rounded-lg object-contain xl:size-12"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-neutral-950 xl:text-base">
                  {item.name}
                  <span className="font-medium text-neutral-400"> · {item.role}</span>
                </p>
                <p className="text-[11px] text-neutral-400 xl:text-xs">{item.when}</p>
                <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-neutral-500 xl:text-sm">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
