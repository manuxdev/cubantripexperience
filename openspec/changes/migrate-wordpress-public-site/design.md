# Technical design: migrate WordPress public site

## 1. Design intent

The Astro application under `cubantripexperience/` will become a static, default-language representation of the public WordPress site served at `http://localhost:8080/`. WordPress is a design/content source only. The completed Astro build will not query WordPress, submit data, embed WordPress/plugin assets, or depend on the reference server at runtime.

The implementation will preserve the existing Astro 2, Tailwind CSS 3, and daisyUI stack. It will replace the Astroship page shell and placeholder modules rather than introduce another framework, CMS, form service, test runner, or client-side application layer.

### Hard boundaries

- Include only default-language public pages and sections.
- Exclude booking/reservation routes, fields, controls, copy, and behavior.
- Exclude locale-prefixed routes, translation data, and language switching.
- Exclude review content, badges, widgets, and embed scripts.
- Exclude backend form submission, analytics, spam filtering, or other integrations.
- Do not modify `wordpress/`, its database, containers, plugins, or themes.
- Do not implement production cutover or DNS changes.

## 2. Current-state constraints

The target currently has five routes (`/`, `/about`, `/contact`, `/pricing`, and `/404`), but route names and page purposes are Astroship scaffold assumptions rather than an authoritative migration map. Placeholder content remains in the home feature/logo/CTA modules, About team collection, Pricing data, Contact page, form, layout metadata, and footer. Navigation includes a hardcoded `localhost:3000` booking control and a nonfunctional language selector. The contact form contains both Web3Forms markup and a `fetch` submission handler.

The authoritative WordPress page content and Elementor section definitions live in the running database, so source-code inspection alone cannot establish route or content parity. The design therefore makes a frozen reference inventory the first implementation gate and keeps all resulting content local to Astro.

## 3. Architecture and data flow

```text
http://localhost:8080/ (read-only reference)
       |
       | implementation-time browser inventory at desktop and mobile widths
       v
change-local reference inventory + local content/media files
       |
       | typed imports and Astro component composition
       v
Astro build (no source-server calls)
       |
       v
static HTML/CSS/local optimized media
```

There is no runtime path back to WordPress. The reference URL may appear in the change-local inventory as provenance, but it must not be emitted into rendered HTML, CSS, JavaScript, canonical links, or media URLs.

### 3.1 Reference inventory mechanism

Implementation begins by creating `openspec/changes/migrate-wordpress-public-site/reference-inventory.md`. This is an implementation evidence document, not a runtime data source. Starting at the default-language home page, the implementer will inspect the header, footer, and all public navigation destinations at `http://localhost:8080/`, then follow their same-origin public links. Query strings, fragments, redirects, and trailing-slash variants are normalized to one logical source path.

The inventory contains one row per discovered route with:

- normalized source path and final target path;
- source navigation label and placement/order;
- disposition: migrate, infrastructure-only, or exclude;
- exclusion reason where applicable (booking/reservation, locale variant, review/widget, admin/private, or duplicate/redirect);
- source page title and section sequence;
- desktop/mobile ordering or visibility differences;
- visible copy ownership location in the target;
- used media, meaningful alt text, and intended local asset path;
- form classification (`none`, `general-contact-visual-only`, or `excluded-booking`);
- metadata observations and any source canonical public origin.

For each migrated page, a section checklist records heading hierarchy, paragraphs/lists, media placement, CTA label and destination, background/surface treatment, and responsive stacking. Booking-only pages and controls are documented as excluded evidence but never copied into application content modules.

The inventory is complete only when every default-language header/footer destination has a disposition, every retained route has a target path, every visible source asset has a local mapping, and no retained navigation destination points to an excluded row. This gate resolves whether scaffold routes such as `/pricing` are retained, renamed, or removed; filenames are not preserved merely because they already exist.

### 3.2 Runtime content boundaries

Application data is split by reuse level:

- `src/data/site.ts` owns brand name, default language, title suffix, default description, contact identity, social links that pass the scope filter, and footer text.
- `src/data/routes.ts` owns target route constants and the ordered desktop/mobile/footer navigation model. Only migrated routes are represented here.
- `src/data/pages/*.ts` owns repeated structured page data such as service/destination lists, feature rows, contact details, and local asset imports where those values are easier to audit as data.
- Page-specific prose and semantic section structure remain in route/section `.astro` files when extraction would obscure heading order or create a generic page-builder abstraction.

Suggested contracts are:

```ts
export type SiteMetadata = {
  title: string;
  description: string;
  image?: ImageMetadata;
  imageAlt?: string;
};

export type NavigationItem = {
  label: string;
  href: `/${string}` | "/";
  children?: readonly NavigationItem[];
};

export type ContactFormField = {
  id: string;
  label: string;
  kind: "text" | "email" | "tel" | "textarea" | "select";
  placeholder?: string;
  options?: readonly string[];
  autocomplete?: string;
};
```

`NavigationItem` is internal-route-only by design. External social/contact destinations use a separate type so they cannot accidentally enter the primary route inventory. Page modules import route constants rather than embedding `#`, `localhost`, or WordPress URLs.

## 4. Shared rendering architecture

### 4.1 Layout and metadata

`src/layouts/Layout.astro` remains the only document shell and will accept `title`, `description`, optional Open Graph image/alt, and optional body-class props. It will:

- set `<html lang>` to the reference site's default language, with no locale negotiation;
- generate the title from the page title plus Cuban Trip Experience suffix;
- derive canonical URLs from `Astro.site` and `Astro.url.pathname`;
- emit a Cuban Trip Experience description and Open Graph title, description, image, and image alt;
- import the global stylesheet and render a skip link, site header, `<main id="main-content">`, and site footer;
- remove Astroship metadata and the unnecessary view-transition layer unless the reference visibly requires equivalent transitions.

`astro.config.mjs` will replace the Astroship `site` value. The preferred value is the real HTTPS Cuban Trip Experience canonical origin observed in the default-language reference metadata. If the local reference exposes no trustworthy public origin, use the explicit non-production placeholder `https://cubantripexperience.example` and document it beside the config; never use localhost as the canonical basis.

`public/opengraph.jpg` and `public/favicon.svg` will be replaced with branded local media. Default Open Graph alt text will describe Cuban Trip Experience rather than a template screenshot.

### 4.2 Header, navigation, and footer

The current `navbar/navbar.astro` and `navbar/menus.astro` responsibilities will be replaced by a semantic shared header using the ordered model in `src/data/routes.ts`. Desktop and mobile render from the same data so labels and destinations cannot drift. The mobile menu may use existing `astro-navbar` behavior or native disclosure markup; it must require no new dependency and must expose keyboard focus, an accessible menu label, and a clear open/closed state.

Navigation rules are:

- Omit the current `Book` button, its `localhost:3000` destination, and every booking-oriented source control.
- Remove the flag/language menu completely.
- Do not disguise a booking destination by merely relabeling it.
- A source booking-style control may become a general `Contact` or other non-booking link only when the retained destination is independently present in the reference inventory and the new label states its real non-booking purpose.
- Omit direct-message controls such as WhatsApp if the reference uses them primarily to initiate reservations; retain only independently verified general contact/social-profile links.
- Use relative internal URLs, no placeholder `#` links, and active-route styling derived from `Astro.url.pathname`.

The footer renders only real site identity, retained public destinations, verified contact/social details, and any legal destinations actually present in the default-language reference. Astroship/Web3Templates attribution and unrelated contact values are removed.

### 4.3 Reusable page components

Reusable components represent stable visual patterns rather than Elementor widgets:

- `PageHero.astro`: optional eyebrow, heading, intro, local media, and non-booking link.
- `SectionHeading.astro`: semantic heading level, alignment, and constrained description.
- `MediaTextSection.astro`: alternating media/text layouts with explicit mobile ordering.
- `ContentGrid.astro` or focused service/destination card components where the inventory proves repetition.
- `ContactForm.astro`: visual-only general contact fields.
- `SiteHeader.astro`, `PrimaryNav.astro`, and `SiteFooter.astro`: shared shell.

Pages compose these primitives and page-specific sections directly. No universal schema attempts to reproduce arbitrary Elementor JSON. This keeps semantic markup reviewable and prevents WordPress implementation details from becoming Astro architecture.

## 5. Asset handling

Only media visibly used by retained default-language pages is migrated. During inventory, each source media item receives a semantic local filename and usage entry. The implementation will download/copy the original available file once, verify that it is not a review badge or plugin asset, and place it under:

- `src/assets/brand/` for logo/brand artwork;
- `src/assets/pages/<page>/` for content and background imagery processed at build time;
- `public/` only for fixed-path files such as favicon and the default Open Graph image.

Raster page images are statically imported and rendered through the existing `@astrojs/image` `Picture` component with explicit alt text, intrinsic dimensions/aspect ratio, and responsive `sizes`/width variants. Decorative imagery uses empty alt text only when it conveys no content. SVGs remain local and are sanitized before use. CSS background images must resolve from local imported/build assets or public paths.

The implementation must not hotlink `http://localhost:8080/`, WordPress uploads, Elementor/Astra CSS/JS, plugin resources, review graphics, or arbitrary third-party placeholders. Oversized source files should be converted to suitable WebP/JPEG variants through the existing Sharp-backed image pipeline rather than copied into every route unchanged. Asset deletion includes unused Astroship logo, hero, social, and Open Graph files after all imports are reconciled.

## 6. Styling and responsive behavior

Styling remains Tailwind CSS 3 plus the existing daisyUI installation. A new `src/styles/global.css`, imported once by `Layout.astro`, will define reset-level behavior, CSS custom properties for the observed brand palette, typography defaults, focus treatment, selection color, and small cross-page utilities. `tailwind.config.cjs` will expose those measured colors, font family, container widths, spacing/radius values, and coherent shadows as named theme tokens; the currently misplaced `boxShadow` nesting will be corrected.

The source's computed typography and colors are recorded during inventory and translated into local tokens. Fonts are served locally only when the source font files are available and licensed; otherwise the closest existing/system stack is used and the visual variance is documented. Elementor/Astra stylesheets are never copied. Tailwind classes control component-level layout, state, and responsive behavior.

Responsive implementation uses mobile-first rules with the target's existing `sm`, `md`, and `lg` breakpoints. The parity checks focus on:

- header/logo scale and navigation collapse;
- source-equivalent content order on narrow screens;
- readable text width (approximately 60–70 characters for prose);
- fluid media with reserved aspect ratios;
- bounded desktop containers instead of fixed margins such as `mx-[105px]`;
- touch targets, visible focus rings, hover/pressed feedback, and no horizontal overflow;
- optical spacing matching the source without fixed `100vh` assumptions on mobile.

Animations are limited to source-supported, low-cost opacity/transform transitions and respect `prefers-reduced-motion`. Visual parity takes precedence over decorative redesign patterns.

## 7. Forms

A general contact/inquiry form is included only if the reference inventory identifies one. `ContactForm.astro` receives a field list copied from that non-booking source form and renders labels, inputs, and visual styling for parity. It intentionally has:

- no `action`, `method`, hidden access key, endpoint, or service-specific field;
- no submit event listener, `fetch`, form serialization, result state, or network code;
- a final control with `type="button"` and `aria-disabled="true"`, styled consistently but incapable of native submission;
- no date/time picker, passenger count, pickup/drop-off, trip selection, reservation wording, or booking CTA.

The existing Web3Forms comments, endpoint, access-key field, bot-check field, inline validation/submission script, and result element are deleted. Visible field labels/placeholders match the reference general contact form. If the reference has only booking/reservation forms, no form component is rendered at all; the contact page contains only verified public contact information.

## 8. Route and page rollout

Implementation proceeds in page-level slices while WordPress remains untouched:

1. **Freeze inventory:** complete the route/section/asset/form matrix and resolve every scaffold route's disposition before page implementation.
2. **Foundation:** add site/route data, theme tokens, global styles, local brand assets, metadata contract, header/navigation, footer, and skip/main structure.
3. **Home:** replace all existing home modules in source section order; remove Astro framework features, technology logos, experimental color panels, and generic CTA content.
4. **Retained primary pages:** implement one route at a time in inventory/navigation order, using exact source paths and local page sections. Rename/remove `/pricing` if the source equivalent is Services, Destinations, or absent.
5. **Contact:** replace placeholder identity and include only the visual-only general form treatment described above.
6. **404 and cleanup:** restyle `404.astro` within the shared shell, remove unused pricing/team/content-collection/template components and assets, and confirm no orphan routes remain.

A page slice is complete only when its local assets, metadata, desktop/mobile comparison, links, and exclusion checks pass. There is no production traffic switch in this rollout; rollback is a normal revert of target-app commits, with WordPress continuing as the reference surface.

## 9. Planned file changes

Exact route filenames beyond the known infrastructure page are determined by the frozen inventory, but the ownership pattern is fixed:

| Path | Change |
|---|---|
| `cubantripexperience/package.json`, `package-lock.json` | Rename the inherited package identity while preserving scripts/dependencies; refresh the npm lockfile through the normal install. |
| `cubantripexperience/astro.config.mjs` | Replace Astroship site identity; keep only required existing integrations. |
| `cubantripexperience/tailwind.config.cjs` | Add source-derived design tokens and correct theme structure. |
| `cubantripexperience/src/styles/global.css` | Add shared brand, typography, focus, and layout foundations. |
| `cubantripexperience/src/data/site.ts` | Add site identity, metadata defaults, verified contact/social data. |
| `cubantripexperience/src/data/routes.ts` | Add typed retained-route constants and ordered navigation. |
| `cubantripexperience/src/data/pages/*.ts` | Add auditable repeated content for retained pages as needed. |
| `cubantripexperience/src/layouts/Layout.astro` | Replace metadata contract and document shell. |
| `cubantripexperience/src/components/layout/*` | Add/replace shared header, nav, footer, and shell primitives. |
| `cubantripexperience/src/components/sections/*` | Add only repeated source-derived section patterns. |
| `cubantripexperience/src/components/contactform.astro` | Replace Web3Forms implementation with visual-only markup, or remove if no general form exists. |
| `cubantripexperience/src/pages/**/*.astro` | Reconcile routes and implement retained page compositions plus branded 404. |
| `cubantripexperience/src/assets/**`, `public/**` | Add optimized source media; replace template favicon/OG art; delete unused placeholder assets. |
| `cubantripexperience/src/content/team/**`, `src/content/config.ts` | Remove placeholder team collection if no retained reference content requires a collection. |
| Existing `components/home/*`, `components/navbar/*`, `components/pricing.astro` | Rewrite into the new boundaries or delete when no retained route/section imports them. |
| `openspec/changes/migrate-wordpress-public-site/reference-inventory.md` | Record implementation-time source provenance, route decisions, assets, and parity evidence. |

No files under `wordpress/` are modified.

## 10. Validation plan

### 10.1 Build and static inspection

From `cubantripexperience/`:

```sh
npm install
npm run build
```

No test framework is added. The build must enumerate every retained inventory route and complete without missing local assets or invalid component imports. Inspect `dist/` and source for:

- Astroship/Web3Templates names, domains, contact values, generic team/pricing/technology copy;
- `api.web3forms.com`, access keys, form `fetch` calls, and any other submission endpoint;
- booking/reservation labels and fields, including date/time, passenger, pickup/drop-off, and trip selectors;
- `localhost:3000`, rendered `localhost:8080`, WordPress upload URLs, Elementor/Astra assets, and placeholder `href="#"` navigation;
- locale-prefixed routes, language controls, and review widget/badge scripts or graphics.

Review the generated sitemap and built page directories against every `migrate` row in the inventory. Check every internal header/footer/page link against the retained route list and verify excluded rows have no route or UI entry point.

### 10.2 Visual and responsive comparison

Run the Astro target locally on its normal non-8080 port while the WordPress source remains at `http://localhost:8080/`. For every retained route, compare source and target at minimum at:

- desktop: `1440 × 900`;
- mobile: `390 × 844`.

Capture equivalent full-page screenshots and section-level views. Compare section order, copy, heading hierarchy, colors, typography scale/line-height, container widths, image crops, spacing, header/footer behavior, mobile stacking, and overflow. Also inspect an intermediate tablet width around `768px` for breakpoint regressions. Differences caused by excluded booking, locale, or review surfaces are expected and should be noted in the inventory rather than recreated.

### 10.3 Interaction and accessibility checks

- Navigate the entire header, mobile disclosure, links, and visual form with a keyboard; focus remains visible and reading order is logical.
- Confirm the current route is identifiable and the mobile menu opens/closes without trapping focus.
- Activate the visual-only form control with browser DevTools Network open and verify that no request, navigation, or form service call occurs.
- Verify meaningful images have source-derived alt text, decorative images are ignored, headings do not skip structure, the skip link reaches `<main>`, and page zoom does not create horizontal scrolling.
- Request an unmatched path and verify the branded shared-shell 404 behavior in the deployed/static-host environment.

## 11. Risks and mitigations

- **Incomplete source discovery:** database-backed pages can be missed by source greps. Mitigation: route closure is based on the running default-language navigation and checked against header/footer/in-page destinations before implementation.
- **Booking content disguised as contact:** direct-message and Fluent Forms controls may look generic. Mitigation: classify purpose before migration and exclude ambiguous ride/trip scheduling controls by default.
- **Reference drift during implementation:** WordPress content can change. Mitigation: timestamp the inventory and screenshot comparison set; use that frozen observation for the change.
- **Remote media leakage:** copied markup may retain upload URLs. Mitigation: require an asset-ledger entry and static local import for every retained image.
- **Canonical-domain uncertainty:** localhost does not establish production identity. Mitigation: use a verified source canonical origin or the documented `.example` placeholder, never guess a live domain.
- **Template remnants in unreachable files:** old components may survive even when not rendered. Mitigation: delete orphan scaffold modules/content and run source as well as `dist/` searches.

## 12. Design decisions summary

1. WordPress is an implementation-time reference only; Astro output is fully local and static.
2. A checked-in change-local inventory gates route creation and records explicit exclusions.
3. Shared identity/routes live in typed data, while semantic page composition remains in Astro components.
4. Existing Astro/Tailwind/daisyUI conventions are retained; Elementor/Astra artifacts are not ported.
5. General contact forms are visual-only markup with a non-submitting button and no JavaScript or endpoint.
6. Booking controls, language controls, and review surfaces are removed rather than simulated.
7. Validation combines the existing npm build with route/static audits and paired desktop/mobile visual comparison.
