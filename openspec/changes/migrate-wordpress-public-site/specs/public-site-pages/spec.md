# Public Site Pages Specification

## Purpose

Define the observable routing, content-parity, navigation, media, and visual-parity
behavior the Astro target (`cubantripexperience/`) MUST exhibit once the real Cuban
Trip Experience public site (currently served by WordPress at
`http://localhost:8080/`) replaces the Astroship placeholder. The running reference
site is authoritative for content and layout because page copy and Elementor layouts
live in the WordPress database, not in `wordpress/` source files.

Booking/reservation workflows, WordPress administration, private/admin surfaces,
i18n/translated routes, and third-party review widgets are explicitly out of scope
(see `Explicitly out of scope` in the proposal) and MUST NOT appear as a result of
this change.

## Requirements

### Requirement: Route parity for public pages

The system MUST provide an Astro route for every distinct public page or section
reachable through the reference site's default-language public navigation, excluding
any booking/reservation or admin/private page.

#### Scenario: Reference page has an Astro route

- GIVEN a page is reachable via the reference site's (`http://localhost:8080/`)
  public navigation in the default language
- AND that page is not a booking/reservation or admin/private page
- WHEN the Astro target is built and served
- THEN a corresponding route exists under `cubantripexperience/src/pages` (or a
  nested path) that renders content representing that page

#### Scenario: Baseline scaffold routes are reconciled against the reference

- GIVEN the current Astro scaffold routes `/`, `/about`, `/contact`, `/pricing`,
  and `/404`
- WHEN each is mapped against the reference site's public navigation
- THEN every scaffold route with a real public-page equivalent on the reference
  site is retained (renamed or restructured as needed to match the reference
  site's structure)
- AND any scaffold route with no reference-site public equivalent is either
  removed or is justified as necessary site infrastructure (e.g. `404`)

### Requirement: No Astroship placeholder content remains

In-scope public routes MUST NOT present Astroship/Web3Templates placeholder
content, including but not limited to the strings "Astroship",
`hello@astroshipstarter.com`, `web3templates.com`/`astroshipstarter.com`, the
generic team entries under `cubantripexperience/src/content/team`, and the
generic SaaS pricing tiers (`Personal`/`Startup`/`Enterprise` with SaaS-style
feature lists).

#### Scenario: In-scope page content is inspected

- GIVEN an in-scope public route in the migrated Astro target
- WHEN its rendered content is inspected
- THEN no Astroship/Web3Templates placeholder strings, generic team entries, or
  generic SaaS pricing copy remain

### Requirement: Navigation reflects the reference site's public structure

The shared navigation (header nav and any footer navigation) MUST expose the same
set of public destinations as the reference site's default-language public
navigation, excluding booking-only entries and any admin link. Presentation
(order, grouping, responsive collapse behavior) MAY adapt to the target's
Tailwind/daisyUI conventions as long as every reachable public destination on the
reference site has an equivalent entry point in the migrated navigation.

#### Scenario: Navigation entry maps to a real public page

- GIVEN a navigation entry in the migrated header or footer
- WHEN its destination is followed
- THEN it resolves to an in-scope Astro route representing a real public page from
  the reference site, not a placeholder anchor (`#`) or a hardcoded non-relative
  URL such as a `localhost` port

#### Scenario: No booking-triggering navigation element

- GIVEN the migrated navbar and footer
- WHEN rendered
- THEN no link, button, or CTA (regardless of label) initiates, advertises, or
  navigates toward a booking/reservation flow; any pre-existing "Book"-style CTA
  is either removed or repointed to an in-scope, non-booking public page and
  relabeled to match that page's real purpose

### Requirement: Responsive layout parity with the reference site

The shared layout (header, footer, and page containers) MUST render a responsive
public experience at common mobile and desktop viewport widths consistent with the
reference site's responsive public behavior.

#### Scenario: Desktop and mobile comparison

- GIVEN the migrated Astro target rendered at a desktop viewport width and a
  mobile viewport width
- WHEN each is compared to the reference site (`http://localhost:8080/`) at the
  same viewport class
- THEN navigation collapse/expand behavior, content stacking order, and overall
  spacing/typography sequencing represent the same public experience

### Requirement: Media uses target asset conventions

Public media actually used by in-scope pages MUST be included through the Astro
target's asset conventions (`astro:assets`, `@astrojs/image`, `src/assets`, or
`public/`) rather than by referencing WordPress upload paths or the reference
site's URLs directly.

#### Scenario: Image sourced from target assets

- GIVEN a public page that displays media also shown on the reference site
- WHEN the corresponding Astro page renders that media
- THEN the image is served through the Astro image pipeline from `src/assets` or
  `public/`, not from a `wordpress/` upload path or an `http://localhost:8080/`
  (or other WordPress-hosted) URL

### Requirement: Visual parity through existing target styling conventions

Colors, typography, spacing, and component structure on migrated pages MUST
represent the reference site's public look and MUST be expressed using the
target's existing Tailwind CSS/daisyUI conventions, without importing Elementor or
Astra CSS/JS assets wholesale.

#### Scenario: No Elementor/Astra assets imported

- GIVEN the migrated Astro target's source and production build output
- WHEN they are inspected for stylesheet and script imports
- THEN no Elementor or Astra CSS/JS files are imported or bundled

### Requirement: No booking, admin, or private surfaces introduced

The system MUST NOT introduce any route, component, copy block, or link
representing a booking/reservation workflow, `wp-admin`, or other non-public/
private WordPress content (drafts, admin notices, staging-only pages, private
plugin dashboards).

#### Scenario: Booking-only or private surface excluded from the route inventory

- GIVEN a page, section, or plugin-driven surface on the source site that is
  booking-only, `wp-admin`, or otherwise non-public/private
- WHEN the public route inventory for the Astro target is built
- THEN no corresponding Astro route, component, or link is created for it

### Requirement: Public 404 experience is retained

The system MUST provide a public not-found page for unmatched routes, styled
consistently with the rest of the migrated site's shared layout.

#### Scenario: Unmatched route is requested

- GIVEN a request to a route not defined in the Astro target
- WHEN it is served
- THEN a `404` page renders a not-found experience using the migrated site's
  shared layout, navigation, and footer

### Requirement: No i18n routing or third-party review widgets are introduced

The system MUST NOT add Astro i18n routing or translated route variants, and MUST
NOT recreate third-party review widgets or badges (Trustpilot, Google,
TripAdvisor, or similar) as static or live integrations, even where the source
site's Polylang configuration or plugin set suggests such elements exist there.

#### Scenario: Single-language route set only

- GIVEN the migrated Astro target's full route set
- WHEN inspected
- THEN every in-scope route represents only the default/primary language, with no
  locale-prefixed route variants and no language-switcher that changes rendered
  content

#### Scenario: No third-party review widget embeds

- GIVEN any in-scope public page in the migrated Astro target
- WHEN rendered
- THEN no Trustpilot, Google, TripAdvisor, or similar third-party review widget,
  badge, or embed script is present
