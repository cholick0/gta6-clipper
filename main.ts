// gta6-clipper-01 entry for make.fun.
//
// The video is the entry: a vertical GTA 6 clip on YouTube, ranked by its
// views at the deadline. This program does nothing about the video itself.
// All it does is hand VIDEO.json — the clip's YouTube address, kept at this
// repository's root — to the grader, by copying it into /output.
//
// It reads no network, no clock and no file outside the repository, so the
// grader's two runs write the same bytes.
//
// Local run (from this directory):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const source = join(botDir, "VIDEO.json");
const target = join(outDir, "VIDEO.json");

if (!existsSync(source)) {
  console.error(`VIDEO.json not found in ${botDir}`);
  process.exit(1);
}

// Fail loudly on a broken VIDEO.json instead of handing the gate a file
// it cannot read: it must be an object with a url string.
let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(source, "utf8"));
} catch (err) {
  console.error(`VIDEO.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof parsed !== "object" || parsed === null || typeof (parsed as { url?: unknown }).url !== "string") {
  console.error("VIDEO.json must be an object with a url string");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);
