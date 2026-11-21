import GithubActivity from "@/components/home/github-activity";
import TestimonialCard from "@/components/home/testimonial-card";
import UpworkProfile from "@/components/home/upwork-profile";
import { FlaskConical, Play } from "lucide-react";

export default function SpotlightRow({ testimonials }) {
  return (
    <div className="mt-6 grid w-full gap-3 lg:col-span-2 lg:row-start-2 lg:mt-0 lg:mb-1 lg:h-[124px] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.85fr)_minmax(0,0.85fr)]">
      <article className="flex items-center gap-3 rounded-[24px] bg-white py-2.5 pr-2.5 pl-4 ring-1 ring-black/5">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-[13px] font-semibold text-neutral-950">
            <FlaskConical className="size-3.5 text-violet-500" />
            Lab / Experiments
          </p>
          <h2 className="mt-1.5 text-[15px] leading-tight font-bold tracking-[-0.03em] text-neutral-950">
            Play. Experiment. Learn.
          </h2>
          <p className="mt-1 line-clamp-2 text-xs leading-snug text-neutral-500">
            Small experiments, cool ideas and technical playgrounds I work on in my free time.
          </p>
        </div>
        <div className="relative flex h-full w-[52%] shrink-0 flex-col justify-between rounded-[18px] bg-neutral-950 px-3 py-2.5 text-white">
          <div className="flex items-center justify-between" aria-hidden>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#ff5f57]" />
              <span className="size-2 rounded-full bg-[#febc2e]" />
              <span className="size-2 rounded-full bg-[#28c840]" />
            </span>
            <span className="grid size-6 place-items-center rounded-full bg-neutral-800 text-white ring-1 ring-white/10">
              <Play className="size-2.5 fill-white" />
            </span>
          </div>
          <pre className="mt-1.5 font-mono text-[11px] leading-relaxed">
            <code>
              <span className="text-[#e06cff]">const</span>
              <span> createMagic = () =&gt; {"{"}</span>
              {"\n"}
              <span>{"  "}</span>
              <span className="text-[#c792ea]">return</span>
              <span className="text-[#c3e88d]"> &apos;Build Better&apos;</span>
              <span>;</span>
              {"\n"}
              <span>{"}"};</span>
            </code>
          </pre>
        </div>
      </article>

      <TestimonialCard testimonials={testimonials} />
      <GithubActivity />
      <UpworkProfile />
    </div>
  );
}
