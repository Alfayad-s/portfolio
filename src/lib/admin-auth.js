import { createHmac, timingSafeEqual } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const passwordPath = path.join(process.cwd(), "data", ".admin-password");

export async function adminPassword() {
  const fromEnv = process.env.ADMIN_PASSWORD?.trim();
  if (fromEnv) return fromEnv;

  try {
    const value = (await fs.readFile(passwordPath, "utf8")).trim();
    return value;
  } catch {
    return "";
  }
}

export async function passwordMatches(password) {
  const expected = await adminPassword();
  if (!expected || typeof password !== "string") return false;
  const left = Buffer.from(password);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export async function adminSessionValue() {
  const password = await adminPassword();
  if (!password) return "";
  return createHmac("sha256", password).update("portfolio-admin").digest("hex");
}

export async function isAdminSession(value) {
  const expected = await adminSessionValue();
  if (!expected || !value || value.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}
