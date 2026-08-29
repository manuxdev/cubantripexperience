# Spanish Public Pages Specification

## Purpose

Define what each of the eleven Spanish pages MUST render. The contract per page is
`reference/es/<slug>/spec.md`, generated from `_elementor_data` (the authored
Elementor tree), not from scraped HTML. `elementor.json` is the fallback source
when `spec.md` omits a setting. Booking workflows, WordPress administration, and
third-party review widgets remain out of scope.

## Requirements

### Requirement: Copy is reproduced literally, including source typos

Every `title`, `text`, `editor`, `title_text`, and `description_text` value in
`reference/es/<slug>/spec.md` MUST be reproduced character-for-character, including
missing accents, spacing, punctuation, and line breaks authored in the source.
Implementations MUST NOT correct, normalize, retranslate, or improve source copy.

#### Scenario: Source typo preserved

- GIVEN `contactos` Section 3 contains the heading `Envianos un mensaje` (no accent
  on the first `a`) in its 33% column
- WHEN `/es/contactos` renders
- THEN that heading reads exactly `Envianos un mensaje`

#### Scenario: Corrected typo is a failure

- GIVEN the implementation renders `Envíanos un mensaje` in that same 33% column
- WHEN the page is compared against its contract
- THEN the page FAILS, because the accented form belongs only to the separate
  mobile-only column (`hide_desktop=hidden-desktop`) where the source authored it

#### Scenario: Copy with authored slashes and line structure

- GIVEN `inicio` Section 3 text `No importa el tamaño de su grupo o la / distancia
  que necesitas recorrer, ...`
- WHEN the page renders
- THEN the `/` separators and their surrounding spacing are reproduced as authored

### Requirement: Colors preserve 8-digit alpha hex values

Hex color values in `spec.md` carry alpha in the 8th digit. Implementations MUST
reproduce the alpha channel exactly and MUST NOT truncate an 8-digit value to six
digits or substitute a visually similar opaque color.

#### Scenario: Alpha preserved on the reserve button

- GIVEN the nav `widget:button` declares `background_color=#F8F43D85`
- WHEN the button renders
- THEN its computed background is `rgba(248, 244, 61, 0.52)` (52% opaque)

#### Scenario: Truncated alpha is a failure

- GIVEN the button renders with background `#F8F43D` (fully opaque)
- WHEN the page is compared against its contract
- THEN the page FAILS

#### Scenario: Translucent nav gradient

- GIVEN the floating nav column declares `background_color=#3F3F3FCF` to
  `background_color_b=#5F5F5F` with `background_color_stop=43%`
- WHEN the nav renders over page content
- THEN the first gradient stop is 81% opaque and page content shows through it

### Requirement: Responsive overrides follow the suffixed values

`_tablet` and `_mobile` suffixed settings in `spec.md` MUST be applied only within
their Elementor breakpoint range, and unsuffixed settings MUST apply at desktop.
`hide_desktop=hidden-desktop` elements MUST NOT render at desktop widths.

#### Scenario: Heading size per breakpoint

- GIVEN a hero heading with `typography_font_size=47px`,
  `typography_font_size_tablet=45px`, `typography_font_size_mobile=24px`
- WHEN the page renders at 1440px, 768px, and 390px
- THEN the rendered sizes are 47px, 45px, and 24px respectively

#### Scenario: Desktop-hidden widget

- GIVEN the `contactos` mobile-only form column carries
  `hide_desktop=hidden-desktop`
- WHEN the page renders at 1440px
- THEN that column and its form are not visible

### Requirement: Source media is matched by content, never by filename

Images cited in `spec.md` MUST resolve to the correct source image. Assets already
present under `src/assets/` were renamed semantically by the English migration, so
identity MUST be established by image content, not by filename. Assets not already
local MUST be copied from `reference/es/_media/` and MAY be renamed semantically on
copy. The eight `.jpg` URLs that 404 on the WordPress source MUST resolve through
the `.webp` twin mapping in `reference/USAGE.md` §7.

#### Scenario: Already-local asset reused under its migrated name

- GIVEN `la-habana` cites `el-capitolio-havana-cuba.webp`
- WHEN the same image already exists as `src/assets/pages/havana/the-capitol.webp`
- THEN the existing local asset is reused and no duplicate is added

#### Scenario: Filename mismatch is not an absence

- GIVEN no local file named `el-capitolio-havana-cuba.webp` exists
- WHEN the asset is resolved
- THEN a content match against existing `src/assets/` images is performed before
  copying anything from `_media/`

#### Scenario: 404 JPEG URL resolves to its webp twin

- GIVEN a spec cites `El-Capitolio-Havana-Cuba.jpg`, which 404s on the source
- WHEN the asset is resolved
- THEN `el-capitolio-havana-cuba.webp` from `reference/USAGE.md` §7 is used

#### Scenario: Media served through target asset conventions

- GIVEN any Spanish page displaying source media
- WHEN it renders
- THEN images are served from `src/assets/` or `public/`, never from an
  `http://localhost:8080/wp-content/uploads/` URL

### Requirement: Excluded source widgets are not recreated

Pages MUST NOT render TripAdvisor/Trustpilot review widgets or a Polylang language
switcher, and MUST NOT import Elementor or Astra CSS/JS assets, even where the
page's `spec.md` contains the corresponding widget node.

#### Scenario: Language switcher node not rendered

- GIVEN every page's nav section contains a
  `widget:polylang-language-switcher` node
- WHEN the page renders
- THEN no language switcher control is present

#### Scenario: No Elementor or Astra assets bundled

- GIVEN the production build output
- WHEN stylesheet and script imports are inspected
- THEN no Elementor or Astra CSS/JS file is imported or bundled
