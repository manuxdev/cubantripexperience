# Design: Pixel-verified visual parity for the Spanish public site

## Technical Approach

Eleven Spanish pages are built as Astro routes under `/es/`, styled with Tailwind
arbitrary values driven directly by each `reference/es/<slug>/spec.md`. A new
`EsLayout` + three shell components carry the parts the specs prove repeat
(hero-with-overlay, floating nav, footer); everything else stays inline in its page.
English keeps `Layout.astro`, `header.astro`, `footer.astro`, and `global.css`
untouched — the only file both languages share is `tailwind.config.cjs`, and its edit
is purely additive. Acceptance per page is `compare.sh` `VERDICT: PASS`; English
non-regression is `baseline.sh` recorded before that one shared edit.

## Architecture Decisions

### Decision: extract only the shell; no `src/components/spanish/`

| Option | Tradeoff | Decision |
|---|---|---|
| Keep/extend `src/components/spanish/` | Existing components encode paraphrased copy and a hand-rolled CSS system; both violate the literal-copy and token requirements | Rejected — deleted |
| Component per Elementor section type | Eleven pages, ~120 sections, most appearing once | Rejected as premature |
| Shell components + inline page markup | Matches proven repetition only | **Chosen** |

Proven repetition, verified across `contactos`, `la-habana`, `trinidad`, `destinos`,
`inicio` specs:

| Component | Evidence | Props |
|---|---|---|
| `src/components/es/EsHero.astro` | Section 1 `_style_` string is identical on 10 pages (same `cover-image-about-cuba-for-a-trav-01.webp`, `#503607` overlay, `custom_height=328px`); `inicio` differs only by `height=full` | `title`, `full?` |
| `src/components/es/EsNav.astro` | Section 2 identical on all 11 except `reservar`, which has no Reservar button | `showReserve` |
| `src/components/es/EsFooter.astro` | Last section identical on all 11 except `_element_custom_width_tablet` (`223.328px` vs `331px` on `inicio`) | `menuTabletWidth` |
| `src/components/es/EsCarousel.astro` | 3 distinct call sites: `destinos` `media-carousel` ×12, `inicio` `slides`, `inicio` `reviews` | `slideCount`, `<slot>` |

`EsLayout.astro` composes hero+nav+footer, sets `<html lang="es">`, imports Poppins
and a new `src/styles/es.css` reset. It does **not** reuse `Layout.astro`, which hard-
imports Inter, `global.css`, and the English header/footer.

### Decision: media identity is a digest match; the ledger is the fallback

Filename comparison is meaningless (`el-capitolio-havana-cuba.webp` shipped as
`src/assets/pages/havana/the-capitol.webp`). **Measured**: the English migration copied
without re-encoding, so **37 of the 52** `_media` files are byte-identical to an
`src/assets` file. Digest matching is the primary method and resolves 71% in one pass.

1. **Group by digest.** macOS `uniq` has no `-w`, so group in `awk`:

   ```sh
   shasum -a 256 reference/es/_media/*.webp $(find src/assets public/es -name '*.webp') \
     | awk '{ h=$1; $1=""; sub(/^ +/,""); f[h] = f[h] "\n  " $0 }
            END { for (h in f) if (gsub(/\n/, "\n", f[h]) > 1) print h f[h] }'
   ```

   Every printed group is one image under two or more names. Zero false positives.
   **Digest matching is one-to-many:** `one-in-cuba-blonde-brunette-travel.webp` is
   byte-identical to *both* `destinations/trinidad.webp` and
   `trinidad/the-main-square.webp` — the same file serves as destination card and as
   landmark. The data shape must tolerate two `EsLandmark`/card entries resolving to one
   asset; the eager `import.meta.glob` helper already does, since it keys by path.
2. **Fallback, for the 15 with no `src/assets` twin.** Do not re-derive the mapping —
   `openspec/changes/migrate-wordpress-public-site/reference-inventory.md` lines 41–61
   maps every WordPress filename to its destination slot.
   **Gotcha:** the ledger's *planned* names drifted from what shipped (ledger
   `havana/capitol.webp` → on disk `the-capitol.webp`; `services/standard-taxi.webp` →
   `standard.webp`). Use the ledger for the directory and the landmark ordinal, then
   confirm the actual on-disk file.
3. **Confirm:** `sips -g pixelWidth -g pixelHeight <local> <_media>`. Matching intrinsic
   dimensions plus the ledger row is sufficient identity. **If dimensions differ, prefer
   the `_media/` original** — the reference capture was rendered from that exact file and
   a resized twin moves the `pixels` metric.
4. **Copy:** `_media/<original>` → `src/assets/pages/<slug>/<semantic>.webp`,
   English-semantic name, and record the row in the work-unit note.
5. **404 `.jpg` URLs:** resolve through `reference/USAGE.md` §7 before step 1. These
   appear only in `destinos`' `hide_desktop` carousels, so they are tablet/mobile-only.

The 15 needing step 2–4, all present in `_media/` (nothing is unobtainable); seven also
sit in `public/es/`, which is **not** adopted — it is an untracked third copy from the
superseded attempt. Copy from `_media/` into `src/assets/`, never from `public/es/`.

```
164239184143240159135168240159135186-e1689574588144.webp        [—]
2616ce97-6d4e-414c-8bb7-d6d0524314e1.webp                       [public/es]
3-1.webp                                                        [—]   (excluded review badge)
40180-siguenos-cubacomunica226128166-e1689575067787.webp        [—]
Captura_de_pantalla_2023-07-21_143103-removebg-preview.webp     [—]
Diseno-sin-titulo-1024x576.webp                                 [public/es]
Diseno-sin-titulo-768x432.webp                                  [—]
The-Most-Beautiful-Places-…-El-Nicho-Waterfalls-Cienfuegos-Trinidad.webp  [—]
ba-cuba-attractions-lonely-planet.webp                          [public/es]
cover-image-about-cuba-for-a-trav-01.webp                       [public/es]
eacdd918-6480-4c70-91a2-84f1c892dbc5.webp                       [public/es]
foto-de-santiago-de-cuba-cuba.webp                              [public/es]
image-of-latin-quietness-21982232.webp                          [public/es]
replicate-prediction-ybhft4zbay5qwwbbnclzouhvxy-1024x559.webp   [—]
replicate-prediction-ybhft4zbay5qwwbbnclzouhvxy.webp            [—]
```

`cover-image-about-cuba-for-a-trav-01.webp` is the hero background on all eleven pages,
so it is the first copy WU1 makes. (Ten of them share a byte-identical Section 1
`_style_`; `inicio` uses the same image with `height=full` — see the `EsHero` row above.)
`3-1.webp` is the Trustpilot badge, verified by its
`link=https://www.trustpilot.com/review/cubantripexperience.com` at
`reference/es/inicio/spec.md:239` — excluded by non-goal, not copied. Spanish media resolves through the existing `import.meta.glob`
pattern in `src/data/pages/destination-details.ts`.

### Decision: plain `<img>`, not `<Image>`, on Spanish pages

`@astrojs/image` re-encodes through sharp. The reference was rendered from the
untouched WordPress file, so a re-encode shifts `pixels` for no benefit — Elementor
sized images with CSS percentages (`space=66%`), not intrinsic transforms. Spanish uses
`<img src={asset.src} width={asset.width} height={asset.height}>`; hero backgrounds use
`asset.src` in an inline `background-image`. English `<Image>` usage is untouched.

### Decision: carousels are CSS scroll-snap, no dependency

| Option | Tradeoff | Decision |
|---|---|---|
| Swiper / Splide | ~40 KB, matches Elementor's real widget, adds motion the gate cannot measure and load timing it *can* penalize | Rejected |
| CSS `overflow-x-auto snap-x` track + static dots | Zero JS, zero deps, deterministic first frame, exact height | **Chosen** |

Autoplay and Ken Burns (`background_ken_burns=yes`) are deliberately not reproduced:
`shot.mjs` screenshots ~1.5 s after a scroll pass, so an animated slide has no
deterministic frame to match.

**An unstable reference must not be debugged as a code bug.** Two reference pages are at
risk: **`destinos`** (12 `media-carousel` widgets) and **`inicio`** (`slides` with
`background_ken_burns=yes`, plus `reviews`). On those two only, if a `pixels` failure is
localized to a carousel region in `diff-<viewport>.png`, the implementer **first** runs
`./reference/tools/extract.sh <slug>` to regenerate the reference and re-runs
`compare.sh`. Only a failure that survives regeneration is an implementation defect.
Captures are gitignored and regenerable, so this costs one command. This applies to
carousel regions only — a `pixels` failure anywhere else is a defect immediately.

### Decision: 8-digit alpha survives as a literal Tailwind token

Tailwind 3's `withAlphaVariable` calls `parseColor`; when the parsed color already
carries alpha it returns the color **as-is** instead of injecting
`rgb(... / var(--tw-bg-opacity))`. So `colors.es.cta = "#F8F43D85"` emits
`background-color: #F8F43D85` verbatim for `bg-es-cta`.
**Corollary:** never apply an opacity modifier (`bg-es-cta/50`) or `bg-opacity-*` to
these tokens — the alpha is authored, and the modifier is silently dropped.

### Decision: `tailwind.config.cjs` is additive only

```js
// theme.extend — merges with defaults; sm/md/lg keep their values
screens:    { mobile: { max: "767px" }, tablet: { max: "1024px" }, desktop: { min: "1025px" } },
fontFamily: { poppins: ["Poppins", ...defaultTheme.fontFamily.sans] },
colors:     { es: { brand: "#F8F43D", cta: "#F8F43D85", ctaHover: "#F8F43DCC",
                    link: "#CFC725", nav: "#3F3F3FCF", navB: "#5F5F5F",
                    overlay: "#503607", cardBorder: "#5DBBFE91", /* … */ } },
```

`tablet` is max-width (≤1024px, includes mobile) so it mirrors Elementor's cascade:
desktop base → `_tablet` at ≤1024 → `_mobile` at ≤767. Tailwind sorts max-width screens
descending, so `mobile:` correctly wins over `tablet:`. `desktop` exists for exactly one
proven use: `hide_desktop=hidden-desktop` → `desktop:hidden`.

Override mapping:

| `spec.md` | Utility |
|---|---|
| `typography_font_size=47px; …_tablet=45px; …_mobile=24px` | `text-[47px] tablet:text-[45px] mobile:text-[24px]` |
| `margin_mobile=20px 0px 0px 0px` | `mobile:m-[20px_0px_0px_0px]` |
| `hide_desktop=hidden-desktop` | `desktop:hidden` |
| `content_width=1059px` | `mx-auto w-full max-w-[1059px]` |
| `_inline_size=64.081` | `basis-[64.081%] mobile:basis-full` (Elementor stacks columns at mobile only) |
| `background_color=#3F3F3FCF` → `_b=#5F5F5F` `_stop=43%` | `bg-[linear-gradient(#3F3F3FCF_43%,#5F5F5F)]` |

Poppins is self-hosted at `public/fonts/poppins-{400,500,600,700}.woff2` (all four files
already exist under `public/home/` and are relocated). **All four weights are loaded, 700
included** — measured use across the eleven specs is 600 ×89, 500 ×31, 400 ×25, 700 ×2,
the 700 being `reference/es/inicio/spec.md:71` (`¿Por qué somos los mejores?`).
`specs/elementor-design-tokens/spec.md` and `reference/es/README.md` were corrected to
require 400/500/600/700. Omitting 700 renders that heading at a substituted weight and
`pixels` reports it on `inicio`.

### Decision: `src/i18n/` is extended, its paraphrased content layer is not

| Path | Action | Reason |
|---|---|---|
| `src/i18n/config.ts`, `src/i18n/routes.ts` | **Keep** | Generic and already correct: `localePath("es","/contactos")` → `/es/contactos` |
| `src/i18n/routes.es.ts` | **Create** | Spanish nav/footer link sets + `esHref(wpUrl)` rewriting `http://localhost:8080/matanzas-es` → `/es/destinos/matanzas`. Every spec button carries an absolute source URL; one map serves all 11 pages |
| `src/i18n/content/es/{home,servicios,destinos}.ts` | **Delete** | Copy is paraphrased — `home.ts` normalizes `inicio`'s authored `/` separators away, which the literal-copy requirement forbids. Non-goals protect `src/i18n/`, not this superseded copy layer |

Page copy that appears once lives inline in its `.astro` file. Only the destination
array is data, because it feeds a loop.

### Decision: superseded Spanish surface is replaced, deleted alongside its replacement

`src/styles/home.css` is imported **only** by the three `es/` pages; `Layout.astro`
imports only `global.css`. Verified: nothing English reads any of these files.

| Path | Action | Deleted in |
|---|---|---|
| `src/pages/es/{index,servicios,destinos}.astro` | Rewritten | WU6 / WU3 / WU5 |
| `src/components/spanish/Services.astro` (99) | Delete | WU3 |
| `src/components/spanish/Destinations.astro` (149) | Delete | WU5 |
| `src/components/home/SpanishHome.astro` (254) | Delete | WU7 |
| `src/styles/spanish-services.css` (91) | Delete | WU3 |
| `src/styles/spanish-destinations.css` (211) | Delete | WU7 |
| `src/styles/home.css` (252) | Delete | WU7 (last consumer removed in WU6) |
| `public/home/*` (superseded assets) | Delete/relocate | WU7 |

### Decision: two points of this design supersede the proposal's delivery outline

Both are accepted corrections, recorded here as the governing version. Where they differ
from `proposal.md` "Delivery outline — four chained work units", **this design wins**.

| Proposal said | This design says | Why |
|---|---|---|
| WU4 (`inicio`, `destinos`) reuses "the destination cards built in work unit 3" | There are no reusable cards. `destinos` index rows are `media-carousel` + copy + "Ver más"; destination-detail rows are heading + `text-editor` + `widget:image` with per-card column geometry. Structurally unrelated. The genuinely shared piece is **`EsCarousel`**, built in WU5 and reused by `inicio` in WU6 | Verified against `reference/es/destinos/spec.md` Sections 7–17 vs `reference/es/la-habana/spec.md` Section 3 |
| Four chained work units | **Seven** | The superseded Spanish surface is ~1,300 deletable lines. Deletions count toward `additions + deletions`, so removing it in one cleanup slice breaches the 800-line ceiling on deletions alone |

Corollary, and the reason seven works: **a superseded file is deleted in the slice that
replaces it**, not batched into a terminal cleanup. That keeps each slice self-contained
and reviewable (new page and the dead code it obsoletes in one diff), and spreads the
deletion cost across the chain instead of concentrating it. Only files whose last
consumer disappears late — `home.css`, `SpanishHome.astro` — fall to WU7.

## Data Flow

    reference/es/<slug>/spec.md   reference/es/_media/*.webp
              │ (authored contract)          │ digest → ledger → copy
              ▼                              ▼
    src/pages/es/**.astro  ◀── src/data/es/destinations.ts ──▶ src/assets/pages/**
              │  EsLayout(EsHero, EsNav, EsFooter, EsCarousel)
              ▼
    astro dev :3000 ──▶ compare.sh <slug> <path> ──▶ VERDICT + diff-*.png
    astro dev :3000 ──▶ baseline.sh <en-slug> <path> ──▶ non-regression

## Interfaces / Contracts

Destination data shape, derived from `reference/es/la-habana/spec.md` and
`reference/es/trinidad/spec.md` (both are the same 8-section skeleton; only the
per-card geometry and copy differ, so the geometry must be data, not template
constants):

```ts
// src/data/es/destinations.ts
type EsLandmark = {
  title: string;   // literal, colon included: "La Habana Vieja:"
  body: string;    // literal `editor` text
  image: ImageMetadata;
  alt: string;
  textBasis: number;    // column _inline_size: 43.535 | 44.949 | 50
  imageBasis: number;   // 56.465 | 55.051 | 50
  imageSpace: number;   // space=66 → 66  (la-habana 66/71/71/74/74, trinidad 67/71/74/75/75)
  imageSpaceMobile: number; // space_mobile=97 (la-habana 97/95/95/95/94, trinidad 100×4)
  imageMarginLeft?: number; // _margin left: 50 | 40 | 0
  imageCustomWidth?: number;// _element_custom_width=98.566
  imageAlignEnd?: boolean;  // column align=flex-end
};

type EsDestination = {
  slug: "la-habana" | "trinidad" | "cienfuegos" | "matanzas"
      | "santiago-de-cuba" | "pinar-del-rio";
  heroTitle: string;                       // Section 1 heading
  landmarks: EsLandmark[];                 // exactly 5
  prev: { label: string; href: string };   // Section 4 buttons, fa-angle-left
  next: { label: string; href: string };   // fa-angle-right
};
```

Hero image/overlay/height, the `#D6D0D0` CTA strip, and the footer are template
constants — byte-identical across all six specs.

`src/pages/es/destinos/[slug].astro` mirrors the existing English
`src/pages/[destination].astro` (`getStaticPaths` over the array, `previous`/`next`
from index arithmetic). Images resolve through the same eager `import.meta.glob`
helper already in `src/data/pages/destination-details.ts`.

**Form markup source:** `spec.md` carries only the `fluent-form-widget` *styling*; the
field list lives in the Fluent Forms tables, not `_elementor_data`. Field markup for
`contactos` and `reservar` must be read from `reference/es/<slug>/rendered.html`
(regenerate with `./reference/tools/extract.sh <slug>`), then rebuilt as static markup
with labels, input types, and focus order preserved and no `action`/handler.

## Testing Strategy

| Layer | What | Approach |
|---|---|---|
| Build | Route set and imports | `npm run build` — necessary, never sufficient |
| Visual (ES) | Each of the 11 slugs | `./reference/tools/compare.sh <slug> <path>` → `VERDICT: PASS`, exit 0, all three breakpoints |
| Visual (EN) | Non-regression | `./reference/tools/baseline.sh <slug> <path>` before/after the shared edit |

No unit/integration tier: `openspec/config.yaml` declares `test_command: null`, and
these pages are static markup whose only contract is pixel output.

### English non-regression: when baselines are recorded

The ordering trap is real and the script cannot police it. The whole change touches
exactly **one** file English consumes: `tailwind.config.cjs`, edited in WU1. Therefore:

1. **First action of WU1, before any edit**, against the pre-change `main` build:
   `./reference/tools/baseline.sh <slug> <path>` for the six routes below.
2. **Last action of WU1**, after the tailwind edit: re-run the same six. All must be
   within tolerance or the config is made more additive.
3. **WU7 gate**: re-run the same six, proving the cleanup deletions changed nothing.
4. WU2–WU6 touch no shared file; one re-run per gate is cheap insurance against an
   accidental shared edit, but only 1, 2 and 3 are mandatory.

Six baselines, one per distinct English template — the six `[destination].astro` slugs
share one template, so per-slug baselines would re-measure identical markup:

| Slug | Path | Template |
|---|---|---|
| `en-home` | `/` | `src/pages/index.astro` |
| `en-services` | `/services/` | `src/pages/services.astro` |
| `en-contact` | `/contact-us/` | `src/pages/contact-us.astro` |
| `en-destinations` | `/destinations/` | `src/pages/destinations.astro` |
| `en-havana` | `/havana/` | `src/pages/[destination].astro` (representative) |
| `en-404` | `/404` | `src/pages/404.astro` |

A baseline recorded after WU1's edit proves nothing; if one is missing at that point,
`git stash` the config edit, record, restore. `baseline.sh --reset <slug>` drops a stale one.

### Tolerance discipline in a completion note

`diff.mjs` prints the tolerances in force as its **first line** and appends
`<-- RAISED ABOVE DEFAULT, must be justified by a named non-goal` when either exceeds
2%. So the evidence self-reports. Rules:

- Paste `compare.sh`'s **verbatim stdout**, first line included, per page. Never retype
  figures — a retyped block can silently lose the tolerance line.
- Any run at non-default tolerance additionally requires, adjacent to the pasted block:
  (a) the literal command including the env prefix, e.g.
  `PIXEL_TOLERANCE=0.05 ./reference/tools/compare.sh inicio /es/`;
  (b) the page + breakpoint + the **named** non-goal it derives from (excluded
  TripAdvisor/Trustpilot widget, absent language switcher, visual-only form) quoted from
  `proposal.md` Non-goals or the `spanish-public-pages` "Excluded source widgets"
  requirement; (c) confirmation from `diff-<viewport>.png` that the differing region is
  confined to that widget.
- Missing any of (a)–(c) ⇒ the work unit is not complete. A raise with no named non-goal
  is the failure mode `visual-parity-verification` explicitly rejects.
- Expected raises: `inicio` (Section 17 Trustpilot badge + `reviews` widget). Everything
  else is expected to pass at default 2%.

## Threat Matrix

N/A — no shell, subprocess, VCS/PR automation, executable-file classification, or
process-integration boundary. Astro routing here is static file-based page generation,
not request dispatch or argument composition; `compare.sh` and `baseline.sh` are
pre-existing verification tooling and are not modified.

## Migration / Rollout

Seven chained slices under `delivery_strategy: auto-chain`, each ≤800 changed lines
(`additions + deletions`), superseding the proposal's four-unit outline per the decision
above. Deletions are paired with the unit that replaces them.

| # | Work unit | Est. lines | `compare.sh` gate |
|---|---|---|---|
| 1 | Tokens, `EsLayout`, `EsHero`, `EsNav`, `EsFooter`, `routes.es.ts`, Poppins, **`contactos`** | ~510 (+) | `contactos /es/contactos`; **plus** the six English baselines before *and* after the tailwind edit |
| 2 | `reservar` (tabs + booking form, visual only) | ~330 (+) | `reservar /es/reservar` |
| 3 | `servicios`; delete `spanish/Services.astro`, `spanish-services.css`, `i18n/content/es/servicios.ts` | ~305 (+) / 255 (−) | `servicios /es/servicios` |
| 4 | `destinos/[slug].astro` + `src/data/es/destinations.ts` (6 destinations) | ~420 (+) | `la-habana`, `trinidad`, `cienfuegos`, `matanzas`, `santiago-de-cuba`, `pinar-del-rio` — six separate PASS verdicts |
| 5 | `EsCarousel` + `destinos` index; delete `spanish/Destinations.astro`, `i18n/content/es/destinos.ts` | ~350 (+) / 268 (−) | `destinos /es/destinos` |
| 6 | `inicio` (hero, icon-boxes, `slides`, testimonials) | ~470 (+) | `inicio /es/` |
| 7 | Cleanup: `SpanishHome.astro`, `home.css`, `spanish-destinations.css`, `i18n/content/es/home.ts`, `public/home` leftovers | ~774 (−) | Full re-run of all 11 slugs + the six English baselines |

WU1 leads because the shell appears on all eleven pages; `contactos` (99 spec lines) is
folded in so WU1 has a real measured gate rather than a build-passes proxy. WU4 must
land `la-habana` first — it defines the template the other five join as data.

If a page cannot reach `VERDICT: PASS` inside its slice, the slice is chained and the
page still ships at full parity. Shipping a documented visual gap is not available.

Rollback: every slice is additive except WU3/5/7 deletions, and all deleted files are
Spanish-only (verified above), so reverting a slice restores the prior Spanish state
without touching English.

## Open Questions

None blocking. The digest sweep has been executed, not merely designed: 37 of 52
`_media` files matched, and the 15 exceptions are enumerated above, so asset resolution
is a closed question. Two items carry forward as measured risks rather than questions:
carousel/Ken-Burns capture nondeterminism on `destinos` and `inicio` (mitigated by
regenerating the reference before treating it as a defect), and whether `inicio`'s
excluded review widgets require a raised tolerance (decided by the tool at WU6, recorded
per the discipline above).
