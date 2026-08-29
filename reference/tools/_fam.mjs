import { chromium } from "playwright-core";
const [url, sel, w] = process.argv.slice(2);
const br = await chromium.launch({ channel: "chrome" });
const ctx = await br.newContext({ viewport: { width: Number(w), height: 900 } });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: "domcontentloaded" }).catch(() => {});
await p.waitForTimeout(3500);
console.log(JSON.stringify(await p.evaluate((sel) =>
  [...document.querySelectorAll(sel)].map((e) => {
    const r = e.getBoundingClientRect(); const c = getComputedStyle(e);
    return { t: e.textContent.trim().slice(0, 16), w: Math.round(r.width), h: Math.round(r.height * 100) / 100,
             fam: c.fontFamily.split(",")[0].replace(/["']/g, ""), fs: c.fontSize, lh: c.lineHeight, bw: c.borderWidth, pad: c.padding, box: c.boxSizing };
  }), sel), null, 1));
await br.close();
