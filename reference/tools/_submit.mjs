/**
 * End-to-end for the booking submit: fills the three steps against the real
 * built page, then checks both outcomes. The failure path runs against the real
 * handler; the success path is stubbed at the network, because succeeding for
 * real would write a row into the team's production Notion database.
 */
import { chromium } from "playwright-core";
const [origin, pagePath, confirmPath] = process.argv.slice(2);
const br = await chromium.launch({ channel: "chrome" });
let fail = 0;
const check = (name, ok, extra = "") => {
  if (!ok) fail++;
  console.log(`  ${ok ? "OK  " : "FAIL"} ${name}${extra ? "  " + extra : ""}`);
};

const fillForm = async (p) => {
  const step = () => p.evaluate(() =>
    [...document.querySelectorAll("[data-step]")].findIndex((s) => !s.classList.contains("hidden")) + 1);
  const VAN = await p.getAttribute("#ff_reserva", "data-van");
  await p.selectOption("#ff_taxi", VAN);
  await p.click("#ff_fecha");
  await p.fill("#ff_fecha", await p.evaluate(() => {
    const d = new Date(); d.setDate(d.getDate() + 7); return d.toLocaleDateString("en-CA");
  }));
  await p.click("#ff_hora");
  await p.fill("#ff_hora", "09:30");
  await p.click("[data-next]"); await p.waitForTimeout(150);
  await p.fill("#ff_nombre", "Ada");
  await p.fill("#ff_apellido", "Lovelace");
  await p.selectOption("#ff_pais", { label: "Cuba" });
  await p.fill("#ff_correo", "ada@example.com");
  await p.fill("#ff_telefono", "53788250");
  await p.click("[data-next]"); await p.waitForTimeout(150);
  await p.selectOption("#ff_pax_van", { index: 1 });
  const AIRPORT = await p.getAttribute("#ff_reserva", "data-airport-option");
  await p.selectOption("#ff_recogida", AIRPORT);
  await p.fill("#ff_vuelo", "CU456");
  await p.selectOption("#ff_aeropuerto", { index: 1 });
  await p.check("#ff_condiciones");
  return (await step()) === 3;
};

// --- the request that actually goes out ------------------------------------
{
  const ctx = await br.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  let sent = null;
  await p.route("**/api/booking", async (route) => {
    sent = JSON.parse(route.request().postData());
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, reference: 116, emailed: true }),
    });
  });
  await p.goto(`${origin}${pagePath}`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(400);
  check("reaches step 3", await fillForm(p));
  await p.click("[data-submit]");
  await p.waitForTimeout(400);

  check("posts every field the pipeline needs", Boolean(sent) &&
    ["lang","taxi","fecha","hora","nombre","apellido","pais","correo","prefijo","telefono","pasajeros","recogida"]
      .every((k) => String(sent[k] ?? "").trim()), JSON.stringify(sent));
  check("phone is split, code in its own field", sent?.prefijo === "+53" && sent?.telefono === "53788250",
    `${sent?.prefijo} / ${sent?.telefono}`);
  check("time reads back 24-hour", /^\d{2}:\d{2}$/.test(sent?.hora ?? ""), sent?.hora);
  check("airport branch carries the flight", sent?.vuelo === "CU456" && Boolean(sent?.aeropuerto));

  const landed = new URL(p.url());
  check("lands on the confirmation screen", landed.searchParams.get("ref") === "116", landed.pathname + landed.search);
  check("shows the reference", (await p.textContent("#bc_ref")).trim() === "#116", await p.textContent("#bc_ref"));
  check("says the booking will be reviewed", (await p.textContent("#bc_ref_box")).length > 0 &&
    !(await p.isHidden("#bc_ref_box")));

  // The reference lives in the URL, so the screen must survive a reload.
  await p.reload({ waitUntil: "domcontentloaded" });
  await p.waitForTimeout(300);
  check("survives a refresh", (await p.textContent("#bc_ref")).trim() === "#116");

  // Back must not return to a form whose booking is already filed.
  await p.goBack({ waitUntil: "domcontentloaded" }).catch(() => {});
  await p.waitForTimeout(300);
  // `location.replace` leaves no history entry, so Back lands anywhere except
  // the form — often `about:blank` in a fresh context. Either way it must not be
  // the booking page: that booking is already filed.
  check("back does not return to the filled form",
    new URL(p.url(), origin).pathname !== pagePath, p.url());

  // A hand-typed or absent reference must not render a fake confirmation.
  await p.goto(`${origin}${confirmPath}`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(250);
  check("no reference shows nothing to confirm", await p.isHidden("#bc_ref_box") && !(await p.isHidden("#bc_missing")));
  await p.goto(`${origin}${confirmPath}?ref=<img src=x>`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(250);
  check("refuses a non-numeric reference", await p.isHidden("#bc_ref_box"));
  await ctx.close();
}

// --- the real handler refusing ---------------------------------------------
{
  const ctx = await br.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${origin}${pagePath}`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(400);
  await fillForm(p);
  await p.click("[data-submit]");
  await p.waitForTimeout(1500);
  const msg = (await p.textContent("#ff_error")).trim();
  check("failure is reported, not swallowed", msg.length > 0 && !msg.includes("116"), msg);
  check("submit comes back so a retry costs no retyping",
    !(await p.isDisabled("[data-submit]")) && (await p.inputValue("#ff_nombre")) === "Ada");
  await ctx.close();
}

await br.close();
console.log(fail ? `\n${fail} FAILED` : "\nall checks passed");
process.exit(fail ? 1 : 0);
