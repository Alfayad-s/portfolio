import { Upwork } from "developer-icons";
import { ArrowUpRight } from "lucide-react";

const PROFILE = "https://www.upwork.com/freelancers/~01a7a783248f424c71";

export default function UpworkProfile() {
  return (
    <a
      href={PROFILE}
      target="_blank"
      rel="noreferrer"
      className="flex min-h-[168px] flex-col justify-between gap-3 overflow-hidden rounded-[24px] bg-white p-3.5 ring-1 ring-black/5 lg:h-full xl:min-h-[180px] xl:rounded-[28px] xl:p-4 2xl:rounded-[32px]"
    >
      <span className="flex min-w-0 items-center gap-2">
        <Upwork className="size-6 shrink-0 xl:size-7" />
        <span className="truncate text-[15px] font-semibold tracking-[-0.03em] text-neutral-950 xl:text-base">
          Upwork
        </span>
      </span>
      <span className="flex min-w-0 items-end justify-between gap-3">
        <span className="min-w-0">
          <span className="block truncate text-sm leading-none font-semibold tracking-[-0.03em] text-neutral-950 xl:text-base">
            Alfayad Shameer
          </span>
          <span className="mt-1 block text-[11px] text-neutral-400">Freelance profile</span>
        </span>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#14a800] text-white xl:size-9">
          <ArrowUpRight className="size-3.5 xl:size-4" />
        </span>
      </span>
    </a>
  );
}
