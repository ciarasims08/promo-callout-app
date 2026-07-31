# Promo Callout Component

A reusable, accessible Angular component for displaying CMS-managed promotional and informational callouts.

This project was created as a take-home exercise for a Frontend Software Engineer role. It simulates a shared component-library workflow where content is authored by non-engineering teams through a CMS.

## Tech Stack

* Angular 21
* TypeScript
* SCSS
* Vitest
* Signal-based `input()` / `output()` APIs
* `OnPush` change detection
* Native Angular control flow (`@if`)
* CSS custom properties for design tokens

---

## Architecture

The application separates the CMS-shaped content model from the reusable UI component:

```text
CMS Entry
   │
   ▼
PromoCalloutCmsEntry
   │
   ▼
mapPromoCallout()
   │
   ├── Valid ──────► PromoCallout
   │                    │
   │                    ▼
   │              PromoCalloutComponent
   │
   └── Invalid ───► console.warn() + null
```

The component receives a normalized `PromoCallout` model rather than the raw CMS `sys` / `fields` structure.

---

## Decision 1: CMS Content Shape

I chose to introduce an adapter layer between the CMS payload and the reusable component.

The CMS-specific `PromoCalloutCmsEntry` model represents the raw Contentful-shaped data, while the reusable component consumes the domain-specific `PromoCallout` model.

The adapter is responsible for:

* Extracting the CMS entry ID
* Validating required content
* Validating the supported `tone` values
* Applying defaults
* Returning `null` for invalid or incomplete content
* Warning developers with the entry ID when content is invalid

This keeps the reusable component independent of the CMS implementation. If the CMS provider or schema changes, the adapter can change without requiring the UI component to understand those details.

For a larger production application, I would consider moving this transformation into a dedicated CMS/content service.

---

## Decision 2: Dismissal State Ownership

I chose to keep dismissal state outside the reusable component.

When the user dismisses a callout, the component emits the CMS entry ID through its `dismissed` output. The consuming application decides what happens next.

In this demo, the parent application:

1. Receives the entry ID.
2. Updates its local dismissal state.
3. Removes the callout from the UI.
4. Displays an accessible live-region announcement.

In production, the consuming application could instead:

* Persist dismissal per member
* Store dismissal in local storage
* Send an analytics event
* Apply business rules
* Support A/B testing
* Restore or reset dismissal when content changes

Keeping visibility state outside the component avoids coupling the shared UI component to persistence or business logic.

---

## Feature Flagging

The component accepts a boolean `featureEnabled` input. When disabled, the component renders nothing.

For this exercise, a boolean input was used instead of integrating a real feature flag service.

In production, I would expect the application or feature layer to evaluate the LaunchDarkly flag and pass the resulting boolean into the component rather than having the shared component directly depend on the LaunchDarkly SDK.

```text
LaunchDarkly
     │
     ▼
Application / Feature Layer
     │
     ▼
featureEnabled
     │
     ▼
PromoCalloutComponent
```

---

## Content States

The component handles three states:

### Loading

A lightweight skeleton is displayed while content is loading.

### Valid

Valid normalized content renders the callout with either an `info` or `promo` tone.

### Invalid / Incomplete

The adapter fails closed when required content is missing or invalid.

For example, a missing title or unsupported tone results in:

* A `console.warn()` containing the CMS entry ID
* `null` being returned by the adapter
* No callout being rendered

The CTA is also omitted when either the CTA label or URL is missing.

---

## Design Token Assumptions

The exercise did not provide the application's actual design tokens or Figma files.

I created a small simulated token layer using CSS custom properties representing the types of semantic tokens I would expect in a shared design system, including:

* Surface/background colors
* Primary and secondary text colors
* Info and promotional accent colors
* Primary action color
* Focus color
* Card spacing and radius
* Typography

The component does not hardcode color values. In a production application, I would replace the simulated tokens with the existing shared design-system tokens and verify their actual WCAG 2.1 AA contrast ratios.

The `tone` controls the callout's accent border. The CTA uses the shared primary action token consistently across both variants.

---

## Accessibility

The component was designed with WCAG 2.1 AA considerations in mind.

* Uses `<aside>` for supplementary informational/promotional content rather than treating it as an urgent alert.
* Uses a native `<button>` for dismissal with an accessible name.
* Marks decorative icons with `aria-hidden="true"`.
* Uses native links for CTA navigation.
* Provides visible `:focus-visible` styles.
* Uses a parent-controlled `role="status"` / `aria-live="polite"` region to announce dismissal after the callout is removed.
* Uses semantic color tokens rather than hardcoded values.

The actual contrast ratios of production tokens would need to be verified once the real design tokens are available.

---

## Testing

Tests cover:

* Valid content rendering
* Both `info` and `promo` tones
* Loading state
* Invalid/incomplete content
* Invalid tone validation
* Console warnings for invalid content
* CTA rendering behavior
* Feature flag behavior
* Dismissal events and entry IDs
* Accessibility-focused assertions
* Decorative icon behavior
* Accessible dismissal controls
* Adapter mapping and defaults

---

## Open Questions for UX / Design

If this were a real handoff, I would clarify:

1. What are the exact design tokens for the `info` and `promo` variants?
2. Should the CTA styling vary by tone?
3. Should `iconName` come from a controlled icon set?
4. What is the intended behavior for titles longer than one line?
5. What are the exact responsive breakpoints and spacing requirements?
6. Is `<aside>` the correct semantic treatment for every placement of this component?
7. What are the expected focus, hover, and interaction states?

---

## Open Questions for Content / Digital Engagement

I would clarify:

1. Which CMS fields are required?
2. Should invalid `tone` values be prevented by the CMS schema?
3. Are CTA labels and URLs always expected together?
4. Should internal and external URLs be handled differently?
5. Should CTA clicks include analytics or tracking metadata?
6. Should dismissals persist across sessions?
7. If so, should dismissal be per member, device, or browser?
8. How long should a dismissal remain effective?
9. Should publishing a new version of a promotion reset a previous dismissal?
10. Should dismissal events be tracked for analytics or experimentation?

---

## AI Usage Disclosure

ChatGPT was used throughout the exercise as a pair-programming and learning aid.

### AI was used for:

* Explaining Angular 20+/21 signal-based `input()` and `output()` APIs
* Explaining Angular standalone component conventions
* Suggesting component and adapter architecture
* Generating initial scaffolding and TypeScript models
* Assisting with Angular template syntax and native control flow
* Assisting with SCSS and responsive styling
* Reviewing accessibility considerations
* Assisting with unit test structure
* Troubleshooting Angular, TypeScript, and Vitest errors
* Reviewing the implementation against the exercise requirements

### What I kept

I kept suggestions that aligned with the stated requirements and the architecture I chose, including:

* Signal-based inputs and outputs
* `OnPush` change detection
* Native Angular control flow
* A CMS adapter layer
* Parent-controlled dismissal state
* Semantic HTML and native interactive elements
* Design tokens through CSS custom properties
* A parent-controlled dismissal announcement

### What I changed or rejected

AI-generated suggestions were reviewed and adapted rather than accepted blindly.

Examples include:

* Moving the adapter into a dedicated `adapters` directory rather than keeping transformation logic with data models.
* Replacing unsupported `toHaveClass()` assertions with supported DOM/class-list assertions.
* Updating the generated Angular starter test after replacing the default application template.
* Choosing parent-controlled dismissal state to support future persistence and experimentation.
* Moving the dismissal live region into the parent application so it remains available to assistive technology after the callout is removed.
* Choosing `<aside>` instead of `role="alert"` because the component displays supplementary promotional or informational content rather than urgent information.
* Using simulated design tokens because the production design system was not provided.

AI was used as a development and learning tool. Generated code was reviewed, tested, and adjusted to meet the requirements and the implementation decisions documented above.

---

## Running the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Run tests:

```bash
npm test
```

Build the project:

```bash
npm run build
```

The application is available at:

```text
http://localhost:4200
```
