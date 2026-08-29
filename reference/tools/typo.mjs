import { chromium } from "playwright-core";
const [url, widthArg, hArg] = process.argv.slice(2);
const width = Number(widthArg ?? 1440);
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width, height: Number(hArg ?? 900) } });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(()=>{});
await p.addStyleTag({ content: `.elementor-invisible{visibility:visible!important;opacity:1!important;animation:none!important}*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important}` });
await p.evaluate(async () => { await new Promise(r => { let y=0; const t=setInterval(()=>{window.scrollTo(0,y);y+=400;if(y>document.body.scrollHeight+1000){clearInterval(t);window.scrollTo(0,0);r();}},60); }); });
await p.waitForTimeout(1000);
const rows = await p.evaluate(() => {
  const out = [];
  document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,a,span,div.elementor-widget-container > *,li,button").forEach((el) => {
    const t = (el.textContent||"").replace(/\s+/g," ").trim();
    if (!t || t.length < 3 || el.children.length > 1) return;
    const r = el.getBoundingClientRect();
    if (!r.height) return;
    const c = getComputedStyle(el);
    out.push(`${String(Math.round(r.top+scrollY)).padStart(5)} ${String(Math.round(r.height)).padStart(4)}x${String(Math.round(r.width)).padStart(4)} ${el.tagName.toLowerCase().padEnd(6)} ${c.fontSize.padEnd(9)}/${c.lineHeight.padEnd(9)} w${c.fontWeight} ${c.color.padEnd(20)} ${c.fontFamily.split(",")[0].replace(/["']/g,"").padEnd(11)} ta=${c.textAlign.padEnd(7)} m=${c.margin.padEnd(20)} p=${c.padding.padEnd(16)} | ${t.slice(0,46)}`);
  });
  return out;
});
console.log(rows.join("\n"));
await b.close();
