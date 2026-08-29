import { chromium } from "playwright-core";
const [url, sel] = process.argv.slice(2);
const br = await chromium.launch({ channel: "chrome" });
const ctx = await br.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: "domcontentloaded" }).catch(() => {});
await p.waitForTimeout(3000);
console.log(JSON.stringify(await p.evaluate((sel) => {
  const e = document.querySelector(sel);
  if (!e) return "none";
  const c = getComputedStyle(e);
  const k = e.firstElementChild;
  const kc = k && getComputedStyle(k);
  return { fam: c.fontFamily, fs: c.fontSize, lh: c.lineHeight, h: e.getBoundingClientRect().height,
           kid: k && { tag: k.tagName, disp: kc.display, va: kc.verticalAlign, fs: kc.fontSize, lh: kc.lineHeight, h: k.getBoundingClientRect().height } };
}, sel), null, 1));
await br.close();
