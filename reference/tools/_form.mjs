/** End-to-end functional check for the /es/reservar booking form. */
import { chromium } from "playwright-core";
const [origin] = process.argv.slice(2);
const br = await chromium.launch({ channel: "chrome" });
const p = await (await br.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const PAGE = process.argv[3] ?? "/es/reservar";
await p.goto(`${origin}${PAGE}`, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(1500);

let fail = 0;
const check = (name, ok, extra = "") => {
  if (!ok) fail++;
  console.log(`  ${ok ? "OK  " : "FAIL"} ${name}${extra ? "  " + extra : ""}`);
};
const step = () => p.evaluate(() =>
  [...document.querySelectorAll("[data-step]")].findIndex((s) => !s.classList.contains("hidden")) + 1
);
const shown = (sel) => p.evaluate((s) => {
  const el = document.querySelector(s);
  return !!el && el.offsetParent !== null;
}, sel);
const pct = () => p.textContent("#ff_progress_pct");
const errorText = () => p.textContent("#ff_error");

check("starts on step 1", (await step()) === 1, `progress ${await pct()}`);

// Empty step must not advance
await p.click("[data-next]");
check("blocks empty step 1", (await step()) === 1 && !(await p.isHidden("#ff_error")));

// 12h checkbox swaps the two Hora fields
check("24h Hora visible", await shown("#ff_hora"));
check("12h Hora hidden", !(await shown("#ff_hora12")));
await p.check("#ff_formato12h");
await p.waitForTimeout(150);
check("checkbox swaps Hora", !(await shown("#ff_hora")) && (await shown("#ff_hora12")));
await p.uncheck("#ff_formato12h");
await p.waitForTimeout(150);

// Native picker only appears once the field is used
check("Fecha is text at rest", (await p.getAttribute("#ff_fecha", "type")) === "text");
await p.click("#ff_fecha");
await p.waitForTimeout(150);
check("Fecha becomes a date picker", (await p.getAttribute("#ff_fecha", "type")) === "date");

const VAN = await p.getAttribute("#ff_reserva", "data-van");
await p.selectOption("#ff_taxi", VAN);
await p.click("#ff_hora");
await p.fill("#ff_hora", "09:30");

// Yesterday must not get through: `min` stops the native picker, the rule stops
// anything typed or pasted past it.
const today = await p.evaluate(() => new Date().toLocaleDateString("en-CA"));
const yesterday = await p.evaluate(() => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA");
});
check("date field floors at today", (await p.getAttribute("#ff_fecha", "min")) === today);
// Assigned rather than typed: Chrome refuses to accept a keystroke below `min`
// and simply leaves the field empty, which would exercise the "incomplete" path
// instead of the date rule. Setting `.value` gets past the picker the way a
// paste or a restored autofill would.
await p.evaluate((v) => {
  const el = document.getElementById("ff_fecha");
  el.value = v;
  el.dispatchEvent(new Event("input", { bubbles: true }));
}, yesterday);
await p.click("[data-next]");
await p.waitForTimeout(150);
check(
  "past date holds step 1",
  (await step()) === 1 && /hoy|today|сегодняшн/i.test(await errorText()),
  await errorText()
);

await p.fill("#ff_fecha", today);
await p.click("[data-next]");
await p.waitForTimeout(200);

check("advances to step 2", (await step()) === 2, `progress ${await pct()}`);
check("Anterior appears", !(await p.isHidden("[data-back]")));

const countries = await p.$$eval("#ff_pais option", (o) => o.length);
check("country list populated", countries > 190, `${countries} options`);

await p.click("[data-next]");
check("blocks empty step 2", (await step()) === 2);
await p.fill("#ff_nombre", "Manuel");
await p.fill("#ff_apellido", "Pantoja");
await p.selectOption("#ff_pais", { index: 5 });
await p.fill("#ff_correo", "manu@example.com");

// The dialling code is its own closed list now; the text field holds the
// national number alone.
const dialCount = await p.$$eval("#ff_prefijo option", (o) => o.length);
check("dial code list populated", dialCount > 190, `${dialCount} options`);
await p.selectOption("#ff_pais", { label: "Cuba" });
await p.waitForTimeout(50);
check(
  "country drives the dial code",
  (await p.inputValue("#ff_prefijo")) === "+53",
  await p.inputValue("#ff_prefijo")
);

// A pasted international number splits itself rather than being rejected.
await p.fill("#ff_telefono", "+53 5 378 8250");
await p.waitForTimeout(50);
check(
  "pasted +code moves to the select",
  (await p.inputValue("#ff_prefijo")) === "+53" &&
    (await p.inputValue("#ff_telefono")) === "53788250",
  `${await p.inputValue("#ff_prefijo")} / ${await p.inputValue("#ff_telefono")}`
);

// Malformed values must hold the step.
await p.fill("#ff_correo", "manu@");
await p.click("[data-next]");
await p.waitForTimeout(150);
check("bad email holds step 2", (await step()) === 2, await errorText());
await p.fill("#ff_correo", "manu@example.com");
await p.fill("#ff_telefono", "12ab");
await p.click("[data-next]");
await p.waitForTimeout(150);
check("bad phone holds step 2", (await step()) === 2, await errorText());
await p.fill("#ff_telefono", "53788250");
await p.click("[data-next]");
await p.waitForTimeout(200);
check("advances to step 3", (await step()) === 3, `progress ${await pct()}`);
check("Enviar replaces Siguiente", !(await p.isHidden("[data-submit]")) && (await p.isHidden("[data-next]")));

// Van chosen on step 1 must drive the passenger select on step 3
check("Van → 4-9 passengers", (await shown("#ff_pax_van")) && !(await shown("#ff_pax")));

const AIRPORT = await p.getAttribute("#ff_reserva", "data-airport-option");
const OTHER = await p.getAttribute("#ff_reserva", "data-other-option");
await p.selectOption("#ff_recogida", AIRPORT);
await p.waitForTimeout(150);
check("Aeropuerto → vuelo + aeropuerto", (await shown("#ff_vuelo")) && (await shown("#ff_aeropuerto")) && !(await shown("#ff_direccion")));
await p.selectOption("#ff_recogida", OTHER);
await p.waitForTimeout(150);
check("Otro → dirección", (await shown("#ff_direccion")) && !(await shown("#ff_vuelo")));

// Back navigation keeps the earlier answers
await p.click("[data-back]");
await p.waitForTimeout(150);
check("Anterior returns to step 2", (await step()) === 2);
check("step 2 values kept", (await p.inputValue("#ff_nombre")) === "Manuel");

await br.close();
console.log(fail ? `\n${fail} FAILED` : "\nall checks passed");
process.exit(fail ? 1 : 0);
