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
      <div className="rounded-[28px] bg-white px-5 py-8 ring-1 ring-black/5 sm:px-6" role="status">
        <p className="text-lg font-semibold text-neutral-950">Testimonial added</p>
        <p className="mt-2 text-base leading-relaxed text-neutral-600">
          Thanks. Your note is saved and will show on Alfayad&apos;s site.
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-base font-normal text-neutral-950 outline-none focus:border-neutral-400";

  return (
    <form
      onSubmit={submit}
      className="grid gap-5"
    >
      <p className="text-base leading-relaxed text-neutral-500">
        Leave a short note about working with Alfayad. This page is only open from the link you were sent.
      </p>
      <div className="grid gap-5 rounded-[28px] bg-white p-4 ring-1 ring-black/5 sm:p-6">
        <label className="grid gap-2 text-sm font-medium text-neutral-800">
          Photo
          <span className="flex items-center gap-3">
            {preview ? (
              // Local preview of the file the customer just picked.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="size-16 shrink-0 rounded-full object-cover" />
            ) : (
              <span className="grid size-16 shrink-0 place-items-center rounded-full bg-neutral-100 text-xs text-neutral-400">
                Photo
              </span>
            )}
            <span className="relative flex min-h-12 min-w-0 flex-1 items-center justify-center rounded-full bg-neutral-950 px-4 py-3 text-sm font-medium text-white">
              <span className="truncate">{photo ? photo.name : "Choose a photo"}</span>
              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp"
                required
                onChange={choosePhoto}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </span>
          </span>
        </label>
        <label className="grid gap-2 text-sm font-medium text-neutral-800">
          Name
          <input
            name="name"
            value={form.name}
            onChange={update}
            required
            maxLength={60}
            autoComplete="name"
            placeholder="Your name"
            className={field}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-neutral-800">
          Role or company
          <input
            name="role"
            value={form.role}
            onChange={update}
            required
            maxLength={80}
            placeholder="Your role or company"
            className={field}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-neutral-800">
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
            className={`${field} resize-none`}
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
          className="mt-1 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-base font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60 sm:w-max"
        >
          {status === "saving" ? "Saving…" : "Add testimonial"}
        </button>
      </div>
    </form>
  );
}
