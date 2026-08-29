import { chromium } from "playwright-core";
const br = await chromium.launch({ channel: "chrome" });
const p = await (await br.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto("http://localhost:8080/destinos/", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(3500);
const rows = await p.evaluate(() =>
  [...document.querySelectorAll(".elementor-carousel-image")].map((e) => {
    const bg = e.dataset.background || getComputedStyle(e).backgroundImage;
    const m = bg.match(/\/([^/"')]+\.(?:webp|jpg|png))/i);
    return { file: m ? decodeURIComponent(m[1]) : bg.slice(0, 40), alt: e.getAttribute("aria-label") };
  })
);
const seen = new Map();
for (const r of rows) if (r.alt && !seen.has(r.file)) seen.set(r.file, r.alt);
for (const [f, a] of seen) console.log(`${f.slice(0, 46).padEnd(48)} ${a}`);
await br.close();
