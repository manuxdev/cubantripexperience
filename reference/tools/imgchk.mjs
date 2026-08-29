import { chromium } from "playwright-core";
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto("http://localhost:8080/es/", { waitUntil: "networkidle", timeout: 60000 }).catch(()=>{});
await p.evaluate(async () => { await new Promise(r => { let y=0; const t=setInterval(()=>{window.scrollTo(0,y);y+=400;if(y>document.body.scrollHeight+1000){clearInterval(t);window.scrollTo(0,0);r();}},60); }); });
await p.waitForTimeout(1500);
console.log(await p.evaluate(() => [...document.images].map(i => `${Math.round(i.getBoundingClientRect().top+scrollY)} nat=${i.naturalWidth}x${i.naturalHeight} box=${Math.round(i.getBoundingClientRect().width)}x${Math.round(i.getBoundingClientRect().height)} op=${getComputedStyle(i).opacity} vis=${getComputedStyle(i).visibility} ${i.currentSrc.split("/").pop()}`).join("\n")));
await b.close();
