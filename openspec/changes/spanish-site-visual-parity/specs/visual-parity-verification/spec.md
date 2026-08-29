# Visual Parity Verification Specification

## Purpose

Define the acceptance gate for Spanish-page work. Acceptance is decided by a
measured pixel diff against `reference/es/<slug>/{desktop,tablet,mobile}.png`,
never by structural inspection. The prior change
(`migrate-wordpress-public-site`) passed build, DOM, heading-order, and link
checks and still shipped `/contact-us` at 1273px desktop height against the
source's 1055px; that record is why structural signals are declared insufficient
here.

## Requirements

### Requirement: A measured PASS verdict is the acceptance gate

A page MUST NOT be marked complete until `reference/tools/compare.sh <slug>
<astro-path>` has been executed against the running Astro dev server, printed
`VERDICT: PASS`, and exited 0. The tool captures at 1440px, 768px, and 390px and
evaluates two independent metrics per breakpoint, both defaulting to a 2%
tolerance:

| Metric | Measures | Failure class it catches | Override |
|---|---|---|---|
| `height` | full-page height delta vs the reference capture | layout that grows or collapses | `HEIGHT_TOLERANCE` |
| `pixels` | share of differing pixels over the common region | wrong color, font, spacing, or imagery at identical height | `PIXEL_TOLERANCE` |

Both metrics MUST be within tolerance at all three breakpoints. Neither metric
alone is sufficient: two captures can match in height and still differ
internally, which is exactly what `pixels` measures.

#### Scenario: Page accepted on a PASS verdict

- GIVEN a Spanish page implemented at `/es/<route>`
- WHEN `compare.sh <slug> /es/<route>` is run against the dev server
- THEN it prints `VERDICT: PASS`, exits 0, and the page is accepted

#### Scenario: Structural checks alone are insufficient

- GIVEN a page where `npm run build` succeeds, the DOM structure matches the
  section/column/widget tree, all links resolve, and heading hierarchy is correct
- WHEN `compare.sh` has not been run, or has not printed `VERDICT: PASS`
- THEN the work unit is NOT complete and MUST NOT be reported as done

#### Scenario: Height failure

- GIVEN `/contact-us` captured against its reference
- WHEN `compare.sh` evaluates it
- THEN it reports `desktop FAIL height 1055->1273 (20.7%)`, `tablet FAIL height
  1172->1273 (8.6%)`, and `mobile FAIL height 1278->2010 (57.3%)`
- AND the run exits non-zero, so the page is not accepted

#### Scenario: Pixel failure at matching height

- GIVEN a page whose captured height is within 2% of the reference at every
  breakpoint, but which renders a CTA in `#F8F43D` where the source uses
  `#F8F43D85`
- WHEN `compare.sh` evaluates it
- THEN the `pixels` metric exceeds tolerance and the breakpoint reports `FAIL`

#### Scenario: Every in-scope page is gated individually

- GIVEN the eleven pages in `reference/tools/pages.tsv`, six of which render
  through one `[slug].astro` route
- WHEN acceptance is evaluated
- THEN each of the eleven slugs has its own `VERDICT: PASS`, not only the first
  slug that defined a shared template

### Requirement: The diff image is the recorded evidence

Each run writes `reference/es/<slug>/diff-{desktop,tablet,mobile}.png`
highlighting every differing pixel. A work unit's completion record MUST cite the
`compare.sh` verdict line per breakpoint for each page it completes.

#### Scenario: Completion record cites measured output

- GIVEN a work unit completing one or more pages
- WHEN its completion record is written
- THEN it contains the per-breakpoint `height` and `pixels` figures and the
  `VERDICT` line for each page, not a prose claim of visual parity

### Requirement: Deliberate differences are named, and only they need judgment

Where a non-goal makes exact parity impossible — excluded TripAdvisor/Trustpilot
review widgets, absent language switcher, visual-only forms — the residual
difference MUST be named in the completing work unit's record with page,
breakpoint, and the decision it derives from, and MAY be accepted by raising the
tolerance for that run. Every other difference is decided by the tool, not by
human judgment.

#### Scenario: Excluded review widget forces a raised tolerance

- GIVEN a reference capture containing an excluded review widget
- WHEN the page cannot reach `VERDICT: PASS` at default tolerance because of that
  region alone
- THEN the work unit record names the page, breakpoint, the exclusion decision,
  and the overridden tolerance value used
- AND the `diff-<viewport>.png` shows the differing region confined to that widget

#### Scenario: Tolerance is not raised to hide unexplained differences

- GIVEN a run passing only because `PIXEL_TOLERANCE` or `HEIGHT_TOLERANCE` was
  raised
- WHEN no named non-goal accounts for the differing region
- THEN the page FAILS acceptance

### Requirement: English non-regression is measured before and after

English pages have no WordPress reference capture of their own, so their check is
a before-vs-after diff of the English build itself — sufficient to prove
non-regression, which is all this requires. Before any change to shared code
(`tailwind.config.cjs`, shared layout, shared components), the affected English
routes MUST be captured as a baseline; after the change they MUST be re-captured
and diffed against that baseline using the same two metrics and tolerances.

#### Scenario: Shared token change leaves English untouched

- GIVEN English routes captured as a baseline before `tailwind.config.cjs` is
  edited
- WHEN they are re-captured after the Elementor screens are added and diffed
  against that baseline
- THEN every English route is within `height` and `pixels` tolerance

#### Scenario: Newly-differing English page is a regression

- GIVEN the same before/after comparison
- WHEN any English route exceeds either tolerance against its own baseline
- THEN it is a regression, the change FAILS, and the shared code is made additive
  instead

#### Scenario: Baseline is captured before the edit, not after

- GIVEN a shared-code change already applied with no prior English baseline
- WHEN non-regression is evaluated
- THEN it cannot be proven, and a baseline MUST be captured from the pre-change
  build before the change is accepted
