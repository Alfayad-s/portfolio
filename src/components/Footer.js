"use client";

import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

const SERVICES = [
  { label: "Web Development", href: "/services" },
  { label: "Full-Stack Apps", href: "/services" },
  { label: "UI/UX Design", href: "/services" },
  { label: "Consulting", href: "/contact" },
];

const EXPLORE = [
  { label: "All Projects", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

const SOCIAL = [
  { label: "GitHub", handle: "@alfayads", href: "https://github.com/Alfayads", icon: Github },
  { label: "LinkedIn", handle: "@alfayad", href: "https://linkedin.com/in/alfayad", icon: Linkedin },
  { label: "Email", handle: "alfayadshameer056@gmail.com", href: "mailto:alfayadshameer056@gmail.com", icon: Mail },
];

export default function Footer() {
  return (
    <footer className="relative w-full bg-zinc-950 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
        {/* Top row: slogan + Contact */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12 md:mb-16">
          <p className="text-white font-semibold text-lg md:text-xl">
            Your full-stack & design partner
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center w-fit rounded-full border-2 border-white px-6 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-black"
          >
            Contact
          </Link>
        </div>

        {/* Four columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16 md:mb-20">
          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              {SERVICES.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-zinc-400 hover:text-white text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2">
              {EXPLORE.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-zinc-400 hover:text-white text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Say hello - social pills */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Say hello!
            </h3>
            <ul className="space-y-2">
              {SOCIAL.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-red-400" />
                      <span className="truncate">{item.handle}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Tech / Built with */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Built with
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Next.js", "React", "Tailwind"].map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-zinc-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Large Fayad */}
        <div className="pt-4 overflow-hidden">
          <span
            className="block text-white font-bold lowercase tracking-tight select-none"
            style={{
              fontFamily: '"OffBit-DotBold", sans-serif',
              fontSize: "clamp(7rem, 42vw, 26rem)",
              lineHeight: "0.85",
              letterSpacing: "-0.02em",
            }}
          >
            fayad
          </span>
        </div>
      </div>
    </footer>
  );
}
