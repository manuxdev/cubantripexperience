# Tasks: spanish-site-visual-parity

`design.md` supersedes `proposal.md`'s four-unit outline. This checklist follows
`design.md`'s **seven** chained work units (Migration/Rollout table) exactly, not the
proposal's four.

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Work units | 7, chained, per `design.md` Migration/Rollout table |
| Per-unit line estimates | WU1 ~510(+) · WU2 ~330(+) · WU3 ~305(+)/255(−) · WU4 ~420(+) · WU5 ~350(+)/268(−) · WU6 ~470(+) · WU7 ~774(−) |
| 800-line budget risk | Low per unit as split; each stays under 800 changed lines (`additions + deletions`) |
| Delivery strategy | `auto-chain` (session preflight) |
| Chain strategy | 1→2→3→4→5→6→7, strictly sequential except the WU2/WU3 note below |
| Bounded review | One parent-owned review per work unit, after its gate passes |

```text
Decision needed before apply: No — auto-chain already selected, seven units already sized
Chained units: Yes, 7, mapped 1:1 to design.md's Migration/Rollout table
800-line budget risk: Low (design.md already split units that would otherwise breach 800)
```

**Parallelism note:** WU2 (`reservar`) and WU3 (`servicios`) both depend only on WU1's
shell (`EsLayout`, `EsHero`, `EsNav`, `EsFooter`, tokens) and not on each other, so they
MAY be worked in parallel if capacity allows. Every other unit is a hard sequential
dependency: WU4 depends on WU1; `la-habana` must land first inside WU4 because it defines
the destination template the other five join as data; WU5 depends on WU4 (destination
folder structure) and builds `EsCarousel`; WU6 depends on WU1 and reuses `EsCarousel` from
WU5; WU7 depends on all six prior units (final cleanup + full re-gate).

## 0. Ground rules for every task below

- All edits stay under the Astro repo root
  `/Volumes/Mac/Workspace/Extra/cubantripexperience/cubantripexperience`. WordPress stays
  read-only at `http://localhost:8080`; only `docker compose up -d` (one folder back) may
  be started to serve it, never edited.
- `reference/es/<slug>/spec.md` is the literal contract per page — copy, alpha hex,
  spacing, and Elementor breakpoints exactly as authored, source typos included.
  `elementor.json` is the fallback when `spec.md` omits a setting.
- `tailwind.config.cjs` is the **only** file both languages share in this entire change,
  and its edit is additive only (new `screens`/`colors`/`fontFamily` keys, no existing
  key changed). Every other file touched is Spanish-only or net-new.
- No booking backend, no form `action`/endpoint/submit handler, no TripAdvisor/Trustpilot
  widget, no Polylang switcher, no locale redirect/negotiation. Media resolves through
  `src/assets/` or `public/`, never a `localhost:8080` URL.
- Media identity is a digest match, not a filename match (`design.md` "Decision: media
  identity is a digest match"). Confirm with `shasum -a 256` before copying from
  `reference/es/_media/`; copy from `_media/`, never from `public/es/` (superseded, not
  adopted). `3-1.webp` (Trustpilot badge) is excluded, not copied, at any point.
- Acceptance for a page is `./reference/tools/compare.sh <slug> <astro-path>` printing
  `VERDICT: PASS` and exiting 0 at all three breakpoints (1440/768/390px). A build that
  passes, a DOM that matches, and links that resolve are necessary and never sufficient
  — this is the same failure mode that shipped `/contact-us` at 1273px against the
  source's 1055px undetected. No work unit below is complete without its named
  `compare.sh` (or `baseline.sh`) row passing.
- Carousel escape hatch (applies only inside WU5 `destinos` and WU6 `inicio` gates,
  procedure only, never blanket permission): if a `pixels` FAIL is localized to a
  carousel region in `diff-<viewport>.png`, first run
  `./reference/tools/extract.sh <slug>` to regenerate the reference, then re-run
  `compare.sh`. Only a failure that survives regeneration is an implementation defect.
  Outside carousel regions, a `pixels` FAIL is a defect immediately, with no
  regeneration step.
- Tolerance discipline: any run at a non-default `HEIGHT_TOLERANCE`/`PIXEL_TOLERANCE`
  requires, pasted into the work unit's completion record: (a) verbatim `compare.sh`
  stdout, first line (tolerance line) included, never retyped; (b) the literal command
  including the env prefix; (c) the page + breakpoint + the named non-goal it derives
  from, quoted from `proposal.md` Non-goals or the `spanish-public-pages` "Excluded
  source widgets" requirement; (d) confirmation from `diff-<viewport>.png` that the
  differing region is confined to that widget. Missing any of (a)–(d) means the work
  unit is not complete. `design.md` expects this only on WU6 (`inicio`, Trustpilot badge
  + `reviews` widget); everywhere else is expected to pass at default 2%.

## Work unit 1 — Foundation: tokens, `EsLayout`, `EsHero`, `EsNav`, `EsFooter`, `routes.es.ts`, Poppins, `contactos`

Depends on: nothing (first unit). Est. lines: ~510 (+).

- [x] **First action of this unit, before any edit**, against the pre-change build:
      run `./reference/tools/baseline.sh <slug> <path>` for each of the six English
      routes below and confirm each records a baseline capture. <!-- sdd-owner: implementation -->

  | Slug | Path |
  |---|---|
  | `en-home` | `/` |
  | `en-services` | `/services/` |
  | `en-contact` | `/contact-us/` |
  | `en-destinations` | `/destinations/` |
  | `en-havana` | `/havana/` |
  | `en-404` | `/404` |

- [x] Add Elementor `screens` (`mobile: {max:'767px'}`, `tablet: {max:'1024px'}`,
      `desktop: {min:'1025px'}`), `fontFamily.poppins`, and the `colors.es` palette
      (8-digit alpha literal, e.g. `cta: "#F8F43D85"`) to `tailwind.config.cjs`
      `theme.extend`, additive only — `sm`/`md`/`lg` and every existing key untouched.
      <!-- sdd-owner: implementation -->
- [x] Relocate the four existing Poppins files from `public/home/poppins-{400,500,600,700}.woff2`
      to `public/fonts/poppins-{400,500,600,700}.woff2`; all four weights loaded, 700
      included (used at `reference/es/inicio/spec.md:71`). <!-- sdd-owner: implementation -->
- [x] Resolve and copy `cover-image-about-cuba-for-a-trav-01.webp` (the hero background
      on all eleven pages) from `reference/es/_media/` into `src/assets/pages/es/` via
      the digest-match procedure (`shasum -a 256` group, then `sips -g pixelWidth -g
      pixelHeight` to confirm), per `design.md` "Decision: media identity is a digest
      match". <!-- sdd-owner: implementation -->
- [x] Add `src/styles/es.css` (Spanish-only reset) and `src/layouts/EsLayout.astro`
      (composes hero+nav+footer, sets `<html lang="es">`, imports Poppins + `es.css`;
      does not reuse `Layout.astro`). <!-- sdd-owner: implementation -->
- [x] Add `src/components/es/EsHero.astro` (`title`, `full?` props; `#503607` overlay,
      `custom_height=328px` default, `full` for `inicio`). <!-- sdd-owner: implementation -->
- [x] Add `src/components/es/EsNav.astro` (`showReserve` prop; floating nav,
      `#3F3F3FCF`→`#5F5F5F` gradient at `stop=43%`). <!-- sdd-owner: implementation -->
- [x] Add `src/components/es/EsFooter.astro` (`menuTabletWidth` prop;
      `223.328px` default, `331px` for `inicio`). <!-- sdd-owner: implementation -->
- [x] Create `src/i18n/routes.es.ts`: Spanish nav/footer link sets plus
      `esHref(wpUrl)` rewriting absolute source URLs (e.g.
      `http://localhost:8080/matanzas-es` → `/es/destinos/matanzas`) to relative
      `/es/...` paths. Keep `src/i18n/config.ts` and `src/i18n/routes.ts` unchanged.
      <!-- sdd-owner: implementation -->
- [x] With the WordPress stack up (`docker compose up -d` one folder back), run
      `./reference/tools/extract.sh contactos` to regenerate `rendered.html` — the
      `contactos` Fluent Form field list lives only there, not in `spec.md`.
      <!-- sdd-owner: implementation -->
- [x] Implement `src/pages/es/contactos.astro` from `reference/es/contactos/spec.md`:
      `EsLayout` shell, literal copy including the source typo `Envianos un mensaje`
      (Section 3, no accent), the mobile-only `hide_desktop=hidden-desktop` column
      rendering its own accented copy, and the Fluent Form field set read from
      `rendered.html` — labels, input types, and focus order preserved, no `action`,
      no endpoint, no submit handler. <!-- sdd-owner: implementation -->
- [x] Run `./reference/tools/compare.sh contactos /es/contactos` against the running
      Astro dev server. Expected: `VERDICT: PASS`, exit 0, all three breakpoints
      (`desktop`/`tablet`/`mobile`) within default 2% tolerance on both `height` and
      `pixels`. <!-- sdd-owner: implementation -->
- [x] **Last action of this unit**, after the tailwind edit: re-run
      `./reference/tools/baseline.sh <slug> <path>` for the same six English routes
      listed above. Expected: every route within tolerance against its pre-edit
      baseline (a baseline recorded after the edit proves nothing — this row re-runs
      the ones recorded first, it does not record new ones). <!-- sdd-owner: implementation -->
- **Rollback boundary:** revert `tailwind.config.cjs`, `public/fonts/poppins-*`,
  `src/layouts/EsLayout.astro`, `src/styles/es.css`, `src/components/es/{EsHero,EsNav,
  EsFooter}.astro`, `src/i18n/routes.es.ts`, `src/pages/es/contactos.astro`, and the
  copied hero asset only; no other page work has started.
- [ ] Start or reuse bounded review for the foundation unit before the next unit
      begins. <!-- sdd-owner: parent -->

## Work unit 2 — `reservar`

Depends on: Work unit 1 (shell + tokens). Est. lines: ~330 (+).

- [x] With the WordPress stack up, run `./reference/tools/extract.sh reservar` to
      regenerate `rendered.html` — the `reservar` Fluent Form field list lives only
      there. <!-- sdd-owner: implementation -->
- [x] Resolve and copy any `reservar`-only media not already local, via the
      digest-match procedure (§0), confirming against `reference-inventory.md`'s
      ledger only as a fallback when no `src/assets` digest match exists, and
      confirming the on-disk filename directly rather than trusting the ledger's
      planned name. <!-- sdd-owner: implementation -->
      Result: no reservar-only media exists — both images the spec references
      (`cover-image-about-cuba-for-a-trav-01.webp` hero, `my-project-1-5-removebg-preview-*.webp`
      footer mark) are already local from WU1.
- [x] Implement `src/pages/es/reservar.astro` from `reference/es/reservar/spec.md`:
      `EsLayout` shell with `EsNav showReserve={false}` (no Reservar button on its own
      page), tabs, and the booking-form Fluent Form field set read from
      `rendered.html` — visual only, no `action`, no endpoint, no submit handler, no
      booking workflow triggered by any interactive element. <!-- sdd-owner: implementation -->
- [ ] Run `./reference/tools/compare.sh reservar /es/reservar` against the running
      Astro dev server. Expected: `VERDICT: PASS`, exit 0, all three breakpoints
      within default 2% tolerance. <!-- sdd-owner: implementation -->
      Result: desktop PASS (height 1.2%, pixels 1.7%); tablet FAIL (height 1.1%
      PASS, pixels 3.4% FAIL); mobile FAIL (height 1.0% PASS, pixels 3.4% FAIL).
      `VERDICT: FAIL` overall — gate not met, row left unchecked. See
      `apply-progress.md` for full evidence and what remains.
- **Rollback boundary:** revert `src/pages/es/reservar.astro` only; WU1's shell and
  `contactos` are unaffected — no media was copied for this unit.
- [ ] Start or reuse bounded review for `reservar` before the next unit begins.
      <!-- sdd-owner: parent -->

## Work unit 3 — `servicios`

Depends on: Work unit 1 (shell + tokens). Est. lines: ~305 (+) / 255 (−).

- [x] Resolve and copy `servicios`-only media not already local, via the digest-match
      procedure (§0). <!-- sdd-owner: implementation -->
      Result: `standard.webp`/`van.webp`/`classic.webp` (already local from the
      English migration) digest-match the three vehicle images; only
      `discover-destinations.webp`/`-mobile.webp` (Section 9 background,
      1024x559 desktop + unsuffixed mobile variant) were new, copied into
      `src/assets/pages/es/`.
- [x] Implement `src/pages/es/servicios.astro` from `reference/es/servicios/spec.md`:
      `EsLayout` shell, literal copy, exact alpha hex. <!-- sdd-owner: implementation -->
- [x] Delete `src/components/spanish/Services.astro` (99 lines, superseded — encodes
      paraphrased copy). <!-- sdd-owner: implementation -->
- [x] Delete `src/styles/spanish-services.css` (91 lines, superseded). <!-- sdd-owner: implementation -->
- [x] Delete `src/i18n/content/es/servicios.ts` (paraphrased content layer, superseded
      by inline copy in `servicios.astro`). <!-- sdd-owner: implementation -->
- [x] Confirm nothing else imports the three deleted files (`grep`/codegraph search
      for each path returns no remaining reference outside this unit's diff).
      <!-- sdd-owner: implementation -->
      Result: only the stale `servicios.astro` itself imported them; confirmed
      via `rg -l` before deleting.
- [ ] Run `./reference/tools/compare.sh servicios /es/servicios` against the running
      Astro dev server. Expected: `VERDICT: PASS`, exit 0, all three breakpoints
      within default 2% tolerance. <!-- sdd-owner: implementation -->
      Result: `VERDICT: FAIL`. desktop height 1980->1992 (0.6%) pixels 4.6%;
      tablet height 2219->2211 (0.4%) pixels 10.5%; mobile height 2393->2347
      (1.9%) pixels 19.1%. All three heights are within the 2% default
      tolerance; `pixels` is not, on all three. Gate not met, row left
      unchecked. See `apply-progress.md` for full evidence, root causes fixed,
      and what remains.
- **Rollback boundary:** revert `src/pages/es/servicios.astro` and restore the three
  deleted files from Git history only; WU1/WU2 are unaffected.
- [ ] Start or reuse bounded review for `servicios` before the next unit begins.
      <!-- sdd-owner: parent -->

## Work unit 4 — Destination template + six destination pages

Depends on: Work unit 1 (shell + tokens). Est. lines: ~420 (+).

- [x] Define the `EsDestination`/`EsLandmark` data shape in
      `src/data/es/destinations.ts` per `design.md` Interfaces/Contracts (title, body,
      image, alt, `textBasis`/`imageBasis`/`imageSpace`/`imageSpaceMobile` and the
      optional per-card geometry fields). <!-- sdd-owner: implementation -->
- [x] Resolve and copy `la-habana` media via the digest-match procedure (§0); use
      `reference-inventory.md` lines 41–61 only as the fallback map, and confirm each
      on-disk filename directly — the ledger's planned names have drifted (e.g.
      `havana/capitol.webp` planned vs `the-capitol.webp` on disk).
      <!-- sdd-owner: implementation -->
- [x] Populate `la-habana`'s entry in `src/data/es/destinations.ts` from
      `reference/es/la-habana/spec.md` (5 landmarks, literal copy, exact geometry).
      <!-- sdd-owner: implementation -->
- [x] Implement `src/pages/es/destinos/[slug].astro`: `getStaticPaths` over the data
      array, `previous`/`next` from index arithmetic (mirrors the existing English
      `src/pages/[destination].astro`), `EsLayout` shell, hero/CTA-strip/footer as
      template constants (byte-identical across all six specs — not per-destination
      data). This is the file that must land as `la-habana`'s template before the
      other five are added as data. <!-- sdd-owner: implementation -->
- [x] Run `./reference/tools/compare.sh la-habana /es/destinos/la-habana`. Expected:
      `VERDICT: PASS`, exit 0, all three breakpoints — confirms the template before
      the remaining five are added as pure data. <!-- sdd-owner: implementation -->
- [ ] Resolve and copy media, then populate data entries, for `trinidad`,
      `cienfuegos`, `matanzas`, `santiago-de-cuba`, `pinar-del-rio` in
      `src/data/es/destinations.ts` — no change to `[slug].astro` itself for any of
      the five. <!-- sdd-owner: implementation -->
- [ ] Run `./reference/tools/compare.sh trinidad /es/destinos/trinidad`. Expected:
      `VERDICT: PASS`, exit 0, all three breakpoints. <!-- sdd-owner: implementation -->
- [ ] Run `./reference/tools/compare.sh cienfuegos /es/destinos/cienfuegos`. Expected:
      `VERDICT: PASS`, exit 0, all three breakpoints. <!-- sdd-owner: implementation -->
- [ ] Run `./reference/tools/compare.sh matanzas /es/destinos/matanzas`. Expected:
      `VERDICT: PASS`, exit 0, all three breakpoints. <!-- sdd-owner: implementation -->
- [ ] Run `./reference/tools/compare.sh santiago-de-cuba /es/destinos/santiago-de-cuba`.
      Expected: `VERDICT: PASS`, exit 0, all three breakpoints. <!-- sdd-owner: implementation -->
- [ ] Run `./reference/tools/compare.sh pinar-del-rio /es/destinos/pinar-del-rio`.
      Expected: `VERDICT: PASS`, exit 0, all three breakpoints. <!-- sdd-owner: implementation -->
- [ ] Confirm `src/pages/es/destinos/` contains exactly one page file (`[slug].astro`)
      and no per-destination `.astro` files. <!-- sdd-owner: implementation -->
- **Rollback boundary:** revert `src/pages/es/destinos/[slug].astro`,
  `src/data/es/destinations.ts`, and media copied for the six destinations only;
  WU1–WU3 are unaffected.
- [ ] Start or reuse bounded review for the destination template + six pages before
      the next unit begins. <!-- sdd-owner: parent -->

## Work unit 5 — `EsCarousel` + `destinos` index

Depends on: Work unit 4 (destination folder structure exists; template proven).
Est. lines: ~350 (+) / 268 (−).

- [ ] Add `src/components/es/EsCarousel.astro` (`slideCount`, `<slot>` props): CSS
      `overflow-x-auto snap-x` scroll-snap track with static dots, zero JS, zero
      dependency, per `design.md` "Decision: carousels are CSS scroll-snap, no
      dependency". No autoplay, no Ken Burns — deliberately not reproduced (no
      deterministic frame for `shot.mjs` to match). <!-- sdd-owner: implementation -->
- [ ] Resolve and copy `destinos`-index-only media (the 12 `media-carousel` widgets)
      via the digest-match procedure (§0), including the 404-`.jpg` → lowercase-`.webp`
      twin mapping in `reference/USAGE.md` §7 where the spec cites a 404ing source URL
      (these appear only in `hide_desktop` carousels, tablet/mobile-only).
      <!-- sdd-owner: implementation -->
- [ ] Implement `src/pages/es/destinos/index.astro` from
      `reference/es/destinos/spec.md`: `EsLayout` shell, 12 `EsCarousel` call sites,
      literal copy, `esHref()`-rewritten destination links. <!-- sdd-owner: implementation -->
- [ ] Delete `src/components/spanish/Destinations.astro` (149 lines, superseded).
      <!-- sdd-owner: implementation -->
- [ ] Delete `src/i18n/content/es/destinos.ts` (paraphrased content layer, superseded
      by inline copy). <!-- sdd-owner: implementation -->
- [ ] Confirm nothing else imports the two deleted files. <!-- sdd-owner: implementation -->
- [ ] Run `./reference/tools/compare.sh destinos /es/destinos` against the running
      Astro dev server. Expected: `VERDICT: PASS`, exit 0, all three breakpoints
      within default 2% tolerance. <!-- sdd-owner: implementation -->
- [ ] **If, and only if, that run reports a `pixels` FAIL localized to a
      `media-carousel` region in `diff-<viewport>.png`**: run
      `./reference/tools/extract.sh destinos` to regenerate the reference (an
      unstable Ken-Burns/carousel-timed reference is not a code bug), then re-run
      `./reference/tools/compare.sh destinos /es/destinos`. Expected after
      regeneration: `VERDICT: PASS`, exit 0. A failure that survives regeneration is
      an implementation defect and must be fixed, not re-tolerated. A `pixels` FAIL
      outside a carousel region is a defect immediately — this row does not apply to
      it. <!-- sdd-owner: implementation -->
- **Rollback boundary:** revert `src/components/es/EsCarousel.astro`,
  `src/pages/es/destinos/index.astro`, and restore the two deleted files from Git
  history only; WU1–WU4 are unaffected.
- [ ] Start or reuse bounded review for `EsCarousel` + `destinos` before the next
      unit begins. <!-- sdd-owner: parent -->

## Work unit 6 — `inicio`

Depends on: Work unit 1 (shell) and Work unit 5 (`EsCarousel` reused for `slides` and
`reviews`). Est. lines: ~470 (+).

- [ ] Resolve and copy `inicio`-only media via the digest-match procedure (§0),
      excluding `3-1.webp` (Trustpilot badge — verified by
      `link=https://www.trustpilot.com/review/cubantripexperience.com` at
      `reference/es/inicio/spec.md:239`; excluded by non-goal, never copied).
      <!-- sdd-owner: implementation -->
- [ ] Implement `src/pages/es/index.astro` from `reference/es/inicio/spec.md`:
      `EsLayout` shell with `EsHero full` (same hero image as the other ten pages,
      `height=full`), icon-boxes, `EsCarousel` for `slides`, `EsCarousel` for
      `reviews`, and the `700`-weight `¿Por qué somos los mejores?` heading (Section
      1, `typography_font_weight=700` — confirms the WU1 Poppins-700 load).
      <!-- sdd-owner: implementation -->
- [ ] Do not render the `reviews` widget's TripAdvisor/Trustpilot content or the
      Polylang language switcher present in the spec's nav section node — both
      excluded per non-goal. <!-- sdd-owner: implementation -->
- [ ] Run `./reference/tools/compare.sh inicio /es/` against the running Astro dev
      server at default tolerance. Paste the verbatim stdout (first line — the
      tolerance line — included) into the completion record. Expected outcome to
      evaluate: `VERDICT: PASS` at default 2% tolerance on every breakpoint except
      possibly where the excluded Trustpilot badge/`reviews` widget region differs.
      <!-- sdd-owner: implementation -->
- [ ] **If, and only if, that run reports a `pixels` FAIL localized to the `slides`
      carousel region**: run `./reference/tools/extract.sh inicio` to regenerate the
      reference, then re-run `compare.sh inicio /es/`. A failure that survives
      regeneration is an implementation defect. This does not apply to a `pixels`
      FAIL in the excluded Trustpilot/`reviews` region (handled by the next row) or
      to any FAIL outside a carousel region (a defect immediately).
      <!-- sdd-owner: implementation -->
- [ ] **If the only remaining `pixels` FAIL is confined to the excluded Trustpilot
      badge / `reviews` widget region**: re-run with a named non-default tolerance,
      e.g. `PIXEL_TOLERANCE=0.05 ./reference/tools/compare.sh inicio /es/`, and record
      in the completion note, all four required per §0's tolerance discipline: (a)
      the verbatim `compare.sh` stdout including the `<-- RAISED ABOVE DEFAULT` line;
      (b) the literal command with its env prefix, as above; (c) the page (`inicio`),
      the breakpoint(s) affected, and the quoted non-goal — "TripAdvisor/Trustpilot or
      other third-party review widgets — excluded per prior decision, unchanged here"
      (`proposal.md` Non-goals); (d) `diff-<viewport>.png` for each affected
      breakpoint showing the differing region confined to the Trustpilot badge /
      `reviews` widget and nowhere else. A raise missing any of (a)–(d), or covering a
      region outside that widget, means the work unit is not complete.
      <!-- sdd-owner: implementation -->
- **Rollback boundary:** revert `src/pages/es/index.astro` and media copied for it
  only; WU1–WU5 are unaffected.
- [ ] Start or reuse bounded review for `inicio`, including the tolerance evidence
      above if raised, before the final cleanup unit begins. <!-- sdd-owner: parent -->

## Work unit 7 — Cleanup and full re-gate

Depends on: Work units 1–6 (all page work complete). Est. lines: ~774 (−).

- [ ] Delete `src/components/home/SpanishHome.astro` (254 lines, superseded — last
      consumer removed in Work unit 6). <!-- sdd-owner: implementation -->
- [ ] Delete `src/styles/home.css` (252 lines, superseded — imported only by the three
      `es/` pages now replaced; confirmed nothing English reads it).
      <!-- sdd-owner: implementation -->
- [ ] Delete `src/styles/spanish-destinations.css` (211 lines, superseded — last
      consumer replaced in Work unit 5). <!-- sdd-owner: implementation -->
- [ ] Delete `src/i18n/content/es/home.ts` (paraphrased content layer, superseded by
      inline copy in `src/pages/es/index.astro`; this normalized `inicio`'s authored
      `/` separators away, which the literal-copy requirement forbids).
      <!-- sdd-owner: implementation -->
- [ ] Delete superseded leftovers under `public/home/*` once every consumer (the
      relocated Poppins files from Work unit 1, and any asset the deleted components
      above referenced) is confirmed gone. <!-- sdd-owner: implementation -->
- [ ] Confirm nothing else imports any of the five deleted paths above (grep/codegraph
      search each path; zero remaining references outside this unit's own diff).
      <!-- sdd-owner: implementation -->
- [ ] Run `npm run build` and confirm it succeeds with the deletions applied.
      <!-- sdd-owner: implementation -->
- [ ] Run `./reference/tools/compare.sh <slug> <path>` for all eleven Spanish pages
      and confirm eleven separate `VERDICT: PASS` results, exit 0 each, per the table
      below (this proves the cleanup deletions changed nothing observable).
      <!-- sdd-owner: implementation -->

  | Slug | Path |
  |---|---|
  | `inicio` | `/es/` |
  | `servicios` | `/es/servicios` |
  | `destinos` | `/es/destinos` |
  | `la-habana` | `/es/destinos/la-habana` |
  | `trinidad` | `/es/destinos/trinidad` |
  | `cienfuegos` | `/es/destinos/cienfuegos` |
  | `matanzas` | `/es/destinos/matanzas` |
  | `santiago-de-cuba` | `/es/destinos/santiago-de-cuba` |
  | `pinar-del-rio` | `/es/destinos/pinar-del-rio` |
  | `contactos` | `/es/contactos` |
  | `reservar` | `/es/reservar` |

- [ ] Re-run `./reference/tools/baseline.sh <slug> <path>` for the same six English
      routes recorded in Work unit 1 (`en-home`, `en-services`, `en-contact`,
      `en-destinations`, `en-havana`, `en-404`). Expected: every route still within
      tolerance against its Work-unit-1 baseline, proving the cleanup deletions left
      English untouched. <!-- sdd-owner: implementation -->
- **Rollback boundary:** revert the specific deleted files in this unit only; all six
  prior page units remain intact and independently functional.
- [ ] Start or reuse bounded review for cleanup + full re-gate — this is the change's
      final sign-off. <!-- sdd-owner: parent -->
