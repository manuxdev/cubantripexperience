import { chromium } from "playwright-core";
const [w] = process.argv.slice(2);
const br = await chromium.launch({ channel: "chrome" });
const ctx = await br.newContext({ viewport: { width: Number(w), height: 900 } });
const p = await ctx.newPage();
await p.goto("http://localhost:8080/destinos/", { waitUntil: "domcontentloaded" }).catch(() => {});
await p.waitForTimeout(3500);
const out = await p.evaluate(() => {
  return [...document.querySelectorAll(".elementor-swiper-button")].slice(0, 4).map((e) => {
    const r = e.getBoundingClientRect();
    const c = getComputedStyle(e);
    const pr = e.parentElement.getBoundingClientRect();
    return {
      x: Math.round(r.x), y: Math.round(r.y + scrollY),
      w: Math.round(r.width), h: Math.round(r.height),
      fs: c.fontSize, left: c.left, right: c.right, pos: c.position,
      parent: e.parentElement.className.slice(0, 40),
      px: Math.round(pr.x), pw: Math.round(pr.width),
    };
  });
});
console.log(JSON.stringify(out, null, 1));
await br.close();
