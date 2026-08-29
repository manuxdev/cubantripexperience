// Dump the Elementor element tree (sections/columns/widgets) with geometry.
import { chromium } from "playwright-core";
const [url, widthArg, rootSel] = process.argv.slice(2);
const width = Number(widthArg ?? 1440);
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width, height: Number(process.argv[5] ?? 900) } });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(()=>{});
await p.addStyleTag({ content: `.elementor-invisible{visibility:visible!important;opacity:1!important;animation:none!important}*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important}` });
await p.evaluate(async () => { await new Promise(r => { let y=0; const t=setInterval(()=>{window.scrollTo(0,y);y+=400;if(y>document.body.scrollHeight+1000){clearInterval(t);window.scrollTo(0,0);r();}},60); }); });
await p.waitForTimeout(1200);
const lines = await p.evaluate((rootSel) => {
  const out = [];
  const walk = (el, d) => {
    for (const ch of el.children) {
      const cls = (ch.className||"").toString();
      const isEl = /elementor-(section|column|widget|widget-wrap|container|row)/.test(cls) || ch.tagName === "IMG";
      const r = ch.getBoundingClientRect();
      const c = getComputedStyle(ch);
      if (isEl) {
        let tag = ch.tagName.toLowerCase();
        const m = cls.match(/elementor-widget-([a-z0-9-]+)/);
        const kind = m ? "w:"+m[1] : /elementor-column/.test(cls) ? "col" : /elementor-widget-wrap/.test(cls) ? "wrap" : /elementor-row|elementor-container/.test(cls) ? "row" : /elementor-section/.test(cls) ? "sec" : tag;
        out.push(`${"  ".repeat(d)}${kind} t=${Math.round(r.top+scrollY)} h=${Math.round(r.height)} w=${Math.round(r.width)} l=${Math.round(r.left)} pad=${c.padding} mar=${c.margin} | ${(ch.textContent||"").replace(/\s+/g," ").trim().slice(0,40)}`);
        walk(ch, d+1);
      } else {
        walk(ch, d);
      }
    }
  };
  const root = document.querySelector(rootSel);
  if (root) {
    const r = root.getBoundingClientRect(); const c = getComputedStyle(root);
    out.push(`ROOT t=${Math.round(r.top+scrollY)} h=${Math.round(r.height)} w=${Math.round(r.width)} l=${Math.round(r.left)} pad=${c.padding} mar=${c.margin}`);
    walk(root, 1);
  }
  return out;
}, rootSel);
console.log(lines.join("\n"));
await b.close();
