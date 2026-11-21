import { isAdminSession } from "@/lib/admin-auth";
import { createInviteLink, listInviteLinks } from "@/lib/invite-links";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const jar = await cookies();
  return isAdminSession(jar.get("admin_session")?.value);
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  return NextResponse.json({ links: await listInviteLinks() });
}

export async function POST(request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const link = await createInviteLink(body.label);
  return NextResponse.json({ link, links: await listInviteLinks() }, { status: 201 });
}
