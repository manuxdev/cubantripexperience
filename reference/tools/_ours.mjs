import { chromium } from "playwright-core";
const [url, w] = process.argv.slice(2);
const br = await chromium.launch({ channel: "chrome" });
const ctx = await br.newContext({ viewport: { width: Number(w), height: 900 } });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: "domcontentloaded" }).catch(() => {});
await p.waitForTimeout(3000);
await p.waitForLoadState("networkidle").catch(() => {});
console.log(JSON.stringify(await p.evaluate(() => ({
  scrollW: document.documentElement.scrollWidth,
  blocks: [...document.querySelectorAll("main > section > .es-blk")].map((e) => {
    const r = e.getBoundingClientRect();
    const t = e.querySelector(".es-blk-text").getBoundingClientRect();
    const m = e.querySelector(".es-carousel").getBoundingClientRect();
    const parts = [...e.querySelectorAll(".es-blk-text > *")].map((c) => {
      const b = c.getBoundingClientRect();
      const cs = getComputedStyle(c);
      return `${c.tagName}${c.className.split(" ")[0]}:${Math.round(b.y + scrollY)}+${Math.round(b.height * 100) / 100} m${cs.marginTop}/${cs.marginBottom}`;
    });
    return { y: Math.round(r.y + scrollY), h: Math.round(r.height * 100) / 100, parts,
             text: `${Math.round(t.x)},${Math.round(t.y + scrollY)} ${Math.round(t.width)}x${Math.round(t.height)}`,
             car: `${Math.round(m.x)},${Math.round(m.y + scrollY)} ${Math.round(m.width)}x${Math.round(m.height)}` };
  }),
})), null, 1));
await br.close();
