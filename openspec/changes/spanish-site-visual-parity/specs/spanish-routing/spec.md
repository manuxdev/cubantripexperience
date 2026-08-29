# Spanish Routing Specification

## Purpose

Define the URL surface for the Spanish site and the guarantee that the existing
English site is unaffected. The WordPress source serves English at `/` and Spanish
at `/es/`; the migration mirrors that structure rather than restructuring it.

## Requirements

### Requirement: Spanish pages are served under `/es/`

Every one of the eleven Spanish pages MUST be reachable under an `/es/`-prefixed
route, with `inicio` at `/es/`. Route mapping follows the per-page table in
`reference/es/README.md`, prefixed with `/es`.

#### Scenario: Each slug resolves under the prefix

- GIVEN the built Astro site
- WHEN `/es/`, `/es/servicios`, `/es/destinos`, `/es/destinos/la-habana`,
  `/es/destinos/trinidad`, `/es/destinos/cienfuegos`, `/es/destinos/matanzas`,
  `/es/destinos/santiago-de-cuba`, `/es/destinos/pinar-del-rio`, `/es/contactos`,
  and `/es/reservar` are requested
- THEN each returns its corresponding Spanish page

#### Scenario: Internal links stay relative and in-locale

- GIVEN a Spanish page links to another Spanish page
- WHEN the link is inspected
- THEN its href is a relative `/es/...` path, not an
  `http://localhost:8080/...` WordPress URL

### Requirement: English routes are unchanged

Existing English routes at `/` MUST continue to build and render exactly as before
this change. No English page file, route, or rendered output may be modified as a
side effect of adding the Spanish site.

#### Scenario: English route set preserved

- GIVEN the English routes that exist before this change
- WHEN the site is rebuilt after Spanish pages are added
- THEN every English route still resolves and its rendered output is unchanged

#### Scenario: English regression is a failure

- GIVEN an English route captured as a baseline before shared code is touched
- WHEN it is re-captured afterwards and diffed against that baseline per
  `visual-parity-verification`
- THEN any breakpoint exceeding the `height` or `pixels` tolerance is a
  regression, the change FAILS, and the shared code is made additive instead

### Requirement: Destination detail pages use one dynamic route

The six destination detail pages MUST be produced by a single dynamic route,
`src/pages/es/destinos/[slug].astro`, backed by one destination data array. Six
duplicated page files MUST NOT be created.

#### Scenario: One route file, six pages

- GIVEN `src/pages/es/destinos/`
- WHEN its contents are listed
- THEN it contains exactly one page file, `[slug].astro`, and no per-destination
  `.astro` files

#### Scenario: Destination content lives in data

- GIVEN a destination's sections, copy, and images
- WHEN a new destination entry is added to the data array
- THEN its page is generated with no change to the route template

### Requirement: No locale negotiation, redirect, or switcher

The system MUST NOT add locale detection, automatic redirects between `/` and
`/es/`, or a language-switcher control. Shared per-language navigation data lives
in `src/i18n/`, which is extended rather than replaced.

#### Scenario: No redirect on locale-preferring request

- GIVEN a request to `/` with an `Accept-Language: es` header
- WHEN it is served
- THEN the English home page is returned with no redirect to `/es/`

### Requirement: No booking or admin surfaces introduced

`/es/reservar` MUST be migrated as a visual page only. No booking workflow,
reservation backend, `wp-admin`, or other private WordPress surface may be
introduced by any Spanish route.

#### Scenario: Reserve page is visual only

- GIVEN `/es/reservar` renders
- WHEN its interactive elements are exercised
- THEN no booking or reservation workflow is initiated
