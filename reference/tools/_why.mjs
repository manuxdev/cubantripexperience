import { chromium } from "playwright-core";
const br = await chromium.launch({ channel: "chrome" });
const ctx = await br.newContext({ viewport: { width: 768, height: 900 } });
const p = await ctx.newPage();
await p.goto("http://localhost:8080/destinos/", { waitUntil: "networkidle" }).catch(() => {});
await p.waitForTimeout(3000);
const out = await p.evaluate(() => {
  const img = [...document.querySelectorAll("a")].find((a) => a.textContent.includes("See More"));
  const chain = [];
  let e = img;
  for (let i = 0; i < 5 && e; i++, e = e.parentElement) {
    const c = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    chain.push({
      tag: e.tagName + "." + [...e.classList].slice(0, 3).join("."),
      box: `${Math.round(r.x)} ${Math.round(r.width)}w`,
      display: c.display, width: c.width, maxWidth: c.maxWidth,
      margin: c.margin, align: `${c.alignItems}/${c.alignSelf}/${c.justifyContent}`,
      textAlign: c.textAlign,
    });
  }
  return chain;
});
console.log(JSON.stringify(out, null, 1));
await br.close();
