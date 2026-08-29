# Achieve pixel-verified visual parity for the Spanish public site

## Context and problem

`migrate-wordpress-public-site` (complete, not reopened by this change) migrated the
default-language (English) public site into the Astro target and explicitly excluded
`/es/`: "Migrate the primary/default public language only; no Astro i18n or translated
routes are added in this change." That change is done and stays done.

Its own `apply-progress.md` records the gap this change exists to close:

> "No pixel screenshots, desktop/mobile/tablet viewport capture, or pixel comparison was
> performed because this runtime has no screenshot-capture capability."

Validation there was structural only: DOM presence, heading order, link resolution,
build success. That gate missed real visual defects — `/contact-us` currently renders
1273px tall on desktop against the WordPress source's 1055px (2010px vs 1278px on
mobile) — while passing every structural check the prior change defined. Structural
correctness and visual correctness are different properties, and only one of them was
ever checked.

This change targets the eleven Spanish pages (`reference/tools/pages.tsv`) and makes
pixel-captured visual parity, not structural parity, the acceptance criterion. The
current runtime for this change has real Playwright-backed capture via
`reference/tools/compare.sh`, closing the capability gap that produced the prior blind
spot.

## Goals

- Every one of the eleven Spanish pages renders in Astro under `/es/` with visual parity
  to its WordPress source, verified by pixel capture at 1440px / 768px / 390px.
- Elementor's breakpoints (mobile `< 768px`, tablet `768–1024px`, desktop `≥ 1025px`)
  are reproduced exactly in `tailwind.config.cjs`, not approximated with Tailwind's
  defaults (`sm`/`md`/`lg`), since the two do not align and the misalignment is exactly
  where responsive layouts silently diverge.
- `reference/es/<slug>/spec.md` (Elementor-derived, not scraped HTML) is treated as the
  literal contract per page: exact copy including source typos, exact 8-digit alpha hex
  colors, exact spacing and typography.
- Existing English routes at `/` remain untouched and functional throughout.

## Non-goals

- Reopening or re-validating the English (`migrate-wordpress-public-site`) pages.
  Existing `/contact-us` height defect may be logged as a known issue but fixing it is
  out of scope here unless it blocks shared components this change touches.
- Polylang language switcher UI/logic — out of scope while only Spanish and English
  exist as implemented languages.
- Any form submission behavior, endpoint, or handler for Fluent Forms — visual-only
  per prior decision, unchanged here.
- TripAdvisor/Trustpilot or other third-party review widgets — excluded per prior
  decision, unchanged here.
- Russian (`/ru/`) or any language beyond Spanish/English.
- Tearing out or replacing `src/i18n/` — it is a deliberate existing foundation and is
  extended, not discarded.

## Scope

| Area | In scope | Out of scope |
|---|---|---|
| Pages | inicio, servicios, destinos, la-habana, trinidad, cienfuegos, matanzas, santiago-de-cuba, pinar-del-rio, contactos, reservar (11 total) | Any English page, `/ru/`, admin/booking surfaces |
| Routing | `/es/` prefix for all Spanish pages, English stays at `/` | Locale-based redirect/negotiation, language switcher |
| Design tokens | Poppins font, Elementor 8-digit-alpha palette, Elementor breakpoints in `tailwind.config.cjs` | Changing English page tokens/theme |
| Destination pages | One dynamic route (`src/pages/es/destinos/[slug].astro`) + one data array for the 6 destinations | Per-page duplicated markup for destinations |
| Forms | Fluent Forms rendered visually only (no action/endpoint/submit handler) | Any working submission, validation, or backend integration |
| Third-party widgets | — | TripAdvisor/Trustpilot review widgets (excluded) |
| Verification | Pixel capture via `compare.sh` at 1440/768/390px per page, compared against `reference/es/<slug>/{desktop,tablet,mobile}.png` | Structural-only checks (DOM/heading/link) as a sufficient gate |

## Route and URL decision

**Spanish pages live under `/es/`; English stays at `/`.** This mirrors the WordPress
source exactly — it serves English at `/` and Spanish at `/es/` — and "faithful
migration" is defined relative to that source, not relative to a hypothetical
restructuring of it. One shared Tailwind theme covers both languages; the header
renders per-language navigation from shared route data in `src/i18n/routes.ts`,
extending rather than replacing the existing i18n scaffold. The six destination detail
pages collapse into `src/pages/es/destinos/[slug].astro` plus a destination data array,
per `reference/es/README.md`'s per-page WordPress→Astro path mapping.

## Acceptance and verification approach

**The acceptance contract is `reference/es/<slug>/spec.md`** — generated from
`_elementor_data`, the real Elementor layout tree with exact copy, colors, spacing, and
responsive overrides — not scraped/rendered HTML.

**The non-negotiable verification step is pixel capture, not structural inspection.**
For every work unit, before it is considered complete:

```sh
./reference/tools/compare.sh <slug> <astro-path>
```

This captures the Astro dev server full-page at 1440px, 768px, and 390px and writes
`astro-{desktop,tablet,mobile}.png` beside the reference captures for direct
comparison. A work unit that passes `npm run build`, has correct heading hierarchy, and
resolves all links but has not run `compare.sh` against all three breakpoints is
**not** done — the prior change's own record is the proof that structural checks alone
let a visible layout defect (`/contact-us`, 1273px vs 1055px desktop; 2010px vs 1278px
mobile) ship undetected.

Elementor breakpoints must be reproduced exactly in `tailwind.config.cjs` (mobile
`<768px`, tablet `768–1024px`, desktop `≥1025px`), since Tailwind's default `md`/`lg`
boundaries (768px/1024px) do not line up with Elementor's and using the defaults would
silently reintroduce the same class of gap this change exists to close.

## Delivery outline — four chained work units, 800-line budget

Ordered by dependency (shared shell first, so no page work happens against an
unfinished header/footer/token base), per `reference/USAGE.md` section 4:

1. **Foundation — tokens, header/footer, route scaffold.** `tailwind.config.cjs`
   (Poppins, Elementor palette, Elementor breakpoints), shared floating nav + footer,
   `src/i18n/` route data extension. Gate: `compare.sh` against a stub or the shortest
   page once available; primarily a build-passes + token-correctness gate since no full
   page exists yet.
2. **Shortest pages — contactos, reservar.** Validate header/footer/tokens end-to-end
   on the two shortest specs (99 and 135 spec lines) with the least layout risk. Gate:
   `compare.sh contactos /es/contactos` and `compare.sh reservar /es/reservar` at all
   three breakpoints; forms visual-only, no submit handler.
3. **Destinations — servicios, destination template, 6 destination pages.**
   `servicios.astro`; `src/pages/es/destinos/[slug].astro` dynamic route plus a
   destination data array built from `la-habana` (first, defines the template) then the
   other five as data. Gate: `compare.sh` for `servicios` and each of the six
   destination slugs at all three breakpoints.
4. **Home and destinos index — inicio, destinos.** The two longest specs (279 and 317
   lines), reusing the destination cards built in work unit 3. Gate: `compare.sh inicio
   /es/` and `compare.sh destinos /es/destinos` at all three breakpoints; final
   cross-page check that no English/Astroship remnants leaked into `/es/`.

Each work unit stays within the 800-changed-line review budget individually; the
foundation and shortest-pages units are expected well under it, leaving headroom for
destination-template and home-page work.

### Delivery guarantee: budget bounds a slice, not the outcome

If a page cannot reach full visual parity within one 800-line slice, that work unit is
split into chained slices under `delivery_strategy: auto-chain`, and the page still
ships at full parity — it is not shipped with a documented gap instead. The 800-line
ceiling bounds a single reviewable slice; it does not bound the amount of work a page
is allowed to need. Visual parity is this change's acceptance criterion, so a page
shipping short of it has no acceptance criterion at all; chaining is the mechanism that
keeps the criterion intact when a single slice isn't enough.

## Risks

- **Pixel-diff judgment is manual, not automated.** `compare.sh` produces image pairs;
  there is no pixel-diff threshold or CI gate in this environment. Risk of subjective
  "close enough" acceptance creeping back toward the structural-only failure mode this
  change is meant to prevent. Mitigation: named per-work-unit gate list above, and any
  accepted visual difference (e.g., excluded review widgets) must be recorded
  explicitly rather than silently tolerated.
- **Breakpoint migration touches the English theme too**, since `tailwind.config.cjs`
  is shared. Mitigation: additive `screens` keys (`mobile`, `tablet`, `desktop`)
  alongside the existing `sm`/`md`/`lg` used by English pages, not a replacement of
  them.
- **Media assets — resolved, no longer a risk**: the eleven specs reference 60 unique
  WordPress media URLs. `reference/tools/fetch-media.sh` has downloaded 52 of them into
  `reference/es/_media/` under their original WordPress filenames, which are exactly the
  names the `spec.md` files cite. The remaining 8 are `.jpg` URLs that 404 on the
  WordPress source itself (Autoptimize converted them to `.webp` and removed the
  originals); each has a lowercase `.webp` twin that is present, and the mapping table
  is in `reference/USAGE.md` §7. Comparing local assets by filename is meaningless: the
  English migration renamed them semantically (`el-capitolio-havana-cuba.webp` became
  `src/assets/pages/havana/the-capitol.webp`), so match by content, and copy from
  `_media/` under a semantic name when an asset is not already local.
- **Known English visual defect, deliberately deferred, not silently dropped**:
  `/contact-us` currently renders 1273px vs the source's 1055px on desktop (2010px vs
  1278px on mobile). This change's non-goals exclude re-validating English pages, so
  the defect stays unresolved here by deliberate choice — it is not opened as an
  automatic follow-up change (that would widen scope beyond what was asked), but it is
  named here rather than left to be rediscovered silently.

## Open questions

None. All product questions raised during proposal drafting are settled — see the
question round below for where each was resolved.

## Proposal question round

Three product questions were raised while drafting this proposal. All three are now
settled by orchestrator review; none remain open.

1. **`/contact-us` (English) visual defect** — settled: log it as a known issue inside
   this proposal (see Risks above); do not open a follow-up change automatically, since
   that would widen scope the maintainer did not ask for.
2. **Accepted-difference bar** — settled: a one-line note in each work unit's
   completion record is sufficient. No standing "accepted-differences" ledger file.
   The deliberate differences are already few and named in Non-goals (excluded review
   widgets, visual-only forms, no language switcher); a separate ledger would restate
   the proposal without adding information.
3. **Failure handling when a page exceeds its work unit's line budget** — settled: the
   work unit is split into chained slices under `delivery_strategy: auto-chain` and the
   page still ships at full visual parity. "Ship with a documented gap" is not an
   available option — visual parity is this change's entire reason to exist, and a
   change that ships gaps against its own acceptance criterion has no acceptance
   criterion. See "Delivery guarantee" above.
