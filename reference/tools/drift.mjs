/**
 * Locate WHERE a page starts drifting vertically from its source.
 *
 *   node drift.mjs <wp-url> <astro-url> [width]
 *
 * Matches elements by their visible text (normalized) and reports each one's
 * top offset on both sides plus the delta. Read it top-down: the first row
 * with a non-trivial delta is where the drift is introduced. Everything below
 * inherits it, so fixing the first row usually collapses the rest.
 */
import { chromium } from "playwright-core";

const [wpUrl, astroUrl, widthArg] = process.argv.slice(2);
const width = Number(widthArg ?? 1440);

const collect = async (browser, url) => {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" }).catch(() => {});
  await page.waitForTimeout(4000);
  await page.waitForLoadState("networkidle").catch(() => {});
  const rows = await page.evaluate(() => {
    const norm = (s) => (s || "").replace(/\s+/g, " ").trim();
    const out = [];
    for (const el of document.querySelectorAll("h1,h2,h3,h4,p,li,label,button,a,span")) {
      // leaf-ish nodes only: skip wrappers whose text belongs to a child
      if (el.children.length > 2) continue;
      const text = norm(el.textContent).slice(0, 44);
      if (text.length < 8) continue;
      const r = el.getBoundingClientRect();
      if (r.height === 0 || r.width === 0) continue;
      const c = getComputedStyle(el);
      out.push({
        text,
        top: Math.round(r.top + window.scrollY),
        h: Math.round(r.height),
        size: c.fontSize,
        lh: c.lineHeight,
        fam: c.fontFamily.split(",")[0].replace(/["']/g, ""),
      });
    }
    return out;
  });
  await ctx.close();
  // first occurrence wins, so repeated boilerplate does not shadow content
  const byText = new Map();
  for (const r of rows) if (!byText.has(r.text)) byText.set(r.text, r);
  return byText;
};

const browser = await chromium.launch({ channel: "chrome" });
const wp = await collect(browser, wpUrl);
const astro = await collect(browser, astroUrl);
await browser.close();

const shared = [...wp.keys()].filter((t) => astro.has(t));
console.log(`viewport ${width}px — ${shared.length} shared texts\n`);
console.log("  delta   wp_top  as_top  wp(size/lh)      as(size/lh)      text");
const rows = shared
  .map((t) => ({ t, w: wp.get(t), a: astro.get(t) }))
  .sort((x, y) => x.w.top - y.w.top);
for (const { t, w, a } of rows) {
  const d = a.top - w.top;
  const flag = Math.abs(d) >= 8 ? "*" : " ";
  console.log(
    `${flag}${String(d).padStart(6)}  ${String(w.top).padStart(6)}  ${String(a.top).padStart(6)}  ` +
      `${(w.size + "/" + w.lh).padEnd(16)} ${(a.size + "/" + a.lh).padEnd(16)} ${t}`
  );
}
const missing = [...wp.keys()].filter((t) => !astro.has(t));
if (missing.length) {
  console.log(`\n${missing.length} texts in source but NOT matched in Astro (first 10):`);
  for (const t of missing.slice(0, 10)) console.log(`  ${wp.get(t).top}px  ${t}`);
}
