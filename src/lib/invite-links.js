import { getSupabase } from "@/lib/supabase";
import { randomBytes } from "crypto";

function toLink(row) {
  if (!row) return null;
  return {
    token: row.token,
    label: row.label,
    createdAt: row.created_at,
    usedAt: row.used_at,
  };
}

export async function listInviteLinks() {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("invite_links")
    .select("token, label, created_at, used_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(toLink);
}

export async function createInviteLink(label) {
  const supabase = getSupabase();
  if (!supabase) return { error: "Testimonial storage is not set up yet.", status: 500 };

  const name = String(label ?? "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);

  const link = {
    token: randomBytes(18).toString("base64url"),
    label: name || "Customer",
    created_at: new Date().toISOString(),
    used_at: null,
  };

  const { data, error } = await supabase.from("invite_links").insert(link).select("token, label, created_at, used_at").single();
  if (error) throw error;
  return { link: toLink(data) };
}

export async function findInviteLink(token) {
  const supabase = getSupabase();
  if (!supabase || !token) return null;

  const { data, error } = await supabase
    .from("invite_links")
    .select("token, label, created_at, used_at")
    .eq("token", token)
    .maybeSingle();

  if (error) throw error;
  return toLink(data);
}

export async function consumeInviteLink(token) {
  const supabase = getSupabase();
  if (!supabase) return { error: "Testimonial storage is not set up yet.", status: 500 };

  const { data, error } = await supabase
    .from("invite_links")
    .update({ used_at: new Date().toISOString() })
    .eq("token", token)
    .is("used_at", null)
    .select("token, label, created_at, used_at")
    .maybeSingle();

  if (error) throw error;
  if (data) return { link: toLink(data) };

  const existing = await findInviteLink(token);
  if (!existing) return { error: "This link is not valid.", status: 404 };
  return { error: "This link has already been used.", status: 410 };
}
