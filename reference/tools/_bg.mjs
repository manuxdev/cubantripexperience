import { chromium } from "playwright-core";
const [w] = process.argv.slice(2);
const br = await chromium.launch({ channel: "chrome" });
const ctx = await br.newContext({ viewport: { width: Number(w), height: 900 } });
const p = await ctx.newPage();
await p.goto("http://localhost:8080/es/", { waitUntil: "domcontentloaded" }).catch(() => {});
await p.waitForTimeout(4000);
const out = await p.evaluate(() => {
  const el = document.querySelector(".elementor-slides .swiper-slide-bg, .elementor-slide-bg, .elementor-repeater-item-0 .swiper-slide-bg");
  const any = [...document.querySelectorAll("[class*=slide]")].filter((e) => getComputedStyle(e).backgroundImage !== "none").slice(0, 3);
  return any.map((e) => {
    const c = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    return { cls: String(e.getAttribute("class")).slice(0, 50), box: `${Math.round(r.width)}x${Math.round(r.height)}`,
             bg: c.backgroundImage.slice(0, 90), size: c.backgroundSize, pos: c.backgroundPosition, tr: c.transform };
  });
});
console.log(JSON.stringify(out, null, 1));
await br.close();
