import { chromium } from "playwright-core";
const [url, w, h] = process.argv.slice(2);
const br = await chromium.launch({ channel: "chrome" });
const ctx = await br.newContext({ viewport: { width: Number(w), height: Number(h ?? 900) } });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: "domcontentloaded" }).catch(() => {});
await p.waitForTimeout(3000);
await p.waitForLoadState("networkidle").catch(() => {});
const out = await p.evaluate(() => {
  const rows = [];
  const main = document.querySelector("main");
  const hero = document.querySelector("body > div > section");
  if (hero) { const b = hero.getBoundingClientRect(); rows.push(`HERO y${Math.round(b.y + scrollY)} h${Math.round(b.height * 100) / 100}`); }
  const nav = document.querySelector("body > div > nav, body > div > section + nav");
  [...main.children].forEach((el, i) => {
    const b = el.getBoundingClientRect();
    rows.push(`M${i} ${el.tagName} y${Math.round(b.y + scrollY)} h${Math.round(b.height * 100) / 100} :: ${(el.textContent||"").replace(/\s+/g," ").trim().slice(0,30)}`);
  });
  const f = document.querySelector("footer");
  if (f) { const b = f.getBoundingClientRect(); rows.push(`FOOTER y${Math.round(b.y + scrollY)} h${Math.round(b.height * 100) / 100}`); }
  rows.push("total " + document.documentElement.scrollHeight);
  return rows;
});
console.log(out.join("\n"));
await br.close();
