import { chromium } from "playwright-core";
const [url, w] = process.argv.slice(2);
const br = await chromium.launch({ channel: "chrome" });
const p = await (await br.newContext({ viewport: { width: Number(w ?? 1440), height: 900 } })).newPage();
await p.goto(url, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(2500);
console.log(JSON.stringify(await p.evaluate(() => {
  const w = document.querySelector(".elementor-widget-polylang-language-switcher");
  if (!w) return "none";
  const dump = (e, d) => {
    const r = e.getBoundingClientRect();
    const c = getComputedStyle(e);
    let s = `${"  ".repeat(d)}${e.tagName}.${String(e.getAttribute("class") || "").slice(0, 34)} ${Math.round(r.x)},${Math.round(r.y + scrollY)} ${Math.round(r.width)}x${Math.round(r.height * 100) / 100} fs${c.fontSize} lh${c.lineHeight} col${c.color} bg${c.backgroundColor} p${c.padding}`;
    if (d < 5) for (const k of e.children) s += "\n" + dump(k, d + 1);
    return s;
  };
  return { tree: dump(w, 0), html: w.innerHTML.replace(/\s+/g, " ").slice(0, 700) };
}), null, 1));
await br.close();
