/**
 * Functional check for the wired carousels: click the arrows and dots and
 * assert the visible slide actually changes.
 *   node _click.mjs <url> [width]
 */
import { chromium } from "playwright-core";
const [url, w] = process.argv.slice(2);
const br = await chromium.launch({ channel: "chrome" });
const ctx = await br.newContext({ viewport: { width: Number(w ?? 1440), height: 900 } });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: "domcontentloaded" }).catch(() => {});
await p.waitForTimeout(2500);

const visible = (root) =>
  p.evaluate(
    (i) => {
      const r = document.querySelectorAll("[data-carousel]")[i];
      const slides = [...r.querySelectorAll("[data-slide]")];
      return slides.findIndex((s) => !s.classList.contains("opacity-0") && !s.classList.contains("invisible"));
    },
    root
  );

const n = await p.evaluate(() => document.querySelectorAll("[data-carousel]").length);
console.log(`${n} carousels on ${url}`);
let fail = 0;
for (let i = 0; i < n; i++) {
  const start = await visible(i);
  const nextBtn = p.locator("[data-carousel]").nth(i).locator("[data-next]");
  if (await nextBtn.count()) await nextBtn.click();
  const afterNext = await visible(i);
  const prevBtn = p.locator("[data-carousel]").nth(i).locator("[data-prev]");
  if (await prevBtn.count()) await prevBtn.click();
  const afterPrev = await visible(i);
  const dots = p.locator("[data-carousel]").nth(i).locator("[data-dot]");
  const dotCount = await dots.count();
  let afterDot = afterPrev;
  if (dotCount > 1) { await dots.nth(dotCount - 1).click(); afterDot = await visible(i); }
  // Not every carousel has arrows: the review slider is dots-only, like the source.
  const hasArrows = (await nextBtn.count()) > 0;
  // Drag: press, move past the 40px threshold, release — must advance one slide.
  // Drag inside the image itself, where the handler lives — and after the
  // entrance animation has settled, or the coordinates chase a moving box.
  await p.waitForTimeout(300);
  const surface = p.locator("[data-carousel]").nth(i).locator(".es-carousel, .es-slides");
  const box = await ((await surface.count()) ? surface : p.locator("[data-carousel]").nth(i)).boundingBox();
  let afterDrag = null;
  if (box) {
    const before = await visible(i);
    const y = box.y + box.height / 2;
    await p.mouse.move(box.x + box.width * 0.5, y);
    await p.mouse.down();
    await p.mouse.move(box.x + box.width * 0.5 - 120, y, { steps: 8 });
    await p.mouse.up();
    await p.waitForTimeout(150);
    afterDrag = (await visible(i)) !== before;
  }
  const ok =
    (!hasArrows || (afterNext !== start && afterPrev === start)) &&
    (dotCount < 2 || afterDot === dotCount - 1) &&
    afterDrag !== false;
  if (!ok) fail++;
  console.log(`  #${i}: ${dotCount} dots, arrows ${hasArrows} | next ${afterNext} prev ${afterPrev} dot ${afterDot} drag ${afterDrag}  ${ok ? "OK" : "FAIL"}`);
}
await br.close();
process.exit(fail ? 1 : 0);
