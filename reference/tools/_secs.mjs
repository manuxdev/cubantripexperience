import { chromium } from "playwright-core";
const [url, sel, w] = process.argv.slice(2);
const br = await chromium.launch({ channel: "chrome" });
const ctx = await br.newContext({ viewport: { width: Number(w), height: 900 } });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: "domcontentloaded" }).catch(() => {});
await p.waitForTimeout(3500);
await p.waitForLoadState("networkidle").catch(() => {});
console.log(JSON.stringify(await p.evaluate((sel) =>
  [...document.querySelectorAll(sel)].map((e) => {
    const r = e.getBoundingClientRect();
    return { y: Math.round(r.y + scrollY), h: Math.round(r.height * 100) / 100, cls: e.className.slice(0, 50) };
  }), sel), null, 0));
await br.close();
