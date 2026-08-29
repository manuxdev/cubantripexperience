# Public Forms Specification

## Purpose

Define the observable behavior of public-facing forms in the migrated Astro
target. Per the proposal's confirmed product decisions, public forms may be shown
for visual parity with the reference site, but MUST NOT have any working
submission endpoint or integration, and booking/reservation forms remain excluded
entirely regardless of visual parity concerns.

## Requirements

### Requirement: Non-booking public forms are visual-only

Any public-facing form on an in-scope page that is not a booking/reservation form
(for example, a general contact/inquiry form) MUST be rendered for visual and
layout parity only. It MUST NOT perform a network submission, MUST NOT be wired to
a third-party form-processing service, and MUST NOT expose a live access
key/endpoint.

#### Scenario: Contact form has no submission wiring

- GIVEN the migrated contact page's form
- WHEN a user fills in the visible fields and activates the submit control
- THEN no HTTP request is sent to a form-processing endpoint (e.g.
  `api.web3forms.com` or any equivalent third-party form service)
- AND no client-side handler performs a network submission on behalf of the form

#### Scenario: No live form-service credentials remain

- GIVEN the migrated Astro target's source
- WHEN searched for form-service configuration (access keys, endpoint URLs)
- THEN no live third-party form-service access key or submission endpoint is
  present in an in-scope public form

### Requirement: Booking/reservation forms are excluded entirely

No booking/reservation form, including Fluent Forms booking-style forms
identified on the source site, MUST appear anywhere in the Astro target, whether
functional or purely visual.

#### Scenario: No booking form fields anywhere in the migrated site

- GIVEN the full set of migrated public pages in the Astro target
- WHEN searched for booking/reservation-oriented form fields (date/time pickers,
  ride or trip selection, passenger count, pickup/drop-off location)
- THEN none exist on any page

### Requirement: Non-booking form field parity for visual comparison

Where the reference site shows a general-purpose contact/inquiry form on an
in-scope public page, the migrated Astro form MUST preserve the same visible
field set (labels and/or placeholders) as the reference site's equivalent form,
for visual-parity comparison, independent of whether those fields are wired to a
submission handler.

#### Scenario: Visible field set matches the reference form

- GIVEN the reference site's general-purpose contact/inquiry form fields
- WHEN compared to the migrated Astro contact form's visible fields
- THEN the same set of visible fields (e.g. name, email, message, or the
  reference site's equivalent set) is present
