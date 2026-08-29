# Elementor Design Tokens Specification

## Purpose

Define the shared token layer both language sites draw from: Elementor's exact
breakpoints, the Poppins family, and the real inline palette documented in
`reference/es/README.md`. Elementor's breakpoints and Tailwind's defaults do not
align, and that misalignment is where responsive layouts silently diverge.

## Requirements

### Requirement: Elementor breakpoints are reproduced exactly

`tailwind.config.cjs` MUST define screens matching Elementor's ranges exactly:
mobile `< 768px`, tablet `768–1024px`, desktop `≥ 1025px`. Tailwind's default
`md` (768px) and `lg` (1024px) boundaries MUST NOT be used as approximations for
`_tablet` / `_mobile` overrides.

#### Scenario: 1024px is still tablet

- GIVEN an element whose `spec.md` declares a `_tablet` override
- WHEN the page renders at a 1024px viewport width
- THEN the tablet override is in effect and the desktop value is not

#### Scenario: 1025px is desktop

- GIVEN the same element
- WHEN the page renders at 1025px
- THEN the desktop (unsuffixed) value is in effect

#### Scenario: 767px is mobile

- GIVEN an element with both `_tablet` and `_mobile` overrides
- WHEN the page renders at 767px
- THEN the `_mobile` value is in effect

### Requirement: New screen names are additive

The Elementor screen keys MUST be added alongside the existing `sm` / `md` / `lg`
keys already used by English pages. Existing screen definitions MUST NOT be
redefined, renamed, or removed.

#### Scenario: Existing keys intact

- GIVEN `tailwind.config.cjs` after this change
- WHEN its `screens` map is inspected
- THEN `sm`, `md`, and `lg` retain their prior values, and the Elementor keys are
  present as additional entries

#### Scenario: English page regression via redefined breakpoint

- GIVEN `md` or `lg` is redefined to match an Elementor boundary
- WHEN English routes captured before the edit are re-captured after it and
  diffed against that baseline per `visual-parity-verification`
- THEN any English page exceeding either tolerance means the change FAILS,
  because English pages must not regress

### Requirement: Poppins is the single font family

Spanish pages MUST render in Poppins at the weights the source uses (400, 500,
600, 700), with the source's authored sizes, and MUST NOT fall back to the
target's prior default family.

Counts across the eleven specs: 600 (89 uses), 500 (31), 400 (25), 700 (2).
Weight 700 is rare but real — `reference/es/inicio/spec.md:71` authors the
`¿Por qué somos los mejores?` heading at `typography_font_weight=700`. Loading
only 400/500/600 makes that heading render at a substituted weight, which the
`pixels` metric reports as a difference.

#### Scenario: Body copy family and size

- GIVEN body text declaring `typography_font_family=Poppins;
  typography_font_size=17px; typography_font_weight=400`
- WHEN it renders at desktop
- THEN its computed font family is Poppins at 17px / weight 400

### Requirement: Palette tokens carry their authored alpha

Palette entries exposed as Tailwind tokens MUST preserve 8-digit alpha where the
source uses it, and MUST NOT be normalized to 6-digit approximations at the token
layer.

#### Scenario: Token retains alpha

- GIVEN the brand yellow used at `#F8F43D85` for CTA backgrounds
- WHEN it is expressed as a token or utility
- THEN the resulting computed color is `rgba(248, 244, 61, 0.52)`

#### Scenario: English theme tokens untouched

- GIVEN the token values English pages already consume
- WHEN the Spanish palette is added
- THEN no existing color, font, or spacing token used by English pages is changed
  or removed
