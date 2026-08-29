# Frozen live reference inventory — Cuban Trip Experience

- **Reference:** `http://localhost:8080/` (read-only WordPress source)
- **Frozen at:** `2026-08-26T18:39:49Z`
- **Scope:** default-language (`en`) public pages reached from the home header/footer and same-origin page links. WordPress, locale variants, booking, review widgets/badges, and private/admin surfaces are not migration targets.
- **Capture method:** `curl` inspection of source HTML, titles, canonical links, headings, visible controls, and responsive markup. Screenshot capture is not available in this runtime; screenshots were **not captured**. The structural/responsive observations below are the required equivalent notes and must be used for later 1440×900 and 390×844 visual comparison.

## Normalization and source navigation

Canonical source origin observed on every retained row is `http://localhost:8080` (local provenance only; it must never be emitted by Astro). Normalize query strings and fragments away, add a trailing slash, and use the page canonical when it differs in case. Thus `/services#servicio` → `/services/`, `/matanzas` → `/matanzas/`, `/Trinidad/` → `/trinidad/`, and `/Havana/` → `/havana/`.

Default-language header and footer navigation are identical: **1** Destinations (`/destinations/`), **2** Services (`/services/`), **3** Contact us (`/contact-us/`), **4** Bookings (`/bookings/`, excluded). The header additionally shows a `Book` CTA to the excluded booking path. The page shell duplicates navigation markup for desktop/mobile; later implementation must render one ordered data model and omit the booking item/CTA.

## Route matrix

`Copy owner` is the intended target location; `asset IDs` resolve to the local mapping ledger below. “Source label/order” records the default-language nav position or the first in-page discovery position. Metadata on all retained rows: source title and canonical match the row; `og:locale=en_US`; home advertises `ru_RU`/`es_ES` alternates (excluded); no trustworthy HTTPS canonical was exposed.

| Normalized source path | Target path | Disposition / reason | Source label / order | Title and section sequence | Desktop/mobile structural note | Copy owner | Media + alt + intended local path | Form class / metadata |
|---|---|---|---|---|---|---|---|---|
| `/` | `/` | **migrate** | Home/logo; first source page | `Cuban Trip Experience \| Taxi Service in Cuba`; hero → group-distance intro → why cards → repeated group-distance block → Cuba destination intro → destination cards → testimonials (**exclude**) → footer | Header has duplicated desktop/mobile nav markup; group-distance content appears in two source variants; destination cards must stack on narrow screens. | `src/pages/index.astro`, `src/data/pages/home.ts` | `brand-logo`, `home-hero`, `home-havana`, `home-wordmark`; review image `home-trustpilot` excluded | `none`; canonical `/`; description/OG title describe taxi service and OG image is `home-hero` |
| `/destinations/` | `/destinations/` | **migrate** | Header/footer Destinations, **1** | `Cuban Trip Experience \| Destinations`; page title → introduction → Popular Places → six destination cards (Pinar, Matanzas, Havana, Trinidad, Cienfuegos, Santiago) → footer | Shared nav collapses by source breakpoint; six cards are the responsive content unit and preserve source order. | `src/pages/destinations.astro`, `src/data/pages/destinations.ts` | `brand-logo`, `dest-pinar`, `dest-matanzas`, `dest-havana`, `dest-trinidad`, `dest-cienfuegos`, `dest-santiago`, `footer-mark` | `none`; canonical `/destinations/` |
| `/services/` | `/services/` | **migrate** | Header/footer Services, **2**; home CTA | `Cuban Trip Experience \| Services`; page title → Types of Vehicles (fragment tabs) → Standard/Vans/Clasic cards → booking CTA (**exclude**) → professionalism → destination CTA → footer | Fragment tab links normalize to this route; vehicle cards require responsive stacking, while the booking CTA is omitted. | `src/pages/services.astro`, `src/data/pages/services.ts` | `brand-logo`, `service-standard`, `service-van`, `service-classic`, `footer-mark` | `none`; canonical `/services/` |
| `/contact-us/` | `/contact-us/` | **migrate** | Header/footer Contact us, **3** | `Cuban Trip Experience \| Contact us`; page title → Send a message Fluent Form → help/contact text → repeated Send a message form → footer | Source duplicates the same visual contact form; keep one visually equivalent, mobile single-column form and contact block. | `src/pages/contact-us.astro`, `src/data/pages/contact.ts`, `src/components/ContactForm.astro` | `brand-logo`, `footer-mark` | `general-contact-visual-only`; Fluent Form 8 fields: First Name, Email Address, Your Message; canonical `/contact-us/` |
| `/pinar-del-rio/` | `/pinar-del-rio/` | **migrate** | Home/destinations card; destination sequence **1** | `Cuban Trip Experience \| Pinar del Río`; page title → Viñales → Terrazas → Soroa → Indian Cave → Levisa Fell → next destination → booking CTA (**exclude**) → footer | Landmark sections are image-led and retain this sequence; stack image/text vertically on mobile. | `src/pages/pinar-del-rio.astro`, `src/data/pages/pinar-del-rio.ts` | `brand-logo`, `pinar-vinales`, `pinar-terrazas`, `pinar-soroa`, `pinar-indian-cave`, `pinar-levisa`, `footer-mark` | `none`; canonical `/pinar-del-rio/` |
| `/matanzas/` | `/matanzas/` | **migrate** | Home/destinations card; destination sequence **2** | `Cuban Trip Experience \| Matanzas`; page title → Sauto Theater → Liberty Park → Canimar River → Saturn Cave → Varadero Beach → prev/next → booking CTA (**exclude**) → footer | Landmark sections are image-led; preserve adjacent destination links and mobile vertical reading order. | `src/pages/matanzas.astro`, `src/data/pages/matanzas.ts` | `brand-logo`, `matanzas-sauto`, `matanzas-liberty`, `matanzas-canimar`, `matanzas-saturn`, `matanzas-varadero`, `footer-mark` | `none`; canonical `/matanzas/` |
| `/havana/` | `/havana/` | **migrate** | Home/destinations card; destination sequence **3** | `Cuban Trip Experience \| Havana`; page title → Old Havana → El Malecon → The Capitol → The Colon Cemetery → El Morro and La Cabaña → prev/next → booking CTA (**exclude**) → footer | Landmark sections are image-led; preserve landmark order and narrow-screen image/text stacking. | `src/pages/havana.astro`, `src/data/pages/havana.ts` | `brand-logo`, `havana-old`, `havana-malecon`, `havana-capitol`, `havana-colon`, `havana-morro`, `footer-mark` | `none`; canonical `/havana/` |
| `/trinidad/` | `/trinidad/` | **migrate** | Home/destinations card; destination sequence **4** | `Cuban Trip Experience \| Trinidad`; page title → Main Square → Valley of the Sugar Mills → Ancon Beach → Church of the Holy Trinity → Romantic Museum → prev/next → booking CTA (**exclude**) → footer | Landmark sections are image-led; source case variant `/Trinidad/` resolves here; stack on mobile. | `src/pages/trinidad.astro`, `src/data/pages/trinidad.ts` | `brand-logo`, `trinidad-square`, `trinidad-sugar-mills`, `trinidad-ancon`, `trinidad-church`, `trinidad-museum`, `footer-mark` | `none`; canonical `/trinidad/` |
| `/cienfuegos/` | `/cienfuegos/` | **migrate** | Home/destinations card; destination sequence **5** | `Cuban Trip Experience \| Cienfuegos`; page title → El Malecon → Thomas Terry Theater → Purest Conception Cathedral → Valley Palace → El Nicho → prev/next → booking CTA (**exclude**) → footer | Landmark sections are image-led; preserve source sequence and mobile vertical stacking. | `src/pages/cienfuegos.astro`, `src/data/pages/cienfuegos.ts` | `brand-logo`, `cienfuegos-malecon`, `cienfuegos-theater`, `cienfuegos-cathedral`, `cienfuegos-palace`, `cienfuegos-nicho`, `footer-mark` | `none`; canonical `/cienfuegos/` |
| `/santiago-cuba/` | `/santiago-cuba/` | **migrate** | Home/destinations card; destination sequence **6** | `Cuban Trip Experience \| Santiago de Cuba`; page title → Catedral → Great Stone → Castillo de San Pedro de la Roca del Morro → Sierra Maestra → El Salto del Caburni → previous → booking CTA (**exclude**) → footer | Landmark sections are image-led; preserve source sequence and mobile vertical stacking. | `src/pages/santiago-cuba.astro`, `src/data/pages/santiago-cuba.ts` | `brand-logo`, `santiago-cathedral`, `santiago-stone`, `santiago-castle`, `santiago-sierra`, `santiago-caburni`, `footer-mark` | `none`; canonical `/santiago-cuba/` |
| `/bookings/` | — | **exclude** — reservation workflow | Header/footer Bookings, **4**; all `Book`/`BOOK NOW` CTAs | `Cuban Trip Experience \| Bookings`; instructions → multi-step Fluent Form 5 → booking information | Do not reproduce at any breakpoint. | — | no migration mapping | `excluded-booking`; Fluent Form 5 includes vehicle, date/time, passenger, pickup/airport/flight/address fields |
| `/contacts-us/` | — | **exclude** — broken same-origin link, source 404 | Booking page “CONTACT US” CTA | `Página no encontrada \| Cuban Trip Experience` | Do not preserve the broken target. | — | no migration mapping | `none`; source 404 only |
| `/ru/`, `/es/`, and linked localized paths | — | **exclude** — locale/i18n variants | language selector/alternate metadata | localized titles/pages | Do not reproduce language selector or locale route at any breakpoint. | — | no migration mapping | `none`; `ru_RU` and `es_ES` are source alternates |
| `/wp-admin/`, `/wp-json/`, feeds, plugin/widget URLs | — | **exclude** — admin/private or infrastructure endpoint | metadata/runtime discovery only | not public content pages | Never expose in target navigation. | — | no migration mapping | `none`; review/Elementor/WordPress resources excluded |

## Local asset mapping ledger

All source image `alt` values below were empty unless stated. Empty source alt is not permission to omit meaningful destination alt: the planned local alt supplies the observed landmark meaning; `footer-mark` is decorative. Do not copy WordPress URLs, review graphics, Elementor assets, or source CSS.

| ID | Source filename (under `wp-content/uploads/2023/07/` unless noted) | Source alt → intended local asset and alt |
|---|---|---|
| `brand-logo` | `cropped-my-project-1-3-removebg-preview-1.webp` | `src/assets/brand/cuban-trip-experience-logo.webp`; **Cuban Trip Experience** |
| `footer-mark` | `my-project-1-5-removebg-preview-e1689543311722.webp` | `src/assets/brand/cuban-trip-experience-mark.webp`; decorative (`""`) |
| `home-hero` | `Diseno-sin-titulo.webp` | `src/assets/pages/home/taxi-in-cuba.webp`; **Taxi traveling in Cuba** |
| `home-havana` | `Cuba-Havana_-The-Best-18-Things-to-See-Do.webp` | `src/assets/pages/home/havana-destination.webp`; **Havana destination** |
| `home-wordmark` | `a-2023-07-16-160016-removebg-preview.webp` | `src/assets/brand/cuban-trip-experience-wordmark.webp`; decorative (`""`) |
| `home-trustpilot` | `2023/09/3-1.webp` | **Excluded** review badge/widget artwork |
| `dest-pinar` | `Vinales-Valley_-Pinar-del-Rio_-Cuba_.webp` | `src/assets/pages/destinations/pinar-del-rio.webp`; **Viñales Valley, Pinar del Río** |
| `dest-matanzas` | `2616ce97-6d4e-414c-8bb7-d6d0524314e1-e1689574515704.webp` | `src/assets/pages/destinations/matanzas.webp`; **Matanzas destination** |
| `dest-havana` | `cuba-mia-la-floridita-havana-vieja.webp` | `src/assets/pages/destinations/havana.webp`; **Old Havana** |
| `dest-trinidad` | `one-in-cuba-blonde-brunette-travel.webp` | `src/assets/pages/destinations/trinidad.webp`; **Trinidad, Cuba** |
| `dest-cienfuegos` | `malec195179n-de-cienfuegos-cuba.webp` | `src/assets/pages/destinations/cienfuegos.webp`; **Cienfuegos Malecón** |
| `dest-santiago` | `ba-cuba-attractions-lonely-planet-e1689714900146.webp` | `src/assets/pages/destinations/santiago-de-cuba.webp`; **Santiago de Cuba** |
| `service-standard` | `replicate-prediction-v3yn5zbbaanuia5fq7u553zzw4-removebg-preview-2-e1689204954148.webp` | `src/assets/pages/services/standard-taxi.webp`; **Standard taxi** |
| `service-van` | `replicate-prediction-25fscjzb4ju557qmxo4mmzhbdy-removebg-preview-1-e1689205842131.webp` | `src/assets/pages/services/taxi-van.webp`; **Taxi van** |
| `service-classic` | `Pink_Car_in_Havana_Cuba-removebg-preview-removebg-preview-1-e1689205010333.webp` | `src/assets/pages/services/classic-taxi.webp`; **Classic taxi in Havana** |
| `pinar-vinales`, `pinar-terrazas`, `pinar-soroa`, `pinar-indian-cave`, `pinar-levisa` | `Vinales-Valley_-Pinar-del-Rio_-Cuba_.webp`; `istockphoto-652793230-612x612-1.webp`; `Soroa-Province-of-Havana-Cuba.webp`; `istockphoto-1216799982-612x612-1.webp`; `Pristine_-Cayo-Levisa-Cuba.webp` | `src/assets/pages/pinar-del-rio/{vinales,terrazas,soroa,indian-cave,cayo-levisa}.webp`; **Viñales Valley / Las Terrazas / Soroa / Indian Cave / Cayo Levisa** |
| `matanzas-sauto`, `matanzas-liberty`, `matanzas-canimar`, `matanzas-saturn`, `matanzas-varadero` | `ena-y-medio-plaza-de-la-vig195173a.webp`; `2616ce97-6d4e-414c-8bb7-d6d0524314e1-e1689574515704.webp`; `rio-caimar-matanzas-cuba.webp`; `cueva-de-saturno-varadero-cuba.webp`; `image-of-latin-quietness-21982232-e1689574690806.webp` | `src/assets/pages/matanzas/{sauto-theater,liberty-park,canimar-river,saturn-cave,varadero-beach}.webp`; matching landmark alt |
| `havana-old`, `havana-malecon`, `havana-capitol`, `havana-colon`, `havana-morro` | `cuba-mia-la-floridita-havana-vieja.webp`; `226128156el-malec195179n-de226128166.webp`; `el-capitolio-havana-cuba.webp`; `lis-cristobal-colon-cemetery-habana.webp`; `e030f423-bae8-464e-91e8-1675c135dc21.webp` | `src/assets/pages/havana/{old-havana,malecon,capitol,colon-cemetery,morro-cabana}.webp`; matching landmark alt |
| `trinidad-square`, `trinidad-sugar-mills`, `trinidad-ancon`, `trinidad-church`, `trinidad-museum` | `one-in-cuba-blonde-brunette-travel.webp`; `wn-in-the-province-of-santi226128166.webp`; `empty-beach-playa-anc195179n-cuba.webp`; `oly-trinity-church-in-trinidad-cuba.webp`; `romantic-museum-beyond-the-ordinary.webp` | `src/assets/pages/trinidad/{main-square,sugar-mills,ancon-beach,holy-trinity-church,romantic-museum}.webp`; matching landmark alt |
| `cienfuegos-malecon`, `cienfuegos-theater`, `cienfuegos-cathedral`, `cienfuegos-palace`, `cienfuegos-nicho` | `malec195179n-de-cienfuegos-cuba.webp`; `Cienfuegos-Teatro-Tomas-Terry-e1689713864512.webp`; `Catedral-de-la-Purisima-Concepcion-e1689713779280.webp`; `Palacio-de-Valle-en-_Cienfuegos-_❤️__️-_cuba.webp`; `el-nicho-cienfuegos-cuba.webp` | `src/assets/pages/cienfuegos/{malecon,tomas-terry-theater,purest-conception-cathedral,valley-palace,el-nicho}.webp`; matching landmark alt |
| `santiago-cathedral`, `santiago-stone`, `santiago-castle`, `santiago-sierra`, `santiago-caburni` | `eacdd918-6480-4c70-91a2-84f1c892dbc5-e1689714856331.webp`; `santiago-de-cuba-beyond-the-ordinary.webp`; `ba-cuba-attractions-lonely-planet-e1689714900146.webp`; `f-sierra-maestra-cuba-tripadvisor.webp`; `foto-de-santiago-de-cuba-cuba-e1689714960777.webp` | `src/assets/pages/santiago-cuba/{cathedral,great-stone,san-pedro-castle,sierra-maestra,salto-del-caburni}.webp`; matching landmark alt |

## Per-page migration checklists

Each item is an observed implementation requirement, not completed Astro work. All retained pages use the shared header/footer, `brand-logo`, and decorative `footer-mark`; their source mobile layout was not screenshot-captured.

### `/` — migrate
- Heading hierarchy: H1 Cuban Trip Experience; H2 group-distance, WHY ARE WE THE BEST?, destination intro, Best Places; H3 three benefit cards and testimonials (testimonials excluded).
- Paragraphs/lists: hero copy, group-distance copy, three benefit descriptions, destination intro/card summaries; keep only non-review content.
- Media placement: hero taxi image, portrait Havana image, brand wordmark; review badge/testimonial assets excluded.
- CTA: `View Services` → `/services/`; `See More` destination cards → their retained paths; every `Book` CTA is excluded.
- Surface/responsive: source uses hero, card/grid, and testimonial surfaces; duplicate source group block must resolve to one intentional responsive composition.

### `/destinations/` — migrate
- Heading hierarchy: page title, introductory H2, Popular Places H2, then six destination H2 cards.
- Paragraphs/lists: destination introduction and card summaries; preserve card order Pinar through Santiago.
- Media placement: one local destination image per card from `dest-*`; use `Picture` with landmark alt.
- CTA: each `See More` goes only to the matching retained destination; correct source’s Cienfuegos/Santiago broken destinations rather than preserve them.
- Surface/responsive: card grid on wide layouts, one-column card stacking on mobile.

### `/services/` — migrate
- Heading hierarchy: page title, Types of Vehicles H2, Standard/Vans/Clasic H3, then source promotional H2s.
- Paragraphs/lists: vehicle descriptions; source fragment labels Standard/Vans/Classics are in-page controls, not routes.
- Media placement: standard, van, classic local vehicle media alongside respective cards.
- CTA: `DESTINATIONS` → `/destinations/`; `BOOK NOW` is excluded, not relabeled.
- Surface/responsive: three vehicle cards stack from desktop row to narrow vertical sequence.

### `/contact-us/` — migrate
- Heading hierarchy: page title, Send a message H2, We are here to help you H2; duplicated form heading resolves to one target form.
- Paragraphs/lists: help copy plus verified `support@cubantripexperience.com` and `+53 53788250`; Trip Advisor link/widget is excluded.
- Media placement: shared brand artwork only; no review or plugin asset.
- CTA: visual-only form button has no destination/submission; header/footer retain only non-booking routes.
- Surface/responsive: form fields and contact text are vertically ordered on mobile; form remains visual-only with the three observed fields.

### Destination detail pages — migrate
Applies to `/pinar-del-rio/`, `/matanzas/`, `/havana/`, `/trinidad/`, `/cienfuegos/`, and `/santiago-cuba/` using the exact landmark sequence and local `src/assets/pages/<slug>/` mappings in the ledger.
- Heading hierarchy: page title followed by five landmark H2s in each route’s route-matrix sequence; preserve source capitalization/content spelling unless intentionally corrected for accessible target copy.
- Paragraphs/lists: retain any visible landmark prose (notably Matanzas); do not invent booking prose.
- Media placement: each landmark has its corresponding local image beside/in its landmark section; use the mapped meaningful landmark alt.
- CTA: retain only adjacent retained-destination links; omit every `BOOK NOW` destination.
- Surface/responsive: image-led landmark sections must stack into source reading order on mobile; desktop alternation, spacing, colors, and image crops require later paired visual validation.

## Scaffold route reconciliation

| Existing Astro scaffold route | Inventory decision | Basis |
|---|---|---|
| `/` | retained at `/` | default-language home is the authoritative source root |
| `/about` | removed | no default-language public About page was discovered |
| `/contact` | renamed to `/contact-us/` | source header/footer destination is `/contact-us/` |
| `/pricing` | removed | no pricing route exists; source public service route is `/services/` |
| `/404` | justified infrastructure-only | retain branded shared-shell not-found behavior; source broken `/contacts-us/` proves a source 404 state |

## Form and direct-message control disposition

| Source control | Classification | Disposition |
|---|---|---|
| Fluent Form 8 on `/contact-us/` (shown twice) | `general-contact-visual-only` | One visual-only target form may show First Name, Email Address, Your Message; no action, endpoint, hidden service fields, handler, or network request. |
| Fluent Form 5 on `/bookings/` | `excluded-booking` | Exclude whole route and all vehicle/date/time/passenger/pickup/airport/flight/address controls. |
| Header/footer WhatsApp (`api.whatsapp.com` / `wa.me`, `+53 53788250`) | `excluded-booking` | The booking page says reservations are confirmed through WhatsApp/email; omit direct-message controls rather than treating them as general contact. |
| Home/service/destination `Book` or `BOOK NOW` controls | `excluded-booking` | Each points to `/bookings/`; omit rather than relabel. |

## Completeness gate — PASS

- [x] Every default-language header/footer destination has a disposition: Destinations, Services, and Contact us migrate; Bookings is excluded.
- [x] Every retained route has an explicit normalized target path.
- [x] Every visible retained-page source asset identified during HTML inspection has a semantic local mapping in the ledger; source review/widget and booking-only assets are explicitly excluded.
- [x] No retained navigation destination points to an excluded row; booking controls are omitted and adjacent destination links are normalized to retained paths.
- [x] All discovered default-language same-origin public paths, including booking and the broken booking-page contact link, have a recorded disposition; locale/admin/widget endpoints are explicitly excluded from migration scope.

**Work-unit verification:** manual inventory review only; no build/test runner was required or run. **Rollback boundary:** delete/revert this inventory only; no Astro application code was touched.

## 2026-08-26 validation evidence — accepted scope differences

- The preview target was structurally compared by `curl` against the read-only WordPress reference on all ten retained routes; no pixel screenshots or viewport-specific pixel comparison were performed because screenshot capture is unavailable in this runtime.
- The target intentionally omits the reference booking route/CTAs and its reservation fields, locale routes/language controls, and Trustpilot/Trip Advisor review surfaces, as recorded in the route matrix and control dispositions above.
- The target intentionally renders one contact form where the reference duplicates it and one home group-distance block where the source duplicates it, as specified by the per-page checklists.
