# Migrate the public WordPress site to the Astro target

The Astro app at `cubantripexperience/` is currently the unmodified "Astroship" demo
(generic SaaS copy, placeholder team/pricing/contact data, `astroship.web3templates.com`
branding) with only the homepage hero partially rebranded. The real Cuban Trip
Experience public site — navigation, pages, copy, media, and layout — lives in the
WordPress source at `wordpress/` (Astra theme + Elementor, currently served at
`http://localhost:8080/`). This proposal defines the bounded scope for replacing the
Astro placeholder with the actual public site's visual layer and content, using the
running WordPress site as the visual and content reference.

Reservation/booking functionality, WordPress administration, and any private/admin
surfaces are explicitly out of scope and must not appear in the Astro target as a
result of this change.

## Quick path

1. Inventory the public pages, navigation, and content actually served by the
   reference site (`http://localhost:8080/`) — page text and Elementor layouts live in
   the WordPress database, not in static source files, so this inventory must be done
   against the running reference, not just by reading `wordpress/` source files.
2. Map each public page/section to an Astro route or component under
   `cubantripexperience/src/pages` and `src/components`, replacing Astroship
   placeholder copy, images, team data, and pricing with real site content.
3. Verify with `npm install && npm run build` in `cubantripexperience/` (no test
   runner exists) plus a manual responsive visual comparison against
   `http://localhost:8080/`.

## Why now

- The target app ships Astroship placeholder text ("Astroship", `hello@astroshipstarter.com`,
  generic team names, generic SaaS pricing tiers, `astroship.web3templates.com` site
  URL) instead of the real public site, so it cannot replace the WordPress site today.
- WordPress is the current production public surface; migrating its visual layer and
  public content into the existing Astro scaffold is the next concrete step toward
  retiring the WordPress front end for public traffic.

## Scope

### In scope

| Area | Detail |
|------|--------|
| Public pages | Home, About, Contact, Pricing/Services (or their real WP equivalents), 404, and any other public pages served by the reference site, mapped onto Astro routes. |
| Navigation & layout | Header/nav, footer, shared `Layout.astro` shell, and responsive behavior matching the reference site. |
| Public content | Real page copy, team/staff info, service descriptions, and any other current public content — replacing all Astroship placeholder text. |
| Media | Images/media actually used by public pages, migrated into the Astro `src/assets`/`public` conventions (e.g. `astro:assets`/`@astrojs/image`). |
| Visual parity | Colors, typography, spacing, and component structure representing the source site's public look, expressed through the target's existing Tailwind/daisyUI conventions rather than importing Elementor/Astra CSS wholesale. |
| Forms | Public forms may be represented visually only, with no submission behavior, endpoint, or integration. Booking/reservation forms remain excluded entirely. |
| Site metadata | Base SEO/site config (title, `astro.config.mjs` `site` URL, canonical/OG defaults) updated away from the Astroship/`web3templates` defaults to reflect this site — required for parity, not a new capability. |

### Explicitly out of scope

| Area | Detail |
|------|--------|
| Reservations/booking | Any booking or reservation workflow, plugin, form, or UI (including booking-oriented Fluent Forms forms) is excluded — no booking form, booking data, or booking-triggering UI should be added to the Astro target by this change. |
| WordPress administration | `wp-admin`, plugin/theme management, and any admin-only screens. |
| Private/internal surfaces | Anything not reachable as public content on the reference site (drafts, admin notices, staging-only pages, private plugin dashboards). |
| Plugin infrastructure | Elementor, Astra, Polylang, Yoast SEO, Koko Analytics, review widgets (Trustpilot/Google/TripAdvisor), Fluent Forms/Fluent SMTP, Akismet, and other installed WordPress plugins are migration *sources* for visible output only — their WordPress-side infrastructure, settings, and non-visual behavior are not ported. |
| Non-visual backend behavior | Analytics collection, SEO backend automation, spam filtering, and similar server-side plugin behavior are not replicated in Astro by this change. |
| WordPress source lifecycle | This change does not modify, upgrade, or decommission `wordpress/`; it only reads it (and the running reference) as a source. |

## Current-state gap (inventory findings)

- **Target is a rebranding stub, not real content.** `about.astro`, `contact.astro`,
  `pricing.astro`, `footer.astro`, and the `team` content collection still contain
  Astroship/web3templates placeholder copy; only `hero.astro` has real Cuban Trip
  Experience text. `astro.config.mjs` still points `site` at
  `astroship.web3templates.com`.
- **Source content is not in flat files.** The WordPress snapshot in `wordpress/`
  contains WP core, themes (Astra, default WP themes), and ~20 plugins as PHP/asset
  source, but actual page content and Elementor layouts are stored in the MariaDB
  database behind the running site, not as exportable static files. Content inventory
  for this migration must be done by browsing `http://localhost:8080/`, not by
  grepping `wordpress/`.
- **No dedicated booking plugin is installed**, but Fluent Forms / Fluent Forms Pro
  (`fluentform`, `fluentformpro`) is installed and commonly used for both general
  contact forms and reservation/booking-style forms. The reference site must be
  inspected to determine which specific form(s) on the public pages are
  booking/reservation forms (excluded) versus general contact/inquiry forms
  (in scope) — see the open question below.
- **Polylang + Connect Polylang for Elementor are installed**, and Polylang/Astra
  translation files exist for Spanish and Russian, suggesting the live public site may
  be multilingual. The target Astro app has no i18n setup today. Whether the source
  site actually serves multiple public languages, and whether that must be preserved,
  needs confirmation — see the open question below.
- **The target has no test runner** (`npm run build` is the only baseline
  verification per `openspec/config.yaml`), so parity checking for this change relies
  on build success plus manual responsive visual comparison against the reference URL.

## Risks

- **Scope creep into booking territory**: contact/inquiry forms and booking forms may
  share the same plugin (Fluent Forms) and similar UI on the source site, risking
  accidental migration of booking-adjacent copy or fields. Mitigation: treat any form
  whose purpose is scheduling/reserving a ride as excluded by default; only migrate
  forms clearly general-purpose (contact/inquiry) unless the user confirms otherwise.
- **Visual reference availability**: page content lives in the WordPress database via
  the running container; if `http://localhost:8080/` is not reachable during
  implementation, content/visual inventory cannot be completed accurately.
- **Missed multilingual requirement**: if the source site is actually multilingual and
  that is discovered late, the design may need rework to add Astro i18n routing.
- **Media licensing/size**: migrating all public media as-is may carry over
  unoptimized or oversized assets; target conventions (`astro:assets`/`@astrojs/image`,
  `sharp`) should be used rather than a raw file copy.

## Rollback

- This change only adds/replaces files inside `cubantripexperience/` (Astro target);
  it does not touch `wordpress/` or the database. If the migrated visual/content
  changes are unacceptable, revert the Astro target's affected commits/files via Git
  (the Astro app has its own Git history) — the WordPress source and running reference
  site are unaffected and remain available to re-derive the migration.
- No production deployment or DNS/cutover is implied by this proposal; WordPress
  continues to serve as the actual public site until a separate, later decision is
  made to cut over.

## Success criteria

- [ ] Every public page/section visible on `http://localhost:8080/` has a
      corresponding Astro route or component with matching real content (no
      Astroship/web3templates placeholder text remains on in-scope pages).
- [ ] Navigation, footer, and shared layout in Astro reflect the source site's public
      structure and responsive behavior.
- [ ] No booking/reservation UI, copy, or workflow exists in the Astro target as a
      result of this change.
- [ ] No `wp-admin` or other private/admin content is present in the Astro target.
- [ ] `npm install && npm run build` succeeds in `cubantripexperience/`.
- [ ] A manual responsive comparison (desktop + mobile) against
      `http://localhost:8080/` shows the migrated pages representing the same public
      experience.

## Confirmed product decisions

- Migrate the primary/default public language only; no Astro i18n or translated routes are added in this change.
- Show public forms, if needed for visual parity, as non-functional visual elements only; no submission endpoint or integration is added. Booking/reservation forms remain excluded entirely.
- Omit Trustpilot, Google, TripAdvisor, and other third-party review widgets/badges rather than recreating them as static or live integrations.
- Update the Astro title, canonical URL, and baseline Open Graph metadata from Astroship defaults to Cuban Trip Experience identity.
- The spec phase will inventory the complete default-language public route and section set from `http://localhost:8080/`.

## Out of scope for this change (non-goals)

- Any WordPress-side changes (plugins, themes, database, admin).
- Booking/reservation feature parity or implementation in Astro.
- Production cutover, DNS changes, or retiring the WordPress deployment.
- Adding a test runner/framework (not required by `openspec/config.yaml`'s
  `strict_tdd: false` setting for this project).
