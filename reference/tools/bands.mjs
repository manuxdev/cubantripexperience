// Where does a diff actually live? Row-by-row differing-pixel counts collapsed
// into contiguous bands, so a percentage turns into y-ranges you can look at.
import fs from "node:fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const dir = process.argv[2], v = process.argv[3] || "mobile";
const a = PNG.sync.read(fs.readFileSync(`${dir}/${v}.png`));
const b = PNG.sync.read(fs.readFileSync(`${dir}/astro-${v}.png`));
const W = a.width, h = Math.min(a.height, b.height);
const out = new PNG({ width: W, height: h });
pixelmatch(a.data, b.data, out.data, W, h, { threshold: 0.1 });
const rows = [];
for (let y = 0; y < h; y++) { let n = 0; for (let x = 0; x < W; x++) if (out.data[(y * W + x) * 4] > 0) n++; rows.push(n); }
for (const T of [0.10, 0.30, 0.60]) {
  let s = null; let bands = [];
  for (let y = 0; y <= h; y++) { const hot = y < h && rows[y] > W * T; if (hot && s === null) s = y; if (!hot && s !== null) { bands.push([s, y - 1]); s = null; } }
  bands = bands.filter(([s, e]) => e - s >= 6);
  console.log(`--- rows over ${T * 100}% differing: ${bands.length} bands ---`);
  for (const [s, e] of bands.slice(0, 25)) console.log(`  y ${s}-${e} (${e - s + 1}px)`);
}
