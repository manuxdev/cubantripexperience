/** Functional check for the language switcher. */
import { chromium } from "playwright-core";
const [origin] = process.argv.slice(2);
const br = await chromium.launch({ channel: "chrome" });
const p = await (await br.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
let fail = 0;
const check = (n, ok, extra = "") => { if (!ok) fail++; console.log(`  ${ok ? "OK  " : "FAIL"} ${n}${extra ? "  " + extra : ""}`); };

for (const [page, expect] of [
  ["/es/destinos/la-habana", { en: "/destinations/havana", ru: "/ru/napravleniya/gavana" }],
  ["/destinations/havana", { es: "/es/destinos/la-habana", ru: "/ru/napravleniya/gavana" }],
  ["/ru/napravleniya/gavana", { es: "/es/destinos/la-habana", en: "/destinations/havana" }],
  // Russian has no Pinar del Río: that entry must fall back to the Russian home.
  ["/destinations/pinar-del-rio", { es: "/es/destinos/pinar-del-rio", ru: "/ru/" }],
]) {
  await p.goto(`${origin}${page}`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(900);
  const closed = await p.locator(".es-lang-list").isHidden();
  await p.click(".es-lang > .es-lang-pill");
  await p.waitForTimeout(150);
  const open = await p.locator(".es-lang-list").isVisible();
  const hrefs = Object.fromEntries(
    await p.$$eval(".es-lang-list a", (as) => as.map((a) => [a.getAttribute("hreflang"), a.getAttribute("href")]))
  );
  const ok = closed && open && Object.entries(expect).every(([k, v]) => hrefs[k] === v);
  check(page, ok, JSON.stringify(hrefs));
}

// The target must actually resolve, and land in the right edition.
await p.goto(`${origin}/es/destinos/la-habana`, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(800);
await p.click(".es-lang > .es-lang-pill");
await p.click('.es-lang-list a[hreflang="en"]');
await p.waitForLoadState("domcontentloaded");
const lang = await p.evaluate(() => document.documentElement.lang);
check("clicking through switches edition", new URL(p.url()).pathname === "/destinations/havana" && lang === "en", `${new URL(p.url()).pathname} lang=${lang}`);

// Every flag must paint from its OWN gradients. The source ships all three with
// the ids `a`/`b`/`c`, so inlined together `url(#a)` resolved against whichever
// flag came first and the open panel showed the wrong colours.
await p.click(".es-lang > .es-lang-pill");
await p.waitForTimeout(120);
const flags = await p.evaluate(() =>
  [...document.querySelectorAll(".es-lang-flag svg")].map((svg) => {
    const own = new Set([...svg.querySelectorAll("[id]")].map((n) => n.id));
    const refs = [...svg.querySelectorAll("[fill^='url(#']")].map((n) =>
      n.getAttribute("fill").slice(5, -1)
    );
    return { own: [...own], refs, resolved: refs.every((r) => own.has(r)) };
  })
);
check("flags render, panel open", flags.length >= 3, `${flags.length} svg`);
check(
  "every gradient resolves inside its own flag",
  flags.every((f) => f.refs.length > 0 && f.resolved),
  JSON.stringify(flags.map((f) => f.own))
);
check(
  "no gradient id is shared between flags",
  new Set(flags.flatMap((f) => f.own)).size === flags.reduce((n, f) => n + f.own.length, 0)
);

// Escape closes it
await p.keyboard.press("Escape");
await p.waitForTimeout(120);
check("Escape closes", await p.locator(".es-lang-list").isHidden());

await br.close();
console.log(fail ? `\n${fail} FAILED` : "\nall checks passed");
process.exit(fail ? 1 : 0);
