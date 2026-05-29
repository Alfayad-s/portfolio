import { copyFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "node_modules/@vladmandic/human/models");
const DEST = join(ROOT, "public/models");

const FILES = [
  "handtrack.json",
  "handtrack.bin",
  "handlandmark-lite.json",
  "handlandmark-lite.bin",
  "blazeface.json",
  "blazeface.bin",
  "facemesh.json",
  "facemesh.bin",
  "emotion.json",
  "emotion.bin",
];

mkdirSync(DEST, { recursive: true });

for (const file of FILES) {
  const from = join(SRC, file);
  const to = join(DEST, file);
  if (!existsSync(from)) {
    console.warn(`[copy-human-models] missing: ${file}`);
    continue;
  }
  copyFileSync(from, to);
  console.log(`[copy-human-models] ${file}`);
}
