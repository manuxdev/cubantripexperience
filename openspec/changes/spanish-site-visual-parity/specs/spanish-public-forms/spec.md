# Spanish Public Forms Specification

## Purpose

Define the visual-only migration of the Fluent Forms widgets on `contactos` and
`reservar`. This carries the prior change's decision forward unchanged: forms are
reproduced for appearance, never for behavior.

## Requirements

### Requirement: Forms are visual only

Every `widget:fluent-form-widget` MUST be reproduced as static markup with no
`action` attribute, no endpoint URL, no submit handler, and no client-side
validation or state logic. Activating a submit control MUST NOT issue a network
request or navigate away.

#### Scenario: No action or endpoint

- GIVEN the rendered form on `/es/contactos`
- WHEN its `<form>` element is inspected
- THEN it has no `action` attribute and no endpoint URL anywhere in its markup

#### Scenario: Submitting performs no request

- GIVEN a filled form on `/es/contactos` or `/es/reservar`
- WHEN the submit control is activated
- THEN no network request is issued, no navigation occurs, and no success or error
  state is rendered

#### Scenario: No submit handler is attached

- GIVEN the page's client-side scripts
- WHEN they are inspected
- THEN no submit, fetch, or form-serialization handler is bound to the form

### Requirement: Form styling matches its widget contract

Form field and button styling MUST reproduce the widget's declared values,
including 8-digit alpha, so that the form's captures match the reference at all
three breakpoints.

#### Scenario: Contactos field and button styling

- GIVEN the `contactos` form widget declaring
  `form_field_border_color=#F8F43D`, `form_field_border_width=0px 0px 03px 0px`,
  `form_submit_button_bg_color_normal=#F8F43D`, and
  `form_submit_button_text_color_normal=#000000`
- WHEN the form renders
- THEN fields show a 3px bottom border in `#F8F43D` and the submit button renders
  `#F8F43D` on `#000000` text

#### Scenario: Form pages pass the capture gate

- GIVEN `/es/contactos` and `/es/reservar`
- WHEN `compare.sh` is run for each
- THEN both print `VERDICT: PASS`, with no interactive behavior added to achieve
  it

### Requirement: Accessible form semantics are preserved

Visual-only MUST NOT mean semantically empty. Fields MUST keep their labels,
input types, and focus order so the static form remains keyboard-navigable and
screen-reader intelligible.

#### Scenario: Labelled, focusable fields

- GIVEN the static form
- WHEN it is traversed by keyboard
- THEN each field is reachable in visual order and has an associated label
