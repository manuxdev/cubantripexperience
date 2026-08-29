import { chromium } from "playwright-core";
const [url, w] = process.argv.slice(2);
const br = await chromium.launch({ channel: "chrome" });
const ctx = await br.newContext({ viewport: { width: Number(w), height: 900 } });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: "domcontentloaded" }).catch(() => {});
await p.waitForTimeout(3000);
console.log(JSON.stringify(await p.evaluate((vw) =>
  [...document.querySelectorAll("*")]
    .map((e) => { const r = e.getBoundingClientRect(); return { right: Math.round(r.right), tag: e.tagName + "." + [...e.classList].slice(0, 3).join("."), y: Math.round(r.y + scrollY) }; })
    .filter((o) => o.right > vw + 1)
    .sort((a, b) => b.right - a.right)
    .slice(0, 8), Number(w)), null, 1));
await br.close();
