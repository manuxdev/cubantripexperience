/**
 * The "how it works" tabs on the booking page: does clicking one actually show
 * its panel, on desktop and in the mobile accordion?
 *
 *   node reference/tools/_tabs.mjs http://localhost:3000 /es/reservar
 */
import { chromium } from "playwright-core";

const [origin, path = "/es/reservar"] = process.argv.slice(2);
const br = await chromium.launch({ channel: "chrome" });
let fail = 0;
const check = (name, ok, extra = "") => {
  if (!ok) fail++;
  console.log(`  ${ok ? "OK  " : "FAIL"} ${name}${extra ? "  " + extra : ""}`);
};

const state = (p, group) =>
  p.evaluate((sel) => {
    const g = document.querySelector(sel);
    if (!g) return null;
    const vis = (el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    return {
      tabs: [...g.querySelectorAll("[data-tab]")].map((b) => ({
        title: b.textContent.trim().slice(0, 30),
        selected: b.getAttribute("aria-selected"),
      })),
      shown: [...g.querySelectorAll("[data-panel]")]
        .map((el, i) => (vis(el) ? i : -1))
        .filter((i) => i >= 0),
      text: [...g.querySelectorAll("[data-panel]")]
        .filter(vis)
        .map((el) => el.textContent.trim().slice(0, 40)),
    };
  }, group);

for (const [label, group, width] of [
  ["desktop", '[data-tabs="desktop"]', 1440],
  ["mobile", '[data-tabs="mobile"]', 390],
]) {
  console.log(`\n${label}`);
  const p = await (await br.newContext({ viewport: { width, height: 900 } })).newPage();
  await p.goto(`${origin}${path}`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(600);

  const first = await state(p, group);
  if (!first) { check(`${label} tab group exists`, false); continue; }
  check("renders every tab", first.tabs.length >= 2, `${first.tabs.length} tabs`);
  check("exactly one panel open on load", first.shown.length === 1, `open: [${first.shown}]`);
  check("the first tab is the open one", first.shown[0] === 0);

  // Click each tab in turn; each must open its own panel and close the others.
  for (let i = 1; i < first.tabs.length; i++) {
    await p.click(`${group} [data-tab="${i}"]`);
    await p.waitForTimeout(250);
    const s = await state(p, group);
    check(`tab ${i} "${first.tabs[i].title}" opens its panel`,
      s.shown.length === 1 && s.shown[0] === i, `open: [${s.shown}]`);
    check(`tab ${i} panel has copy`, (s.text[0] ?? "").length > 0, s.text[0]);
    check(`tab ${i} is marked selected`, s.tabs[i].selected === "true");
  }
}

await br.close();
console.log(fail ? `\n${fail} check(s) failed` : "\nall checks passed");
process.exit(fail ? 1 : 0);
