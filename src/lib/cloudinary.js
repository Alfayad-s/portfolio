import { createHash } from "crypto";

const MAX_BYTES = 4 * 1024 * 1024;

const types = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47],
  "image/webp": [0x52, 0x49, 0x46, 0x46],
  "image/gif": [0x47, 0x49, 0x46, 0x38],
};

function looksLikeImage(bytes, type) {
  const signature = types[type];
  if (!signature || bytes.length < signature.length) return false;
  const matches = signature.every((byte, index) => bytes[index] === byte);
  if (!matches) return false;
  if (type === "image/webp") {
    return bytes.length > 12 && bytes.slice(8, 12).toString() === "WEBP";
  }
  return true;
}

export async function uploadTestimonialPhoto(file) {
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) {
    return { error: "Add a photo.", status: 400 };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Use a photo smaller than 4 MB.", status: 400 };
  }
  if (!types[file.type]) {
    return { error: "Use a JPG, PNG, or WebP photo.", status: 400 };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (!looksLikeImage(bytes, file.type)) {
    return { error: "Use a JPG, PNG, or WebP photo.", status: 400 };
  }

  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) {
    return { error: "Photo storage is not set up yet.", status: 500 };
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "portfolio/testimonials";
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${secret}`)
    .digest("hex");

  const body = new FormData();
  body.append("file", new Blob([bytes], { type: file.type }), "photo");
  body.append("api_key", key);
  body.append("timestamp", String(timestamp));
  body.append("folder", folder);
  body.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body,
  });
  const data = await response.json().catch(() => ({}));
  let url;
  try {
    url = new URL(data.secure_url);
  } catch {
    url = null;
  }
  if (!response.ok || !url || url.protocol !== "https:" || url.hostname !== "res.cloudinary.com") {
    return { error: "Could not store that photo.", status: 502 };
  }

  return { url: url.toString() };
}
