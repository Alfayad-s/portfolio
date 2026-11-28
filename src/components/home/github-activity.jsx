"use client";

import { GitHubDark } from "developer-icons";
import { useEffect, useState } from "react";

function formatTotal(total) {
  if (total >= 1000) {
    const value = total / 1000;
    const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
    return `${rounded}k+`;
  }
  return String(total);
}

export default function GithubActivity() {
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch("/api/github")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!ignore && data) setActivity(data);
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  const weeks = activity?.weeks?.length ? activity.weeks.slice(-12) : Array.from({ length: 12 }, () => 0);
  const peak = Math.max(...weeks, 1);

  return (
    <a
      href="https://github.com/Alfayad-s"
      target="_blank"
      rel="noreferrer"
      className="spotlight-card flex min-h-[168px] flex-col justify-between gap-3 overflow-hidden rounded-[24px] bg-white p-3.5 ring-1 ring-black/5 lg:h-full xl:min-h-[180px] xl:rounded-[28px] xl:p-4 2xl:gap-4 2xl:rounded-[32px] 2xl:p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2 2xl:gap-2.5">
          <GitHubDark className="card-icon size-6 shrink-0 xl:size-7 2xl:size-8" />
          <span className="card-label truncate text-[15px] font-semibold tracking-[-0.03em] text-neutral-950 xl:text-base 2xl:text-lg">
            GitHub
          </span>
        </span>
        <span className="card-meta flex shrink-0 items-center gap-1.5 text-[11px] text-neutral-400 2xl:text-sm">
          <span
            className={`size-1.5 rounded-full 2xl:size-2 ${
              activity?.activeThisWeek ? "bg-emerald-500" : "bg-neutral-300"
            }`}
          />
          <span className="hidden min-[1100px]:inline xl:hidden 2xl:inline">
            {activity?.activeThisWeek ? "Active" : "Quiet"}
          </span>
        </span>
      </div>
      <div className="flex min-w-0 items-end justify-between gap-3 2xl:gap-4">
        <div className="min-w-0 shrink-0">
          <p className="card-stat text-2xl leading-none font-semibold tracking-[-0.04em] text-neutral-950 xl:text-3xl 2xl:text-5xl">
            {activity ? formatTotal(activity.total) : "—"}
          </p>
          <p className="card-meta mt-1 text-[11px] text-neutral-400 xl:mt-1.5 2xl:text-sm">Contributions</p>
        </div>
        <div
          className="gh-chart flex h-10 min-w-0 flex-1 items-end gap-0.5 overflow-hidden xl:h-12 2xl:h-16 2xl:gap-1"
          aria-hidden
        >
          {weeks.map((count, index) => (
            <span
              key={index}
              className="min-w-0 flex-1 rounded-full bg-emerald-300"
              style={{
                height: count === 0 ? 4 : Math.max(8, Math.round((count / peak) * 56)),
              }}
            />
          ))}
        </div>
      </div>
    </a>
  );
}
