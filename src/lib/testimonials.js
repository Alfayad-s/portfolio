import { uploadTestimonialPhoto } from "@/lib/cloudinary";
import { consumeInviteLink, findInviteLink } from "@/lib/invite-links";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "testimonials.json");

function clean(value, max) {
  return String(value ?? "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export async function listTestimonials() {
  const raw = await fs.readFile(filePath, "utf8");
  const items = JSON.parse(raw);
  return Array.isArray(items) ? items : [];
}

export async function addTestimonial({ name, role, message, companyWebsite, token, image }) {
  if (companyWebsite) {
    return { error: "Could not save that testimonial.", status: 400 };
  }

  const existing = await findInviteLink(token);
  if (!existing) return { error: "This link is not valid.", status: 404 };
  if (existing.usedAt) return { error: "This link has already been used.", status: 410 };

  const entry = {
    id: randomUUID(),
    name: clean(name, 60),
    role: clean(role, 80),
    message: clean(message, 400),
    createdAt: new Date().toISOString(),
  };

  if (entry.name.length < 2) {
    return { error: "Add your name.", status: 400 };
  }
  if (entry.role.length < 2) {
    return { error: "Add your role or company.", status: 400 };
  }
  if (entry.message.length < 12) {
    return { error: "Write a little more about working together.", status: 400 };
  }

  const uploaded = await uploadTestimonialPhoto(image);
  if (uploaded.error) return uploaded;
  entry.image = uploaded.url;

  const invite = await consumeInviteLink(token);
  if (invite.error) return invite;

  const items = await listTestimonials();
  items.unshift(entry);
  await fs.writeFile(filePath, JSON.stringify(items, null, 2));
  return { testimonial: entry };
}
