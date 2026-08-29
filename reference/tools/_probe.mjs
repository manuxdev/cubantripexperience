import { chromium } from "playwright-core";
const [url, w] = process.argv.slice(2);
const br = await chromium.launch({ channel: "chrome" });
const ctx = await br.newContext({ viewport: { width: Number(w), height: 900 } });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: "domcontentloaded" }).catch(() => {});
await p.waitForTimeout(4000);
await p.waitForLoadState("networkidle").catch(() => {});
const r = await p.evaluate(() => {
  const out = { sections: [], heads: [], carousels: [] };
  for (const s of document.querySelectorAll(".elementor-top-section")) {
    const b = s.getBoundingClientRect();
    out.sections.push({ y: Math.round(b.y + scrollY), h: Math.round(b.height * 100) / 100 });
  }
  for (const h of document.querySelectorAll("h2.elementor-heading-title, .elementor-widget-heading h1,.elementor-widget-heading h2,.elementor-widget-heading h3")) {
    const b = h.getBoundingClientRect(); const c = getComputedStyle(h);
    if (b.height === 0) continue;
    out.heads.push({ t: h.textContent.trim().slice(0, 22), y: Math.round(b.y + scrollY), x: Math.round(b.x), w: Math.round(b.width), h: Math.round(b.height), fs: c.fontSize, lh: c.lineHeight, fw: c.fontWeight, col: c.color });
  }
  out.text = [];
  for (const el of document.querySelectorAll(".elementor-widget-text-editor, .elementor-widget-button, .elementor-widget-heading")) {
    const b = el.getBoundingClientRect();
    if (b.height === 0) continue;
    const c = getComputedStyle(el);
    out.text.push({ t: el.textContent.trim().slice(0, 18), y: Math.round(b.y + scrollY), h: Math.round(b.height * 100) / 100, m: c.margin, p: c.padding });
  }
  for (const el of document.querySelectorAll(".elementor-widget-media-carousel")) {
    const b = el.getBoundingClientRect();
    if (b.height === 0) continue;
    const sw = el.querySelector(".swiper, .swiper-container");
    const sb = sw && sw.getBoundingClientRect();
    out.carousels.push({ y: Math.round(b.y + scrollY), x: Math.round(b.x), w: Math.round(b.width), h: Math.round(b.height), inner: sb && `${Math.round(sb.x)} ${Math.round(sb.width)}x${Math.round(sb.height)}` });
  }
  return out;
});
console.log(JSON.stringify(r, null, 1));
await br.close();
