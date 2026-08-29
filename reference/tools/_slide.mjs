import { chromium } from "playwright-core";
const br = await chromium.launch({ channel: "chrome" });
const ctx = await br.newContext({ viewport: { width: 390, height: 900 } });
const p = await ctx.newPage();
await p.goto("http://localhost:8080/destinos/", { waitUntil: "domcontentloaded" }).catch(() => {});
await p.waitForTimeout(4000);
console.log(JSON.stringify(await p.evaluate(() => {
  const els = [...document.querySelectorAll(".swiper-slide, .elementor-carousel-image")].slice(0, 8);
  return els.map((e) => ({
    cls: e.className.slice(0, 60),
    bg: getComputedStyle(e).backgroundImage.slice(0, 70),
    attrs: [...e.attributes].map((a) => a.name + "=" + a.value.slice(0, 60)),
  }));
}), null, 1));
await br.close();
