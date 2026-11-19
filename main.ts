// gta6-meme-x-01 entry: this program hands the house the post it must judge.
// It reads POST.json from the repository root, checks it names an X post
// address, and copies it to /output/POST.json, where the gate reads it. The
// meme itself lives in meme.png and the post on X; nothing this program
// writes is judged, and the house reads the post itself from X.
//
// Node 22, standard library only. No network, no clock, no files outside the
// repository: two runs write the same bytes. Run it as the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const POST_FILE = 'POST.json';

// An X post address: https://x.com/<handle>/status/<id>, or the same on
// twitter.com (www. or mobile. allowed). This checks the shape only; whether
// the post exists and is public is the house's job, not this program's.
const POST_URL = /^https:\/\/(?:www\.|mobile\.)?(?:x\.com|twitter\.com)\/[^/]+\/status\/[^/?#]+$/;

const postPath = join(BOT_DIR, POST_FILE);
let post: unknown;
try {
  post = JSON.parse(readFileSync(postPath, 'utf8'));
} catch (err) {
  console.error(`${POST_FILE} could not be read as JSON: ${(err as Error).message}`);
  process.exit(1);
}

if (
  typeof post !== 'object' ||
  post === null ||
  typeof (post as { url?: unknown }).url !== 'string' ||
  !POST_URL.test((post as { url: string }).url)
) {
  console.error(
    `${POST_FILE} must be a JSON object with a url like https://x.com/<handle>/status/<id>`,
  );
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(postPath, join(OUTPUT_DIR, POST_FILE));
} catch (err) {
  console.error(`${POST_FILE} could not be copied to ${OUTPUT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
