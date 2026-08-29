import { chromium } from "playwright-core";
const [url, needle, w] = process.argv.slice(2);
const br = await chromium.launch({ channel: "chrome" });
const ctx = await br.newContext({ viewport: { width: Number(w), height: 900 } });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: "domcontentloaded" }).catch(() => {});
await p.waitForTimeout(3500);
const out = await p.evaluate((needle) => {
  const ws = [...document.querySelectorAll(".elementor-widget")].filter((e) => String(e.getAttribute("class") || "").includes(needle) || e.textContent.includes(needle)).filter((e) => e.getBoundingClientRect().height > 0);
  const w = ws[0];
  if (!w) return "not found";
  const dump = (e, d) => {
    const b = e.getBoundingClientRect();
    const c = getComputedStyle(e);
    let s = `${"  ".repeat(d)}${e.tagName}.${String(e.getAttribute("class") || "").slice(0, 34)} ${Math.round(b.x)},${Math.round(b.y + scrollY)} ${Math.round(b.width)}x${Math.round(b.height * 100) / 100} fs${c.fontSize} lh${c.lineHeight} m${c.margin} p${c.padding}`;
    for (const k of e.children) s += "\n" + dump(k, d + 1);
    return s;
  };
  return dump(w, 0);
}, needle);
console.log(out);
await br.close();
