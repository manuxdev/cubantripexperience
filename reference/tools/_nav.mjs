/** Functional check for the mobile nav: open the burger, follow every link. */
import { chromium } from "playwright-core";
const [origin] = process.argv.slice(2);
const br = await chromium.launch({ channel: "chrome" });
const ctx = await br.newContext({ viewport: { width: 390, height: 844 } });
const p = await ctx.newPage();
await p.goto(`${origin}/es/`, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(1200);

const open = () => p.evaluate(() => document.getElementById("es-nav-dropdown")?.dataset.open);
console.log("closed on load:", (await open()) === "false" ? "OK" : "FAIL");
await p.click("#es-nav-toggle");
await p.waitForTimeout(200);
console.log("opens on tap:  ", (await open()) === "true" ? "OK" : "FAIL");

const links = await p.$$eval("#es-nav-dropdown a", (as) =>
  as.map((a) => ({ text: a.textContent.trim(), href: a.getAttribute("href") }))
);
let fail = 0;
for (const l of links) {
  const res = await p.goto(`${origin}${l.href}`, { waitUntil: "domcontentloaded" });
  const ok = res && res.status() === 200;
  if (!ok) fail++;
  console.log(`  ${l.text.padEnd(12)} ${l.href.padEnd(16)} ${res?.status()} ${ok ? "OK" : "FAIL"}`);
}
// Desktop: every nav control must be reachable, not covered by the header overlay
const dctx = await br.newContext({ viewport: { width: 1440, height: 900 } });
const dp = await dctx.newPage();
await dp.goto(`${origin}/es/`, { waitUntil: "domcontentloaded" });
await dp.waitForTimeout(1200);
for (const label of ["Destinos", "Servicios", "Contactos", "Reservar"]) {
  const link = dp.locator("nav[aria-label='Principal'] a", { hasText: label }).first();
  try {
    await link.click({ timeout: 4000 });
    await dp.waitForLoadState("domcontentloaded");
    const ok = new URL(dp.url()).pathname !== "/es/";
    if (!ok) fail++;
    console.log(`  desktop ${label.padEnd(10)} → ${new URL(dp.url()).pathname} ${ok ? "OK" : "FAIL"}`);
  } catch {
    fail++;
    console.log(`  desktop ${label.padEnd(10)} → NOT CLICKABLE FAIL`);
  }
  await dp.goto(`${origin}/es/`, { waitUntil: "domcontentloaded" });
  await dp.waitForTimeout(600);
}
await dctx.close();

// Escape closes it again
await p.goto(`${origin}/es/`, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(800);
await p.click("#es-nav-toggle");
await p.keyboard.press("Escape");
await p.waitForTimeout(150);
console.log("Escape closes: ", (await open()) === "false" ? "OK" : "FAIL");
await br.close();
process.exit(fail ? 1 : 0);
