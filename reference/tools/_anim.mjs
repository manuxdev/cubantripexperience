import { chromium } from "playwright-core";
const br = await chromium.launch({ channel: "chrome" });
const p = await (await br.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto("http://localhost:8080/destinos/", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(3000);
console.log(JSON.stringify(await p.evaluate(() => {
  const out = {};
  const nav = document.querySelector(".elementor-invisible, [data-settings*='fadeInUp']");
  const anim = document.querySelector(".animated");
  if (anim) {
    const c = getComputedStyle(anim);
    out.animated = { name: c.animationName, dur: c.animationDuration, tf: c.animationTimingFunction, fill: c.animationFillMode };
  }
  // Read Elementor's own keyframes out of the loaded stylesheets
  const wanted = ["fadeInUp", "fadeInLeft", "fadeInRight", "elementor-animation-pulse"];
  out.keyframes = {};
  for (const sheet of document.styleSheets) {
    let rules;
    try { rules = sheet.cssRules; } catch { continue; }
    for (const r of rules) {
      if (r.type === CSSRule.KEYFRAMES_RULE && wanted.includes(r.name)) {
        out.keyframes[r.name] = [...r.cssRules].map((k) => k.cssText).join(" ");
      }
      if (r.type === CSSRule.STYLE_RULE && /elementor-animation-float|e--animation-slide|elementor-item:before|elementor-item:after/.test(r.selectorText || "")) {
        out[r.selectorText] = r.style.cssText.slice(0, 200);
      }
      if (r.type === CSSRule.STYLE_RULE && /ken-burns/.test(r.selectorText || "")) {
        out[r.selectorText] = r.style.cssText.slice(0, 200);
      }
    }
  }
  return out;
}), null, 1));
await br.close();
