"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function linkUrl(token) {
  if (typeof window === "undefined") return `/testimonials/${token}`;
  return `${window.location.origin}/testimonials/${token}`;
}

export default function CreateLinkPanel({ authed, links }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [label, setLabel] = useState("");
  const [items, setItems] = useState(links);
  const [fresh, setFresh] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");
  const [copied, setCopied] = useState(false);

  async function signIn(event) {
    event.preventDefault();
    setError("");
    setStatus("saving");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      setStatus("idle");
      setError("That password is not right.");
      return;
    }
    setStatus("idle");
    router.refresh();
  }

  async function createLink(event) {
    event.preventDefault();
    setError("");
    setCopied(false);
    setStatus("saving");
    const response = await fetch("/api/admin/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label }),
    });
    const data = await response.json();
    setStatus("idle");
    if (!response.ok) {
      setError(data.error || "Could not create a link.");
      return;
    }
    setItems(data.links);
    setFresh(data.link);
    setLabel("");
  }

  async function copy(token) {
    await navigator.clipboard.writeText(linkUrl(token));
    setCopied(token);
  }

  if (!authed) {
    return (
      <form onSubmit={signIn} className="mt-8 grid max-w-md gap-4 rounded-[28px] bg-white p-6 ring-1 ring-black/5">
        <label className="grid gap-1.5 text-sm font-medium text-neutral-800">
          Admin password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-normal outline-none focus:border-neutral-400"
          />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={status === "saving"}
          className="inline-flex w-max rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white"
        >
          Continue
        </button>
      </form>
    );
  }

  return (
    <div className="mt-8 grid gap-8">
      <form onSubmit={createLink} className="grid max-w-md gap-4 rounded-[28px] bg-white p-6 ring-1 ring-black/5">
        <label className="grid gap-1.5 text-sm font-medium text-neutral-800">
          Customer name
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            maxLength={80}
            placeholder="Who is this link for?"
            className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-normal outline-none focus:border-neutral-400"
          />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={status === "saving"}
          className="inline-flex w-max rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {status === "saving" ? "Creating…" : "Create link"}
        </button>
      </form>

      {fresh ? (
        <div className="rounded-[24px] bg-white px-5 py-4 ring-1 ring-black/5">
          <p className="text-xs font-medium tracking-[0.08em] text-neutral-400 uppercase">Share this link</p>
          <p className="mt-2 break-all text-sm text-neutral-950">{linkUrl(fresh.token)}</p>
          <button
            type="button"
            onClick={() => copy(fresh.token)}
            className="mt-3 text-sm font-medium text-neutral-700"
          >
            {copied === fresh.token ? "Copied" : "Copy link"}
          </button>
        </div>
      ) : null}

      <ul className="grid gap-3">
        {items.map((item) => (
          <li key={item.token} className="rounded-[24px] bg-white px-5 py-4 ring-1 ring-black/5">
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-sm font-semibold text-neutral-950">{item.label}</p>
              <p className="text-xs text-neutral-400">{item.usedAt ? "Used" : "Open"}</p>
            </div>
            <p className="mt-2 break-all text-xs text-neutral-500">{linkUrl(item.token)}</p>
            {!item.usedAt ? (
              <button type="button" onClick={() => copy(item.token)} className="mt-2 text-sm font-medium text-neutral-700">
                {copied === item.token ? "Copied" : "Copy link"}
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
