/** Report the animated elements' resting state under shot.mjs's neutraliser. */
import { chromium } from "playwright-core";
const [url] = process.argv.slice(2);
const br = await chromium.launch({ channel: "chrome" });
const p = await (await br.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto(url, { waitUntil: "domcontentloaded" });
await p.addStyleTag({ content: `
  .elementor-invisible { visibility: visible !important; opacity: 1 !important; animation: none !important; }
  .es-anim-idle { opacity: 1 !important; animation: none !important; }
  *, *::before, *::after {
    animation-duration: 0s !important; animation-delay: 0s !important;
    transition-duration: 0s !important; transition-delay: 0s !important;
  }` });
await p.evaluate(async () => {
  await new Promise((r) => { let y = 0; const t = setInterval(() => {
    window.scrollTo(0, y); y += 400;
    if (y > document.body.scrollHeight + 1000) { clearInterval(t); window.scrollTo(0, 0); r(); }
  }, 60); });
});
await p.waitForTimeout(1500);
console.log("scrollY end:", await p.evaluate(() => window.scrollY), "max:", await p.evaluate(() => document.documentElement.scrollHeight - window.innerHeight));
console.log("tops now:", await p.evaluate(() => [...document.querySelectorAll("[data-anim]")].map((e) => Math.round(e.getBoundingClientRect().top))));
console.log("body.scrollHeight:", await p.evaluate(() => document.body.scrollHeight));
console.log(JSON.stringify(await p.evaluate(() =>
  [...document.querySelectorAll("[data-anim]")].map((e) => {
    const c = getComputedStyle(e);
    return { anim: e.getAttribute("data-anim"), cls: e.className.match(/es-anim-\w+/g), opacity: c.opacity, transform: c.transform, animName: c.animationName };
  })
), null, 1));
await br.close();
