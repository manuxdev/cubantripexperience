/**
 * Functional check for the recovered Elementor animations. Runs WITHOUT
 * `shot.mjs`'s neutraliser, so it sees what a visitor sees.
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

await p.goto(`${origin}/es/destinos`, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(1500);

// Record every animation that actually runs. The play class is stripped on
// `animationend` (it would otherwise keep the block on its own compositing
// layer), so asserting on the class is a race — assert on the event.
await p.addInitScript(() => {
  window.__anims = [];
  addEventListener(
    "animationstart",
    (e) => window.__anims.push(e.animationName),
    true
  );
});
await p.reload({ waitUntil: "domcontentloaded" });
await p.waitForTimeout(1500);
const played0 = await p.evaluate(() => window.__anims ?? []);
check("nav plays fadeInUp", played0.includes("esFadeInUp"), played0.join(","));

// A block far down the page must still be idle before we scroll to it, then play.
const last = p.locator("[data-anim]").last();
const idleBefore = await last.evaluate((e) => e.classList.contains("es-anim-idle"));
check("off-screen block waits", idleBefore);
await last.scrollIntoViewIfNeeded();
await p.waitForTimeout(1600);
const names = await p.evaluate(() => window.__anims ?? []);
const dir = await last.getAttribute("data-anim");
const expected = dir === "fadeInLeft" ? "esFadeInLeft" : "esFadeInRight";
check(
  "plays when scrolled into view",
  names.includes(expected) && !(await last.evaluate((e) => e.classList.contains("es-anim-idle"))),
  `${dir} → ${names.join(",")}`
);
const finalOpacity = await last.evaluate((e) => getComputedStyle(e).opacity);
check("ends fully visible", finalOpacity === "1", `opacity ${finalOpacity}`);

// The animation must never widen the page while it slides in.
const overflow = await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
check("no horizontal overflow", overflow);

// Hover: pulse on the footer icons
const icon = p.locator(".es-hover-pulse").first();
await icon.scrollIntoViewIfNeeded();
const restAnim = await icon.evaluate((e) => getComputedStyle(e).animationName);
await icon.hover();
await p.waitForTimeout(200);
const hoverAnim = await icon.evaluate((e) => getComputedStyle(e).animationName);
check("social icons pulse on hover", restAnim === "none" && hoverAnim === "esPulse", `${restAnim} → ${hoverAnim}`);

// The nav underline slides in
// Pick an item that is NOT the current page, whose underline is drawn already.
const item = p.locator(".es-nav-item:not(.es-nav-item-active)").first();
const rest = await item.evaluate((e) => {
  const c = getComputedStyle(e, "::after");
  return { w: c.width, o: c.opacity };
});
check("nav underline invisible at rest", rest.o === "0", `opacity ${rest.o}, width ${rest.w}`);
await item.hover();
await p.waitForTimeout(500);
const hov = await item.evaluate((e) => {
  const c = getComputedStyle(e, "::after");
  return { w: c.width, o: c.opacity };
});
check("nav underline slides in on hover", parseFloat(hov.w) > parseFloat(rest.w) && hov.o === "1", `${rest.w}/${rest.o} → ${hov.w}/${hov.o}`);

// inicio: ken burns and the float hover
await p.goto(`${origin}/es/`, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(1500);
const kb = p.locator(".elementor-ken-burns").first();
check("ken burns active on slide 1", await kb.evaluate((e) => e.classList.contains("elementor-ken-burns--active")));
// Must be part-way through a 20s ease, not snapped to the end.
const read = () => kb.evaluate((e) => Number(getComputedStyle(e).transform.match(/matrix\(([\d.]+)/)?.[1] ?? 1));
await p.waitForTimeout(2000);
const s1 = await read();
await p.waitForTimeout(2000);
const s2 = await read();
check("ken burns eases, not jumps", s1 > 1 && s1 < 1.3 && s2 > s1, `scale ${s1.toFixed(3)} → ${s2.toFixed(3)}`);
await p.locator("[data-next]").first().click();
await p.waitForTimeout(300);
check("ken burns follows the slide", !(await kb.evaluate((e) => e.classList.contains("elementor-ken-burns--active"))));

const float = p.locator(".es-hover-float").first();
await float.scrollIntoViewIfNeeded();
const restT = await float.evaluate((e) => getComputedStyle(e).transform);
await float.hover();
await p.waitForTimeout(400);
const hoverT = await float.evaluate((e) => getComputedStyle(e).transform);
check("Trustpilot badge floats", restT !== hoverT, `${restT} → ${hoverT}`);

// Reduced motion must disable all of it
const rctx = await br.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const rp = await rctx.newPage();
await rp.goto(`${origin}/es/destinos`, { waitUntil: "domcontentloaded" });
await rp.waitForTimeout(1200);
const anyIdle = await rp.evaluate(() =>
  [...document.querySelectorAll("[data-anim]")].some((e) => getComputedStyle(e).opacity !== "1")
);
check("reduced motion keeps everything visible", !anyIdle);
await rctx.close();

// The floating nav sits at the bottom of a 900px hero. On any viewport shorter
// than that its box starts below the fold, and before `data-anim-now` the scroll
// sweep held it at opacity 0 until the visitor nudged the page.
{
  const short = await br.newContext({ viewport: { width: 1440, height: 700 } });
  const sp = await short.newPage();
  await sp.goto(`${origin}/es/`, { waitUntil: "domcontentloaded" });
  await sp.waitForTimeout(1500);
  const nav = await sp.evaluate(() => {
    const el = document.querySelector('nav [data-anim="fadeInUp"]');
    return {
      idle: el.classList.contains("es-anim-idle"),
      opacity: getComputedStyle(el).opacity,
      played: el.dataset.animNow !== undefined,
    };
  });
  check(
    "nav enters on load, not on scroll",
    !nav.idle && nav.opacity === "1" && nav.played,
    JSON.stringify(nav)
  );
  await short.close();
}

await br.close();
console.log(fail ? `\n${fail} FAILED` : "\nall checks passed");
process.exit(fail ? 1 : 0);
