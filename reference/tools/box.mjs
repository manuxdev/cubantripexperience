/**
 * Compare the box of every element matching a selector, side by side.
 *   node box.mjs <wp-url> <astro-url> <selector> [width]
 */
import { chromium } from "playwright-core";
const [a, b, sel, wArg] = process.argv.slice(2);
const width = Number(wArg ?? 1440);
const grab = async (br, url) => {
  const ctx = await br.newContext({ viewport: { width, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: "domcontentloaded" }).catch(() => {});
  await p.waitForTimeout(4000);
  await p.waitForLoadState("networkidle").catch(() => {});
  await p.evaluate(async () => {
    // Same lazy settle shot.mjs uses: measuring an unswapped placeholder
    // reports the placeholder's box, not the real image's.
    await new Promise((r) => { let y = 0; const t = setInterval(() => {
      window.scrollTo(0, y); y += 400;
      if (y > document.body.scrollHeight + 1000) { clearInterval(t); window.scrollTo(0, 0); r(); }
    }, 60); });
    document.querySelectorAll("img[data-src]").forEach((img) => {
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      if (img.dataset.sizes && img.dataset.sizes !== "auto") img.sizes = img.dataset.sizes;
      if (img.src !== img.dataset.src) img.src = img.dataset.src;
    });
    const settled = (i) => i.complete ? Promise.resolve()
      : new Promise((r) => { i.addEventListener("load", r, { once: true }); i.addEventListener("error", r, { once: true }); });
    await Promise.race([
      Promise.all([...document.images].map(settled)),
      new Promise((r) => setTimeout(r, 5000)),
    ]);
  });
  await p.waitForTimeout(1000);
  const r = await p.evaluate((sel) =>
    [...document.querySelectorAll(sel)].map((e) => {
      const r = e.getBoundingClientRect();
      const c = getComputedStyle(e);
      return {
        x: Math.round(r.x), y: Math.round(r.y + scrollY),
        w: Math.round(r.width), h: Math.round(r.height),
        pad: `${c.paddingTop}/${c.paddingBottom}`,
        mar: `${c.marginTop}/${c.marginBottom}`,
        txt: (e.textContent || "").replace(/\s+/g, " ").trim().slice(0, 26),
      };
    }), sel);
  await ctx.close();
  return r;
};
const br = await chromium.launch({ channel: "chrome" });
const [A, B] = [await grab(br, a), await grab(br, b)];
await br.close();
console.log(`WP ${A.length} | ASTRO ${B.length}  sel="${sel}" @${width}px\n`);
const f = (o) => o ? `${String(o.x).padStart(4)},${String(o.y).padStart(5)} ${String(o.w).padStart(4)}x${String(o.h).padStart(4)} p:${o.pad.padEnd(11)} m:${o.mar.padEnd(11)}` : "-".padEnd(52);
for (let i = 0; i < Math.max(A.length, B.length); i++) {
  const p = A[i], q = B[i];
  const bad = p && q && (Math.abs(p.h - q.h) > 2 || Math.abs(p.w - q.w) > 2);
  console.log(`${bad ? "*" : " "} ${f(p)} | ${f(q)}  ${(p?.txt ?? "").padEnd(26)} | ${q?.txt ?? ""}`);
}
