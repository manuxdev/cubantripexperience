/**
 * Report WHERE a diff PNG's differing pixels are, as horizontal bands.
 *   node where.mjs <diff.png> [bandHeight]
 * Diff pixels are the red ones pixelmatch writes.
 */
import { PNG } from "pngjs";
import { readFileSync } from "node:fs";
const [file, bandArg] = process.argv.slice(2);
const band = Number(bandArg ?? 50);
const png = PNG.sync.read(readFileSync(file));
const bands = new Array(Math.ceil(png.height / band)).fill(0);
for (let y = 0; y < png.height; y++) {
  let n = 0;
  for (let x = 0; x < png.width; x++) {
    const i = (png.width * y + x) << 2;
    if (png.data[i] > 200 && png.data[i + 1] < 100 && png.data[i + 2] < 100) n++;
  }
  bands[Math.floor(y / band)] += n;
}
const total = bands.reduce((a, b) => a + b, 0);
console.log(`${file} — ${total} diff px over ${png.width}x${png.height}`);
bands.forEach((n, i) => {
  if (n === 0) return;
  const pct = (n / total) * 100;
  if (pct < 1) return;
  console.log(`  y ${String(i * band).padStart(5)}-${String(i * band + band - 1).padStart(5)}  ${pct.toFixed(1).padStart(5)}%  ${"#".repeat(Math.round(pct / 2))}`);
});
