/**
 * Pixel-diff a captured Astro page against its WordPress reference.
 *
 *   node diff.mjs <reference/es/<slug> directory>
 *
 * Emits one line per viewport plus a PASS/FAIL verdict, and writes
 * diff-<viewport>.png highlighting every differing pixel.
 *
 * Two numbers per viewport, because they catch different failures:
 *   height  full-page height delta. Catches layout that grows or collapses --
 *           the failure class that shipped /contact-us at 1273px vs 1055px.
 *   pixels  share of differing pixels over the common region. Catches wrong
 *           colors, fonts, spacing and imagery at identical height.
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const dir = process.argv[2];
const HEIGHT_TOLERANCE = Number(process.env.HEIGHT_TOLERANCE ?? 0.02);
const PIXEL_TOLERANCE = Number(process.env.PIXEL_TOLERANCE ?? 0.02);

// Copy the top-left w*h region of a PNG into a new one, so pixelmatch gets
// identical dimensions even when the two captures differ in height.
function crop(src, w, h) {
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    const from = y * src.width * 4;
    src.data.copy(out.data, y * w * 4, from, from + w * 4);
  }
  return out;
}

// Always print the tolerances in force, and mark them when they are not the
// defaults. A raised tolerance must be visible in the pasted evidence itself,
// not only in whatever note someone remembers to write.
const relaxed = HEIGHT_TOLERANCE > 0.02 || PIXEL_TOLERANCE > 0.02;
console.log(
  `tolerance height ${(HEIGHT_TOLERANCE * 100).toFixed(1)}% ` +
    `pixels ${(PIXEL_TOLERANCE * 100).toFixed(1)}%` +
    (relaxed ? "   <-- RAISED ABOVE DEFAULT, must be justified by a named non-goal" : "")
);

let failed = false;
for (const viewport of ["desktop", "tablet", "mobile"]) {
  const refPath = path.join(dir, `${viewport}.png`);
  const gotPath = path.join(dir, `astro-${viewport}.png`);
  if (!fs.existsSync(refPath) || !fs.existsSync(gotPath)) {
    const missing = fs.existsSync(refPath) ? `astro-${viewport}.png` : `${viewport}.png`;
    console.log(`${viewport.padEnd(8)} SKIP  (missing ${missing})`);
    failed = true;
    continue;
  }

  const ref = PNG.sync.read(fs.readFileSync(refPath));
  const got = PNG.sync.read(fs.readFileSync(gotPath));
  const heightDelta = Math.abs(got.height - ref.height) / ref.height;

  const w = Math.min(ref.width, got.width);
  const h = Math.min(ref.height, got.height);
  const diff = new PNG({ width: w, height: h });
  const differing = pixelmatch(
    crop(ref, w, h).data,
    crop(got, w, h).data,
    diff.data,
    w,
    h,
    { threshold: 0.1 }
  );
  const pixelDelta = differing / (w * h);
  fs.writeFileSync(path.join(dir, `diff-${viewport}.png`), PNG.sync.write(diff));

  const ok = heightDelta <= HEIGHT_TOLERANCE && pixelDelta <= PIXEL_TOLERANCE;
  if (!ok) failed = true;
  console.log(
    `${viewport.padEnd(8)} ${ok ? "PASS" : "FAIL"}  ` +
      `height ${ref.height}->${got.height} (${(heightDelta * 100).toFixed(1)}%)  ` +
      `pixels ${(pixelDelta * 100).toFixed(1)}% of ${w}x${h}`
  );
}

console.log(failed ? "\nVERDICT: FAIL" : "\nVERDICT: PASS");
process.exit(failed ? 1 : 0);
