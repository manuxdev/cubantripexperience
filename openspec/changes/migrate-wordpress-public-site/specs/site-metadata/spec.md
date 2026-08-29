# Site Metadata Specification

## Purpose

Define the observable base SEO/site-identity behavior the Astro target MUST
exhibit after this change, replacing the inherited Astroship/Web3Templates
defaults with Cuban Trip Experience identity. This is required for visual/content
parity with a real public site, not a new capability.

## Requirements

### Requirement: Site configuration reflects Cuban Trip Experience identity

The Astro target's base site configuration (`cubantripexperience/astro.config.mjs`
`site` URL and any derived canonical-URL basis) MUST NOT reference
`astroship.web3templates.com` and MUST reflect a Cuban Trip Experience domain or
an explicit non-production placeholder appropriate for this change.

#### Scenario: Build-time site configuration is inspected

- GIVEN `cubantripexperience/astro.config.mjs`
- WHEN its `site` field is inspected
- THEN it is not `https://astroship.web3templates.com`
- AND it reflects the Cuban Trip Experience site identity (or an explicit
  non-production placeholder documented as such)

### Requirement: Rendered head metadata reflects Cuban Trip Experience identity

Every in-scope public page's rendered `<head>` metadata (page title, canonical
URL, and default Open Graph title/description/image alt text) MUST reference
Cuban Trip Experience branding and MUST NOT reference "Astroship" or
"Web3Templates".

#### Scenario: Head metadata is inspected on an in-scope page

- GIVEN any in-scope public page rendered by the Astro target
- WHEN its `<head>` is inspected
- THEN the title, canonical URL, and Open Graph tags reference Cuban Trip
  Experience branding
- AND none of them contain "Astroship" or "Web3Templates" text

### Requirement: Footer and contact identity are consistent with the real site

The shared footer's attribution/copyright text, and any site-wide contact
identity strings (email address, brand name) rendered on in-scope public pages,
MUST reflect Cuban Trip Experience and MUST NOT show Astroship/Web3Templates
attribution or unrelated placeholder contact details.

#### Scenario: Footer content is inspected

- GIVEN the shared footer component
- WHEN rendered on any in-scope public page
- THEN it shows Cuban Trip Experience attribution
- AND it does not contain "Astroship" or "Web3Templates" text

#### Scenario: Contact identity strings are inspected

- GIVEN an in-scope public page that displays a site contact email, phone number,
  or address
- WHEN that content is inspected
- THEN it reflects the real Cuban Trip Experience contact identity as shown on
  the reference site, not `hello@astroshipstarter.com` or another Astroship
  placeholder value
