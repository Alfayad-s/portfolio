import { Upwork } from "developer-icons";
import { ArrowUpRight } from "lucide-react";

const PROFILE = "https://www.upwork.com/freelancers/~01a7a783248f424c71";

export default function UpworkProfile() {
  return (
    <a
      href={PROFILE}
      target="_blank"
      rel="noreferrer"
      className="spotlight-card flex min-h-[168px] flex-col justify-between gap-3 overflow-hidden rounded-[24px] bg-white p-3.5 ring-1 ring-black/5 lg:h-full xl:min-h-[180px] xl:rounded-[28px] xl:p-4 2xl:gap-4 2xl:rounded-[32px] 2xl:p-5"
    >
      <span className="flex min-w-0 items-center gap-2 2xl:gap-2.5">
        <Upwork className="card-icon size-6 shrink-0 xl:size-7 2xl:size-8" />
        <span className="card-label truncate text-[15px] font-semibold tracking-[-0.03em] text-neutral-950 xl:text-base 2xl:text-lg">
          Upwork
        </span>
      </span>
      <span className="flex min-w-0 items-end justify-between gap-3">
        <span className="min-w-0">
          <span className="card-title block truncate text-sm leading-none font-semibold tracking-[-0.03em] text-neutral-950 xl:text-base 2xl:text-xl">
            Alfayad Shameer
          </span>
          <span className="card-meta mt-1.5 block text-[11px] text-neutral-400 2xl:mt-2 2xl:text-sm">
            Freelance profile
          </span>
        </span>
        <span className="card-action grid size-8 shrink-0 place-items-center rounded-full bg-[#14a800] text-white xl:size-9 2xl:size-11">
          <ArrowUpRight className="size-3.5 xl:size-4 2xl:size-5" />
        </span>
      </span>
    </a>
  );
}
