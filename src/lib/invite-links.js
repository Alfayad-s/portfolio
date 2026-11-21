import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "invite-links.json");

async function readLinks() {
  try {
    const items = JSON.parse(await fs.readFile(filePath, "utf8"));
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

async function writeLinks(items) {
  await fs.writeFile(filePath, JSON.stringify(items, null, 2));
}

export async function listInviteLinks() {
  const links = await readLinks();
  return links.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function createInviteLink(label) {
  const name = String(label ?? "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
  const link = {
    token: randomBytes(18).toString("base64url"),
    label: name || "Customer",
    createdAt: new Date().toISOString(),
    usedAt: null,
  };
  const links = await readLinks();
  links.unshift(link);
  await writeLinks(links);
  return link;
}

export async function findInviteLink(token) {
  const links = await readLinks();
  return links.find((link) => link.token === token) ?? null;
}

export async function consumeInviteLink(token) {
  const links = await readLinks();
  const link = links.find((item) => item.token === token);
  if (!link) return { error: "This link is not valid.", status: 404 };
  if (link.usedAt) return { error: "This link has already been used.", status: 410 };
  link.usedAt = new Date().toISOString();
  await writeLinks(links);
  return { link };
}
