/**
 * Search metadata across the whole build. Reads `dist/`, so run it after a
 * build; it needs no server.
 *
 *   npm run build && node reference/tools/_seo.mjs
 *
 * Every page shipped the same seven-word description before `src/i18n/seo.ts`
 * existed, and none carried a canonical, an `hreflang` or a favicon. This is the
 * check that says so out loud.
 */
import { readFileSync } from "node:fs";
import { globSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(import.meta.url), "../../..");
const DIST = process.argv[2] ?? `${ROOT}/dist`;

let fail = 0;
const check = (name, ok, extra = "") => {
  if (!ok) fail++;
  console.log(`  ${ok ? "OK  " : "FAIL"} ${name}${extra ? "  " + extra : ""}`);
};

const files = globSync("**/index.html", { cwd: DIST }).sort();
const pages = files.map((rel) => {
  const html = readFileSync(`${DIST}/${rel}`, "utf8");
  const head = html.slice(0, html.indexOf("</head>"));
  const attr = (re) => head.match(re)?.[1]?.trim() ?? "";
  return {
    route: "/" + rel.replace(/index\.html$/, "").replace(/\/$/, ""),
    title: attr(/<title[^>]*>([\s\S]*?)<\/title>/),
    description: attr(/<meta name="description" content="([\s\S]*?)"/),
    canonical: attr(/<link rel="canonical" href="([^"]*)"/),
    hreflangs: [...head.matchAll(/hreflang="([^"]*)"/g)].map((m) => m[1]),
    ogTitle: attr(/<meta property="og:title" content="([\s\S]*?)"/),
    ogImage: attr(/<meta property="og:image" content="([^"]*)"/),
    icon: /rel="icon"/.test(head),
    noindex: /name="robots"[^>]*noindex/.test(head),
    html,
  };
});

check("every page was read", pages.length >= 30, `${pages.length} pages`);

const missing = (key, label = key) => {
  const bad = pages.filter((p) => !p[key]);
  check(`every page has a ${label}`, bad.length === 0, bad.map((p) => p.route).join(", "));
};
missing("title");
missing("description");
missing("canonical");
missing("ogTitle", "og:title");
missing("ogImage", "og:image");
missing("icon", "favicon link");

// A description repeated across pages is a description Google discards.
const byDescription = new Map();
for (const p of pages) byDescription.set(p.description, [...(byDescription.get(p.description) ?? []), p.route]);
const dupes = [...byDescription.values()].filter((v) => v.length > 1);
check("no two pages share a description", dupes.length === 0, dupes.map((d) => d.join(" = ")).join(" | "));

const long = pages.filter((p) => p.description.length > 160);
check("no description is truncated in results", long.length === 0,
  long.map((p) => `${p.route} ${p.description.length}`).join(", "));

const short = pages.filter((p) => p.description.length < 50);
check("no description is too thin to be useful", short.length === 0,
  short.map((p) => `${p.route} ${p.description.length}`).join(", "));

// Canonical must be absolute and must be this page, not another.
const badCanon = pages.filter((p) => !/^https:\/\/[^/]+/.test(p.canonical));
check("every canonical is absolute", badCanon.length === 0, badCanon.map((p) => p.route).join(", "));
const selfCanon = pages.filter((p) => new URL(p.canonical).pathname.replace(/\/$/, "") !== p.route.replace(/\/$/, ""));
check("every canonical points at its own page", selfCanon.length === 0,
  selfCanon.map((p) => `${p.route} -> ${p.canonical}`).join(", "));

// Three editions: a page with counterparts must declare them, plus x-default.
const noAlt = pages.filter((p) => p.hreflangs.length < 3);
check("every page declares its other-language versions", noAlt.length === 0,
  noAlt.map((p) => `${p.route} (${p.hreflangs.length})`).join(", "));
const noDefault = pages.filter((p) => !p.hreflangs.includes("x-default"));
check("every page declares an x-default", noDefault.length === 0, noDefault.map((p) => p.route).join(", "));

// The confirmation screens say nothing without their `?ref`.
const confirmations = pages.filter((p) => /confirm|podtverzhdeno/.test(p.route));
check("the confirmation screens are kept out of the index",
  confirmations.length === 3 && confirmations.every((p) => p.noindex),
  confirmations.map((p) => `${p.route}:${p.noindex}`).join(" "));
check("no other page is accidentally noindexed",
  pages.filter((p) => p.noindex && !/confirm|podtverzhdeno/.test(p.route)).length === 0);

// Latin capitals wearing Cyrillic clothes: invisible to a reader, a different
// word to a search engine.
const LOOKALIKE = /[\wЀ-ӿ-]*[Ѐ-ӿ][\wЀ-ӿ-]*/g;
const homoglyphs = [];
for (const p of pages) {
  for (const w of p.html.match(LOOKALIKE) ?? []) {
    if (/[ABCEHKMOPTXY]/.test(w) && /[Ѐ-ӿ]/.test(w)) homoglyphs.push(`${p.route}: ${w}`);
  }
}
check("no Cyrillic word carries a Latin lookalike", homoglyphs.length === 0,
  [...new Set(homoglyphs)].slice(0, 6).join(" | "));

console.log(fail ? `\n${fail} check(s) failed` : "\nall checks passed");
process.exit(fail ? 1 : 0);
