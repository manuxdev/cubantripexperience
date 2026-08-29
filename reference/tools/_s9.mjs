import { chromium } from "playwright-core";
const [w] = process.argv.slice(2);
const br = await chromium.launch({ channel: "chrome" });
const ctx = await br.newContext({ viewport: { width: Number(w), height: 1024 } });
const p = await ctx.newPage();
await p.goto("http://localhost:8080/servicios/", { waitUntil: "domcontentloaded" }).catch(() => {});
await p.waitForTimeout(3500);
console.log(JSON.stringify(await p.evaluate(() => {
  const sec = [...document.querySelectorAll(".elementor-top-section")].find((s) => s.textContent.includes("Descubre los mejores lugares"));
  const c = getComputedStyle(sec);
  const a = sec.querySelector("a");
  const ac = getComputedStyle(a);
  const r = sec.getBoundingClientRect();
  return { box: `${Math.round(r.width)}x${Math.round(r.height)}`, bgImg: c.backgroundImage.slice(0,80), bgSize: c.backgroundSize, bgPos: c.backgroundPosition,
           btn: { color: ac.color, fs: ac.fontSize, lh: ac.lineHeight, fw: ac.fontWeight } };
}), null, 1));
await br.close();
