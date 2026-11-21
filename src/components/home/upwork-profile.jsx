import { Upwork } from "developer-icons";
import { ArrowUpRight } from "lucide-react";

const PROFILE = "https://www.upwork.com/freelancers/~01a7a783248f424c71";

export default function UpworkProfile() {
  return (
    <a
      href={PROFILE}
      target="_blank"
      rel="noreferrer"
      className="flex h-full flex-col justify-between rounded-[24px] bg-white px-4 py-3 ring-1 ring-black/5"
    >
      <span className="flex min-w-0 items-center gap-2">
        <Upwork className="size-7 shrink-0" />
        <span className="truncate text-[15px] font-semibold tracking-[-0.03em] text-neutral-950">
          Upwork
        </span>
      </span>
      <span className="flex items-end justify-between gap-3">
        <span>
          <span className="block text-sm leading-none font-semibold tracking-[-0.03em] text-neutral-950">
            Alfayad Shameer
          </span>
          <span className="mt-1 block text-[11px] text-neutral-400">Freelance profile</span>
        </span>
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#14a800] text-white">
          <ArrowUpRight className="size-3.5" />
        </span>
      </span>
    </a>
  );
}
