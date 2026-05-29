"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const ElasticHandTracker = dynamic(
  () => import("@/components/ElasticHandTracker"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full items-center justify-center bg-black text-sm text-zinc-500">
        Loading hand tracker…
      </div>
    ),
  }
);

export default function VisionProPage() {
  return (
    <div className="relative min-h-screen bg-black">
      <ElasticHandTracker variant="fullscreen" />

      <div className="pointer-events-none fixed inset-x-0 top-0 z-20 p-4 pt-24 sm:p-6">
        <Link
          href="/work"
          className="pointer-events-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-xs uppercase tracking-widest text-zinc-300 backdrop-blur-md transition hover:border-white/30 hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to Work
        </Link>

        <header className="max-w-xl rounded-xl border border-white/10 bg-black/55 p-4 backdrop-blur-md sm:p-5">
          <p className="mb-1 text-xs uppercase tracking-[0.25em] text-red-500">
            Live demo
          </p>
          <h1 className="font-[family-name:var(--font-geist-sans)] text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Vision Pro
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
            Full-screen MediaPipe Hands — cross-hand links, sparkles, point to
            move cursor, pinch thumb+index to click. Use the{" "}
            <span className="text-zinc-200">Hand</span> button in the header on
            other pages for site-wide control.
          </p>
        </header>
      </div>
    </div>
  );
}
