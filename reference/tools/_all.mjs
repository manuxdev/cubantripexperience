import { chromium } from "playwright-core";
const [url, w, h] = process.argv.slice(2);
const br = await chromium.launch({ channel: "chrome" });
const ctx = await br.newContext({ viewport: { width: Number(w), height: Number(h ?? 900) } });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: "domcontentloaded" }).catch(() => {});
await p.waitForTimeout(4000);
await p.waitForLoadState("networkidle").catch(() => {});
const out = await p.evaluate(() => {
  const rows = [];
  document.querySelectorAll(".elementor-top-section").forEach((sec, si) => {
    const sb = sec.getBoundingClientRect();
    rows.push(`S${si + 1}  y${Math.round(sb.y + scrollY)} h${Math.round(sb.height * 100) / 100}`);
    sec.querySelectorAll(".elementor-widget").forEach((wd) => {
      const b = wd.getBoundingClientRect();
      if (b.height === 0 && b.width === 0) return;
      const type = (wd.className.match(/elementor-widget-([a-z-]+)/) || [])[1];
      const c = getComputedStyle(wd);
      const inner = wd.querySelector(".elementor-widget-container");
      const ic = inner && getComputedStyle(inner);
      rows.push(`     ${type.padEnd(16)} x${Math.round(b.x)} y${Math.round(b.y + scrollY)} ${Math.round(b.width)}x${Math.round(b.height * 100) / 100} m${c.margin}${ic && ic.margin !== "0px" ? " im" + ic.margin : ""} :: ${(wd.textContent || "").replace(/\s+/g, " ").trim().slice(0, 34)}`);
    });
  });
  return rows;
});
console.log(out.join("\n"));
await br.close();
