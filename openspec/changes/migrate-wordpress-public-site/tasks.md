# Tasks: migrate-wordpress-public-site

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~900–1400 (many small/medium files: data modules, layout, nav/footer, ~5+ page routes, components, styles, config, asset reconciliation, plus a substantial reference-inventory doc) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (Inventory freeze) → PR 2 (Foundation: data/layout/nav/footer/styles/metadata) → PR 3 (Home page) → PR 4..N (one PR per retained primary page) → PR N+1 (Contact + visual-only form) → PR N+2 (404 + cleanup) → PR N+3 (Validation evidence, if not folded into prior PRs) |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

```text
Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High
```

Notes for the parent/session: this forecast is High risk and the session's declared
delivery strategy is `ask-on-risk`, so implementation MUST ask before applying whether
to proceed as a chained-PR sequence (mapped 1:1 to the "Work unit" boundaries below) or
request an accepted `size:exception`. Each work unit below is sized to plausibly fit
inside the 400-line budget on its own; combining multiple page-implementation work units
into one PR is the most likely way to exceed budget and should be avoided unless a page
is trivially small.

## 0. Ground rules for every task below

> **Path context changed.** These artifacts now live inside the Astro Git repository at
> `/Volumes/Mac/Workspace/Extra/cubantripexperience/cubantripexperience`, which is the
> repo root. Task rows written as `cubantripexperience/src/...` refer to `src/...`
> relative to that repo root. The WordPress source stays outside the repo at
> `../wordpress/` and remains read-only.

- All edits stay under the Astro repo root
  `/Volumes/Mac/Workspace/Extra/cubantripexperience/cubantripexperience`.
  `../wordpress/` is read-only for this change; only `http://localhost:8080/` is browsed
  as a live reference. No file under `wordpress/` may be modified.
- No booking/reservation UI, copy, fields, or links. No i18n/locale routes or language
  switcher. No review widgets/badges. No live form backend/endpoint/network call.
- Baseline verification command is `npm install && npm run build` from
  `cubantripexperience/`; there is no test runner (`strict_tdd: false`).
- Work-unit commits: each numbered work unit below is sized as one commit or one
  chained PR (per `work-unit-commits` skill) with its own start/finish/verify/rollback
  boundary. Do not mix unrelated work units in one commit.

## Work unit 1 — Freeze the live reference inventory (gates everything else)

- [x] Browse `http://localhost:8080/` starting at the default-language home page; open
      the header, footer, and every public nav destination; follow same-origin public
      links; normalize query strings/fragments/redirects/trailing slashes to one
      logical path per page. <!-- sdd-owner: implementation -->
- [x] Create `openspec/changes/migrate-wordpress-public-site/reference-inventory.md`
      with one row per discovered route: normalized source path, target path,
      disposition (`migrate` / `infrastructure-only` / `exclude`), exclusion reason
      when applicable, source nav label/order, page title, section sequence,
      desktop/mobile ordering differences, copy ownership location in target, used
      media + alt text + intended local asset path, form classification (`none` /
      `general-contact-visual-only` / `excluded-booking`), metadata observations,
      source canonical public origin if present. <!-- sdd-owner: implementation -->
- [x] For each row disposed `migrate`, add a section checklist: heading hierarchy,
      paragraphs/lists, media placement, CTA label + destination, background/surface
      treatment, responsive stacking notes. <!-- sdd-owner: implementation -->
- [x] Explicitly classify each of the current scaffold routes (`/`, `/about`,
      `/contact`, `/pricing`, `/404`) against the inventory: retained (same or renamed
      path), removed, or justified infrastructure (`/404`). <!-- sdd-owner: implementation -->
- [x] Explicitly classify every Fluent Forms / direct-message (e.g. WhatsApp) control
      found on the reference as `excluded-booking` or `general-contact-visual-only`
      per the booking-vs-contact classification rule in the design. <!-- sdd-owner: implementation -->
- [x] Verify inventory completeness gate: every default-language header/footer
      destination has a disposition; every retained route has a target path; every
      visible source asset used by a retained page has a local mapping; no retained
      navigation destination points to an excluded row. Record this check explicitly
      at the bottom of `reference-inventory.md`. <!-- sdd-owner: implementation -->
- [x] Capture reference desktop (1440×900) and mobile (390×844) screenshots (or
      equivalent notes) per retained route for later visual comparison, and timestamp
      the inventory to guard against reference drift. <!-- sdd-owner: implementation -->
- **Verify:** inventory file exists, covers every scaffold route disposition, and
  passes the completeness gate above (manual review, no build step needed yet).
- **Rollback boundary:** delete/revert `reference-inventory.md` only; no app code
  touched by this unit.
- [ ] Start or reuse bounded review for the frozen inventory before any page work
      begins. <!-- sdd-owner: parent -->

## Work unit 2 — Shared foundation: data, metadata, styles, header/nav/footer

Depends on: Work unit 1 (route/nav disposition must be final).

- [x] Add `cubantripexperience/src/data/site.ts` with brand name, default language,
      title suffix, default description, verified contact identity, scope-passing
      social links, footer text — sourced only from inventory-confirmed values.
      <!-- sdd-owner: implementation -->
- [x] Add `cubantripexperience/src/data/routes.ts` with typed retained-route constants
      and the ordered desktop/mobile/footer navigation model; only `migrate`-disposed
      routes are represented. <!-- sdd-owner: implementation -->
- [x] Replace `cubantripexperience/astro.config.mjs` `site` value: use the verified
      reference canonical HTTPS origin if present in the inventory, otherwise the
      explicit `https://cubantripexperience.example` placeholder, documented inline;
      never `localhost`. <!-- sdd-owner: implementation -->
- [x] Rename package identity in `cubantripexperience/package.json` away from
      Astroship and refresh `package-lock.json` via `npm install`. <!-- sdd-owner: implementation -->
- [x] Replace `cubantripexperience/src/layouts/Layout.astro` metadata contract: accept
      `title`, `description`, optional OG image/alt, optional body-class; set
      `<html lang>` to the reference default language; derive canonical URL from
      `Astro.site`/`Astro.url.pathname`; emit Cuban Trip Experience OG tags; keep skip
      link, `<main id="main-content">`, header/footer slots; remove Astroship
      metadata/unneeded view-transition layer. <!-- sdd-owner: implementation -->
- [x] Add `cubantripexperience/src/styles/global.css` (brand palette custom
      properties, typography defaults, focus/selection treatment, cross-page
      utilities) and import it once from `Layout.astro`. <!-- sdd-owner: implementation -->
- [x] Update `cubantripexperience/tailwind.config.cjs`: add source-derived color,
      font, container-width, spacing/radius tokens; fix the misplaced `boxShadow`
      nesting. <!-- sdd-owner: implementation -->
- [x] Replace `public/favicon.svg` and `public/opengraph.jpg` with branded local
      media and Cuban Trip Experience OG alt text; remove now-unused Astroship
      logo/hero/social/OG source files once no longer imported. <!-- sdd-owner: implementation -->
- [x] Rebuild header/nav: replace `cubantripexperience/src/components/navbar/navbar.astro`
      and `menus.astro` (and `dropdown.astro` if reused) with a semantic shared header
      driven by `src/data/routes.ts`; desktop and mobile render from the same data;
      remove the `Book` button/`localhost:3000` destination and the flag/language
      menu entirely; use relative internal URLs (no `#` placeholders) and
      active-route styling from `Astro.url.pathname`; keep keyboard focus and an
      accessible mobile menu label/open-close state. <!-- sdd-owner: implementation -->
- [x] Rebuild `cubantripexperience/src/components/footer.astro`: real site identity,
      retained public destinations only, verified contact/social details, real legal
      links if present in the inventory; remove Astroship/Web3Templates attribution.
      <!-- sdd-owner: implementation -->
- **Verify:** `npm install && npm run build` succeeds from `cubantripexperience/`;
  manually confirm header/footer/nav render with no `Astroship`, `web3templates`,
  `localhost:3000`, `#` links, or language switcher; keyboard-navigate the header and
  mobile disclosure.
- **Rollback boundary:** revert this unit's files (`site.ts`, `routes.ts`,
  `astro.config.mjs`, `package.json`/lock, `Layout.astro`, `global.css`,
  `tailwind.config.cjs`, `public/favicon.svg`, `public/opengraph.jpg`, navbar/footer
  components) independently of page-level work, which has not started yet.
- [ ] Start or reuse bounded review for the shared foundation before page
      implementation begins. <!-- sdd-owner: parent -->

## Work unit 3 — Home page

Depends on: Work unit 2.

- [x] Replace `cubantripexperience/src/pages/index.astro` and
      `cubantripexperience/src/components/home/*` (`hero.astro`, `features.astro`,
      `cosaesa.astro`, `section1.astro`, `cta.astro`, `logos.astro`, `index.astro`)
      with the inventory's home section order and real content; remove Astro
      framework promo content, technology logos, experimental color panels, generic
      CTA copy; delete any home subcomponent no longer used. <!-- sdd-owner: implementation -->
- [x] Add/import local optimized media for home sections under
      `src/assets/pages/home/` per the inventory asset ledger, using
      `astro:assets`/`@astrojs/image` `Picture` with explicit alt text and intrinsic
      dimensions. <!-- sdd-owner: implementation -->
- [x] Add reusable primitives introduced at this point if proven by repetition in the
      inventory (`PageHero.astro`, `SectionHeading.astro`, `MediaTextSection.astro`)
      under `src/components/sections/` or `src/components/layout/` as appropriate.
      <!-- sdd-owner: implementation -->
- **Verify:** `npm run build` succeeds; home route renders no Astroship strings;
  desktop (1440×900) and mobile (390×844) manual comparison against
  `http://localhost:8080/` home matches section order/copy/media per inventory.
- **Rollback boundary:** revert `index.astro`, `components/home/*`, and any new
  `src/assets/pages/home/*`/shared primitives added in this unit only.
- [ ] Start or reuse bounded review for the home page before moving to the next
      retained page. <!-- sdd-owner: parent -->

## Work unit 4..N — One retained primary page per unit (inventory/navigation order)

Depends on: Work unit 2 (and, for shared primitives, Work unit 3 if reused).
Repeat this template once per `migrate`-disposed route other than home/contact/404
(e.g. the About/Team page, and whatever the inventory resolves `/pricing` to —
Services, Destinations, or removal).

- [x] Reconcile the target route file under `cubantripexperience/src/pages/**` for
      this inventory row: keep, rename, or remove the corresponding scaffold file
      (`about.astro`, `pricing.astro`) to match the resolved target path.
      <!-- sdd-owner: implementation -->
- [x] Implement the page's sections in source order using shared primitives from
      Work unit 3 plus new page-specific `.astro` sections/components only where the
      inventory shows repeated structure; keep one-off prose semantic and local.
      <!-- sdd-owner: implementation -->
- [x] Add structured data to `cubantripexperience/src/data/pages/<page>.ts` for
      repeated structured content (service/destination lists, feature rows) if the
      inventory shows this improves auditability. <!-- sdd-owner: implementation -->
- [x] Remove `cubantripexperience/src/content/team/**` and its content-collection
      config entry in `src/content/config.ts` if no retained page requires a
      structured team collection (per inventory disposition). <!-- sdd-owner: implementation -->
- [x] Remove `cubantripexperience/src/components/pricing.astro` if the pricing-tier
      structure is not retained per inventory. <!-- sdd-owner: implementation -->
- [x] Add/import local optimized media for this page under
      `src/assets/pages/<page>/` per the inventory asset ledger. <!-- sdd-owner: implementation -->
- **Verify:** `npm run build` succeeds; page contains no Astroship/generic team/SaaS
  pricing strings; desktop/mobile manual comparison against the reference page
  matches inventory section checklist; internal links resolve to in-scope routes
  only.
- **Rollback boundary:** revert this page's route file(s), new page-specific
  components/data, and its `src/assets/pages/<page>/*` only; other pages unaffected.
- [ ] Start or reuse bounded review for this page before starting the next one.
      <!-- sdd-owner: parent -->

## Work unit — Contact page and visual-only form

Depends on: Work unit 2, and reuses primitives from Work unit 3 if applicable.

- [x] Reconcile `cubantripexperience/src/pages/contact.astro` with the inventory's
      contact page content and real Cuban Trip Experience contact identity (email,
      phone, address as verified on the reference site). <!-- sdd-owner: implementation -->
- [x] If the inventory found a `general-contact-visual-only` form: rewrite
      `cubantripexperience/src/components/contactform.astro` into `ContactForm.astro`
      with the same visible field set (labels/placeholders) as the reference form;
      delete the Web3Forms `action`/endpoint markup, access-key field, bot-check
      field, inline validation/submission `fetch` script, and result element; final
      control uses `type="button"` and `aria-disabled="true"`, styled but
      non-submitting; no date/time, passenger, pickup/drop-off, or trip-selection
      fields. <!-- sdd-owner: implementation -->
- [x] If the inventory found only `excluded-booking` forms on the contact page (no
      general form): remove `contactform.astro` entirely and render only verified
      public contact information on the contact page. <!-- sdd-owner: implementation -->
- **Verify:** `npm run build` succeeds; with DevTools Network open, activating the
  form control (if present) triggers no HTTP request; source search finds no
  `api.web3forms.com`, access key, or `fetch`/submit handler; visible field set
  matches the reference form per inventory.
- **Rollback boundary:** revert `contact.astro` and `contactform.astro`/`ContactForm.astro`
  only.
- [ ] Start or reuse bounded review for the contact page and form treatment.
      <!-- sdd-owner: parent -->

## Work unit — 404 and cleanup

Depends on: all prior page work units.

- [x] Restyle `cubantripexperience/src/pages/404.astro` within the shared
      `Layout.astro` shell (header, footer, skip link), matching a branded not-found
      experience. <!-- sdd-owner: implementation -->
- [x] Sweep `cubantripexperience/src/pages/**`, `src/components/**`, `src/assets/**`,
      `public/**` for orphaned scaffold files no longer imported by any retained
      route (unused home/pricing/team/template components, unused Astroship logo,
      hero, social, and OG assets) and delete them. <!-- sdd-owner: implementation -->
- [x] Confirm no orphan routes remain: every file under `src/pages/**` corresponds to
      a `migrate` or `infrastructure-only` inventory row. <!-- sdd-owner: implementation -->
- **Verify:** `npm run build` succeeds; `dist/` contains no unreferenced/leftover
  scaffold assets; route list matches inventory exactly.
- **Rollback boundary:** revert `404.astro` and the specific deleted/moved files in
  this unit; earlier page units remain intact.
- [ ] Start or reuse bounded review for 404 + cleanup. <!-- sdd-owner: parent -->

## Work unit — Build, static, and visual validation evidence

Depends on: all prior work units (may be folded into the last page/cleanup PR if
small enough to stay under budget; otherwise its own PR).

- [x] Run `npm install && npm run build` from `cubantripexperience/` and record the
      exact result. <!-- sdd-owner: implementation -->
- [x] Static-search `cubantripexperience/src` and `cubantripexperience/dist` for:
      Astroship/Web3Templates strings and domains/emails; `api.web3forms.com`, access
      keys, submission `fetch` calls; booking/reservation labels and fields
      (date/time, passenger, pickup/drop-off, trip selectors); `localhost:3000`,
      rendered `localhost:8080`, WordPress upload URLs, Elementor/Astra asset
      imports, placeholder `href="#"`; locale-prefixed routes, language controls,
      review widget/badge scripts or graphics. Record zero matches (or resolve any
      found). <!-- sdd-owner: implementation -->
- [x] Cross-check the generated route/sitemap output against every `migrate` row in
      `reference-inventory.md`, and confirm every `exclude` row has no route/UI entry
      point. <!-- sdd-owner: implementation -->
- [x] Run the Astro dev/preview server locally (non-8080 port) alongside the
      WordPress reference at `http://localhost:8080/`; for every retained route,
      capture/compare desktop (1440×900), mobile (390×844), and tablet (~768px)
      views; note any accepted differences (excluded booking/locale/review surfaces)
      directly in `reference-inventory.md`. <!-- sdd-owner: implementation -->
- [x] Keyboard-navigate header, mobile disclosure, links, and the visual form on each
      route; confirm focus stays visible, reading order is logical, mobile menu
      doesn't trap focus, skip link reaches `<main>`, meaningful images have
      source-derived alt text, headings don't skip levels, no horizontal scroll at
      page zoom. <!-- sdd-owner: implementation -->
- [x] Request an unmatched path against the built/static output and confirm the
      branded shared-shell 404 renders. <!-- sdd-owner: implementation -->
- **Verify:** all checks above pass or have documented, in-scope-justified
  exceptions recorded in `reference-inventory.md`.
- **Rollback boundary:** N/A (evidence-only unit; no app code changes expected here
  unless a check surfaces a defect, in which case that fix belongs to the owning
  page's work unit instead).
- [ ] Start or reuse bounded review for final validation evidence and overall change
      sign-off. <!-- sdd-owner: parent -->
