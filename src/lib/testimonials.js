import { uploadTestimonialPhoto } from "@/lib/cloudinary";
import { consumeInviteLink, findInviteLink } from "@/lib/invite-links";
import { getSupabase } from "@/lib/supabase";

function clean(value, max) {
  return String(value ?? "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function toTestimonial(row) {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    message: row.message,
    image: row.image || undefined,
    createdAt: row.created_at,
  };
}

export async function listTestimonials() {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("testimonials")
    .select("id, name, role, message, image, created_at")
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []).map(toTestimonial);
}

export async function addTestimonial({ name, role, message, companyWebsite, token, image }) {
  if (companyWebsite) {
    return { error: "Could not save that testimonial.", status: 400 };
  }

  const supabase = getSupabase();
  if (!supabase) return { error: "Testimonial storage is not set up yet.", status: 500 };

  const existing = await findInviteLink(token);
  if (!existing) return { error: "This link is not valid.", status: 404 };
  if (existing.usedAt) return { error: "This link has already been used.", status: 410 };

  const entry = {
    name: clean(name, 60),
    role: clean(role, 80),
    message: clean(message, 400),
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

  const { data, error } = await supabase
    .from("testimonials")
    .insert(entry)
    .select("id, name, role, message, image, created_at")
    .single();

  if (error) {
    await supabase.from("invite_links").update({ used_at: null }).eq("token", token);
    return { error: "Could not save that testimonial.", status: 500 };
  }

  return { testimonial: toTestimonial(data) };
}
