"use client";

import { useState } from "react";

const empty = { name: "", role: "", message: "", companyWebsite: "" };

export default function TestimonialForm({ token }) {
  const [form, setForm] = useState(empty);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function choosePhoto(event) {
    const file = event.target.files?.[0] ?? null;
    setPhoto(file);
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return file ? URL.createObjectURL(file) : "";
    });
  }

  async function submit(event) {
    event.preventDefault();
    setStatus("saving");
    setError("");

    const body = new FormData();
    body.append("name", form.name);
    body.append("role", form.role);
    body.append("message", form.message);
    body.append("companyWebsite", form.companyWebsite);
    body.append("token", token);
    if (photo) body.append("image", photo);

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        body,
      });
      const data = await response.json();
      if (!response.ok) {
        setStatus("idle");
        setError(data.error || "Could not save that testimonial.");
        return;
      }
      setForm(empty);
      setStatus("saved");
    } catch {
      setStatus("idle");
      setError("Could not save that testimonial.");
    }
  }

  if (status === "saved") {
    return (
      <p className="rounded-[28px] bg-white px-6 py-8 text-sm text-emerald-700 ring-1 ring-black/5">
        Thanks. Your testimonial is saved.
      </p>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-[28px] bg-white p-6 ring-1 ring-black/5"
    >
      <div className="grid gap-4">
        <label className="grid gap-1.5 text-sm font-medium text-neutral-800">
          Photo
          <span className="flex items-center gap-3">
            {preview ? (
              // Local preview of the file the customer just picked.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="size-14 shrink-0 rounded-full object-cover" />
            ) : (
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-neutral-100 text-[11px] text-neutral-400">
                Photo
              </span>
            )}
            <input
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp"
              required
              onChange={choosePhoto}
              className="min-w-0 flex-1 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-normal text-neutral-700 file:mr-3 file:rounded-full file:border-0 file:bg-neutral-950 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white"
            />
          </span>
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-neutral-800">
          Name
          <input
            name="name"
            value={form.name}
            onChange={update}
            required
            maxLength={60}
            autoComplete="name"
            placeholder="Your name"
            className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-normal text-neutral-950 outline-none focus:border-neutral-400"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-neutral-800">
          Role or company
          <input
            name="role"
            value={form.role}
            onChange={update}
            required
            maxLength={80}
            placeholder="Product designer at Codeteak"
            className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-normal text-neutral-950 outline-none focus:border-neutral-400"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-neutral-800">
          Testimonial
          <textarea
            name="message"
            value={form.message}
            onChange={update}
            required
            minLength={12}
            maxLength={400}
            rows={5}
            placeholder="What was it like working together?"
            className="resize-none rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-normal text-neutral-950 outline-none focus:border-neutral-400"
          />
        </label>
        <input
          name="companyWebsite"
          value={form.companyWebsite}
          onChange={update}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={status === "saving"}
          className="mt-1 inline-flex w-max items-center rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Add testimonial"}
        </button>
      </div>
    </form>
  );
}
