import { chromium } from "playwright-core";
const [a, b, w] = process.argv.slice(2);
const grab = async (br, url) => {
  const ctx = await br.newContext({ viewport: { width: Number(w), height: 900 } });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: "domcontentloaded" }).catch(() => {});
  await p.waitForTimeout(3500);
  await p.waitForLoadState("networkidle").catch(() => {});
  return p.evaluate(() => {
    const body = document.body;
    const out = [];
    const walk = (el, d) => {
      for (const c of el.children) {
        const r = c.getBoundingClientRect();
        if (r.height < 5) continue;
        out.push({ d, y: Math.round(r.y + scrollY), h: Math.round(r.height), tag: c.tagName });
        if (d < 3) walk(c, d + 1);
      }
    };
    walk(body, 0);
    return out;
  });
};
const br = await chromium.launch({ channel: "chrome" });
const [A, B] = [await grab(br, a), await grab(br, b)];
await br.close();
const top = (x) => x.filter((r) => r.d <= 1);
console.log("WP depth<=1 cumulative heights");
for (const r of top(A)) console.log(`  d${r.d} y${String(r.y).padStart(5)} h${String(r.h).padStart(5)} ${r.tag}`);
console.log("ASTRO depth<=1");
for (const r of top(B)) console.log(`  d${r.d} y${String(r.y).padStart(5)} h${String(r.h).padStart(5)} ${r.tag}`);
