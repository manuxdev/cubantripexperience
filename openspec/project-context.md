# Cuban Trip Experience — SDD Project Context

Initialized: 2026-08-26

## Intent

Migrate the entire public site's visual layer and current public content from the local WordPress source into the Astro target. Use `http://localhost:8080/` as the visual reference while the local WordPress environment is running.

## Scope boundaries

Included:

- Public-facing pages, navigation, shared layout, responsive presentation, media, and current public content.
- Visual parity work needed to represent the source site's public experience in Astro.

Explicitly excluded:

- Booking plugins and booking workflows/functionality.
- WordPress administration and other private/admin surfaces.
- Any booking behavior merely present in the source backup or plugin assets.

## Workspace layout

- `wordpress/`: WordPress source snapshot and public-site backup data.
- `cubantripexperience/`: Astro target application.
- `docker-compose.yml`: local WordPress 6.8 / PHP 8.2 Apache and MariaDB environment, exposing WordPress at port 8080.

## Stack and conventions observed

### Source

- WordPress 6.8 container with PHP 8.2 and MariaDB 11.8.
- Astra 4.1.6 theme.
- Elementor and Pro Elements are present, with cached Elementor CSS and uploaded media.
- Polylang, SEO, forms, analytics, and review-related plugins are present.
- Booking-related assets/plugins are present in the source snapshot and remain excluded from migration.

### Target

- Astro `^2.9.7`, ESM project, with Tailwind CSS 3, daisyUI, Astro Image, MDX, sitemap, and `astro-seo`.
- Inter Variable is installed and imported by the shared layout.
- Routes currently include `/`, `/about`, `/contact`, `/pricing`, and `/404`.
- Components are organized under `src/components`, with home and navbar subdirectories; shared shell is `src/layouts/Layout.astro`.
- Content collections currently contain team Markdown entries.
- No test script or test runner is configured in `cubantripexperience/package.json`; baseline verification is `npm run build` after dependencies are installed.

## SDD configuration

- Artifact store: `both` (OpenSpec files plus Engram memory when the provider is available).
- `strict_tdd`: `false`; this is a visual/content migration and no test runner currently exists.
- Phase rules and testing details are recorded in `openspec/config.yaml`.
- This initialization intentionally does not create a proposal, specification, design, or task plan.

## Initialization verification

- `.atl/skill-registry.md` already exists.
- CodeGraph was unavailable through the configured MCP gateway; structural inspection therefore used targeted filesystem reads after the required availability check.
- The target build was attempted from `cubantripexperience/` and could not run because dependencies are not installed (`astro: command not found`).
- `http://localhost:8080/` is currently reachable and served the WordPress reference site (HTTP 200, Apache/PHP 8.2).
- The workspace root and source snapshot are not Git repositories; the Astro target has its own Git metadata.
