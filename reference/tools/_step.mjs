import { chromium } from "playwright-core";
const br = await chromium.launch({ channel: "chrome" });
for (const [lang, url] of [
  ["es", "/reservar/"],
  ["en", "/bookings/"],
  ["ru", "/ru/%d0%b1%d1%80%d0%be%d0%bd%d0%b8%d1%80%d0%be%d0%b2%d0%b0%d1%82%d1%8c/"],
]) {
  const p = await (await br.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(`http://localhost:8080${url}`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(3000);
  const out = await p.evaluate(() => {
    const s = document.querySelector(".ff-el-progress-status");
    const pct = document.querySelector(".ff-el-progress-bar span");
    return { status: s?.textContent?.trim(), pct: pct?.textContent?.trim() };
  });
  console.log(lang, JSON.stringify(out));
  await p.context().close();
}
await br.close();
