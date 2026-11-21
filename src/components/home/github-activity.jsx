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

  const weeks = activity?.weeks?.length ? activity.weeks : Array.from({ length: 18 }, () => 0);
  const peak = Math.max(...weeks, 1);

  return (
    <a
      href="https://github.com/Alfayads"
      target="_blank"
      rel="noreferrer"
      className="flex h-full flex-col justify-between rounded-[24px] bg-white px-4 py-3 ring-1 ring-black/5"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2">
          <GitHubDark className="size-7 shrink-0" />
          <span className="truncate text-[15px] font-semibold tracking-[-0.03em] text-neutral-950">
            GitHub Activity
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5 text-[11px] text-neutral-400">
          <span
            className={`size-1.5 rounded-full ${
              activity?.activeThisWeek ? "bg-emerald-500" : "bg-neutral-300"
            }`}
          />
          {activity?.activeThisWeek ? "Active this week" : "Quiet this week"}
        </span>
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <p className="text-2xl leading-none font-semibold tracking-[-0.04em] text-neutral-950">
            {activity ? formatTotal(activity.total) : "—"}
          </p>
          <p className="mt-1 text-[11px] text-neutral-400">Total Contributions</p>
        </div>
        <div className="flex h-10 items-end gap-[2px]" aria-hidden>
          {weeks.map((count, index) => (
            <span
              key={index}
              className="w-1 rounded-full bg-emerald-300"
              style={{
                height: count === 0 ? 4 : Math.max(10, Math.round((count / peak) * 40)),
              }}
            />
          ))}
        </div>
      </div>
    </a>
  );
}
