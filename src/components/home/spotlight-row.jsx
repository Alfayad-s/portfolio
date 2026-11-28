import GithubActivity from "@/components/home/github-activity";
import TestimonialCard from "@/components/home/testimonial-card";
import UpworkProfile from "@/components/home/upwork-profile";
import { FlaskConical, Play } from "lucide-react";

export default function SpotlightRow({ testimonials }) {
  return (
    <div className="spotlight-row grid w-full gap-3 lg:min-h-[168px] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)_minmax(0,0.9fr)_minmax(0,0.85fr)] xl:min-h-[180px] xl:gap-4">
      <article className="spotlight-card flex min-h-[168px] items-stretch gap-3 overflow-hidden rounded-[24px] bg-white p-3 ring-1 ring-black/5 lg:h-full xl:min-h-[180px] xl:gap-4 xl:rounded-[28px] xl:p-4 2xl:gap-5 2xl:rounded-[32px] 2xl:p-5">
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <p className="card-label flex items-center gap-2 text-[13px] font-semibold text-neutral-950 xl:text-sm 2xl:text-base">
            <FlaskConical className="card-icon size-3.5 shrink-0 text-violet-500 xl:size-4 2xl:size-5" />
            <span className="truncate">Lab / Experiments</span>
          </p>
          <h2 className="card-title mt-1.5 text-[15px] leading-tight font-bold tracking-[-0.03em] text-neutral-950 xl:mt-2 xl:text-lg 2xl:text-2xl">
            Play. Experiment. Learn.
          </h2>
          <p className="card-body mt-1 line-clamp-2 text-xs leading-snug text-neutral-500 xl:mt-1.5 xl:text-sm 2xl:line-clamp-3 2xl:text-base">
            Small experiments, cool ideas and technical playgrounds I work on in my free time.
          </p>
        </div>
        <div className="lab-code relative flex w-[46%] max-w-[240px] shrink-0 flex-col justify-between overflow-hidden rounded-[16px] bg-neutral-950 px-2.5 py-2.5 text-white xl:max-w-[280px] xl:rounded-[20px] xl:px-3.5 xl:py-3 2xl:max-w-none 2xl:w-[48%] 2xl:rounded-[22px] 2xl:px-4 2xl:py-4">
          <div className="flex items-center justify-between" aria-hidden>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#ff5f57] 2xl:size-2" />
              <span className="size-1.5 rounded-full bg-[#febc2e] 2xl:size-2" />
              <span className="size-1.5 rounded-full bg-[#28c840] 2xl:size-2" />
            </span>
            <span className="grid size-5 place-items-center rounded-full bg-neutral-800 text-white ring-1 ring-white/10 2xl:size-7">
              <Play className="size-2 fill-white 2xl:size-3" />
            </span>
          </div>
          <pre className="lab-code-text mt-2 overflow-hidden font-mono text-[10px] leading-relaxed break-all xl:text-[11px] 2xl:mt-3 2xl:text-sm 2xl:leading-relaxed">
            <code>
              <span className="text-[#e06cff]">const</span>
              <span> magic = () =&gt; {"{"}</span>
              {"\n"}
              <span>{"  "}</span>
              <span className="text-[#c792ea]">return</span>
              <span className="text-[#c3e88d]"> &apos;Build&apos;</span>
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
