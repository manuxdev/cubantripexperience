import { chromium } from "playwright-core";
const br = await chromium.launch({ channel: "chrome" });
const ctx = await br.newContext({ viewport: { width: 390, height: 844 } });
const p = await ctx.newPage();
await p.goto("http://localhost:8080/es/", { waitUntil: "domcontentloaded" }).catch(() => {});
await p.waitForTimeout(2500);
const toggle = p.locator(".elementor-menu-toggle").first();
await toggle.click().catch(() => {});
await p.waitForTimeout(600);
console.log(JSON.stringify(await p.evaluate(() => {
  const dd = document.querySelector(".elementor-nav-menu--dropdown");
  if (!dd) return "none";
  const r = dd.getBoundingClientRect();
  const c = getComputedStyle(dd);
  const item = dd.querySelector("a");
  const ic = item && getComputedStyle(item);
  const ir = item && item.getBoundingClientRect();
  return {
    box: `${Math.round(r.x)},${Math.round(r.y + scrollY)} ${Math.round(r.width)}x${Math.round(r.height)}`,
    bg: c.backgroundColor, radius: c.borderRadius, pos: c.position,
    item: ic && { box: `${Math.round(ir.x)},${Math.round(ir.y + scrollY)} ${Math.round(ir.width)}x${Math.round(ir.height)}`,
                  bg: ic.backgroundColor, color: ic.color, fs: ic.fontSize, lh: ic.lineHeight, fw: ic.fontWeight, pad: ic.padding, deco: ic.textDecorationLine, ta: ic.textAlign },
  };
}), null, 1));
await br.close();
