import { chromium } from "playwright-core";
const [url, sel, w] = process.argv.slice(2);
const br = await chromium.launch({ channel: "chrome" });
const ctx = await br.newContext({ viewport: { width: Number(w), height: 900 } });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: "domcontentloaded" }).catch(() => {});
await p.waitForTimeout(3000);
const out = await p.evaluate((sel) => {
  const root = document.querySelector(sel);
  if (!root) return "not found";
  const dump = (e, d) => {
    const b = e.getBoundingClientRect();
    const c = getComputedStyle(e);
    let s = `${"  ".repeat(d)}${e.tagName}.${String(e.getAttribute("class") || "").slice(0, 30)} ${Math.round(b.x)},${Math.round(b.y + scrollY)} ${Math.round(b.width)}x${Math.round(b.height * 100) / 100} m${c.margin} p${c.padding}`;
    if (d < 3) for (const k of e.children) s += "\n" + dump(k, d + 1);
    return s;
  };
  return dump(root, 0);
}, sel);
console.log(out);
await br.close();
