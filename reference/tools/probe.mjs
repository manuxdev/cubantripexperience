// Dump top-level Elementor section geometry for a URL at a viewport.
import { chromium } from "playwright-core";
const [url, widthArg, sel] = process.argv.slice(2);
const width = Number(widthArg ?? 1440);
const selector = sel || "body > * , .elementor-section.elementor-top-section";
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width, height: 900 } });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(()=>{});
await p.addStyleTag({ content: `.elementor-invisible{visibility:visible!important;opacity:1!important;animation:none!important}*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important}` });
await p.evaluate(async () => { await new Promise(r => { let y=0; const t=setInterval(()=>{window.scrollTo(0,y);y+=400;if(y>document.body.scrollHeight+1000){clearInterval(t);window.scrollTo(0,0);r();}},60); }); });
await p.waitForTimeout(1200);
const rows = await p.evaluate((selector) => {
  const out = [];
  document.querySelectorAll(selector).forEach((el) => {
    const r = el.getBoundingClientRect();
    const c = getComputedStyle(el);
    out.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.className||"").toString().slice(0,90),
      top: Math.round(r.top + window.scrollY),
      h: Math.round(r.height),
      w: Math.round(r.width),
      left: Math.round(r.left),
      pad: c.padding, mar: c.margin,
      bg: c.backgroundColor,
      txt: (el.textContent||"").replace(/\s+/g," ").trim().slice(0,50),
    });
  });
  out.push({ tag: "#doc", cls: "", top: 0, h: Math.round(document.documentElement.scrollHeight), w: 0, left:0, pad:"", mar:"", bg:"", txt:"" });
  return out;
}, selector);
for (const r of rows) console.log(`${String(r.top).padStart(6)} h=${String(r.h).padStart(5)} w=${String(r.w).padStart(5)} l=${String(r.left).padStart(4)} ${r.tag.padEnd(8)} pad=${r.pad.padEnd(22)} mar=${r.mar.padEnd(22)} bg=${r.bg.padEnd(22)} | ${r.cls} | ${r.txt}`);
await b.close();
