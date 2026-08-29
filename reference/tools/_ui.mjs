/**
 * Functional checks for the interactions that are not carousels:
 * the hover caption, `reservar`'s explainer tabs, and `servicios`' vehicle
 * selector.
 */
import { chromium } from "playwright-core";
const [origin] = process.argv.slice(2);
const br = await chromium.launch({ channel: "chrome" });
const ctx = await br.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
let fail = 0;
const check = (name, ok, extra = "") => {
  if (!ok) fail++;
  console.log(`  ${ok ? "OK  " : "FAIL"} ${name}${extra ? "  " + extra : ""}`);
};

// --- hover caption on the destination galleries -------------------------
await p.goto(`${origin}/es/destinos`, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(1800);
const cap = p.locator(".es-carousel-caption").first();
const capText = p.locator(".es-carousel-caption-text").first();
check("caption hidden at rest", (await cap.evaluate((e) => getComputedStyle(e).opacity)) === "0");
await p.locator(".es-carousel").first().hover();
await p.waitForTimeout(350);
check("caption shows on hover", (await cap.evaluate((e) => getComputedStyle(e).opacity)) === "1");
const first = (await capText.textContent()).trim();
check("caption is the source name", first.length > 5, `"${first}"`);
await p.locator("[data-carousel]").first().locator("[data-next]").click();
await p.waitForTimeout(250);
const second = (await capText.textContent()).trim();
check("caption follows the slide", second !== first, `"${second}"`);

// --- reservar explainer tabs --------------------------------------------
await p.goto(`${origin}/es/reservar`, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(1500);
const group = p.locator('[data-tabs="desktop"]');
const panelText = async (i) => (await group.locator(`[data-panel="${i}"]`).textContent()).trim();
const panelShown = (i) => group.locator(`[data-panel="${i}"]`).isVisible();
check("tab 1 open on load", (await panelShown(0)) && !(await panelShown(1)));
for (const [i, needle] of [[1, "Seleccione el día"], [2, "nombre y apellido"], [3, "mensaje de agradecimiento"]]) {
  await group.locator(`[data-tab="${i}"]`).click();
  await p.waitForTimeout(150);
  const ok = (await panelShown(i)) && !(await panelShown(0)) && (await panelText(i)).includes(needle);
  check(`tab ${i + 1} opens with its own copy`, ok);
}
await group.locator('[data-tab="0"]').click();
await p.waitForTimeout(150);
check("returns to tab 1", await panelShown(0));
await group.locator('[data-tab="0"]').focus();
await p.keyboard.press("ArrowRight");
await p.waitForTimeout(150);
check("arrow keys move tabs", await panelShown(1));

// --- servicios vehicle selector -----------------------------------------
await p.goto(`${origin}/es/servicios`, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(1500);
const vis = (sel) => p.evaluate((s) => {
  const el = document.querySelector(s);
  return !!el && el.offsetParent !== null;
}, sel);
check("Estándar on load", (await vis("#data-estandar")) && (await vis("#estandar")) && !(await vis("#data-vans")));
const title = () => p.textContent("#data-estandar h3, #data-vans h3, #data-clasico h3");
for (const [id, label] of [["vans", "Van"], ["clasico", "Clásico"], ["estandar", "Estándar"]]) {
  await p.click(`[data-vehicle="${id}"]`);
  await p.waitForTimeout(200);
  const shownPanel = (await vis(`#data-${id}`)) && (await vis(`#${id}`));
  const heading = (await p.textContent(`#data-${id} h3`)).trim();
  const pressed = (await p.getAttribute(`[data-vehicle="${id}"]`, "aria-pressed")) === "true";
  const others = (await Promise.all(
    ["estandar", "vans", "clasico"].filter((o) => o !== id).map((o) => vis(`#data-${o}`))
  )).every((v) => !v);
  check(`${label}: panel + image swap`, shownPanel && others && pressed, `heading "${heading}"`);
}

await br.close();
console.log(fail ? `\n${fail} FAILED` : "\nall checks passed");
process.exit(fail ? 1 : 0);
