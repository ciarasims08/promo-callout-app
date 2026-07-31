# Promo Callout Component

A reusable, accessible Angular component that displays CMS-managed promotional or informational content.

This project was created as a take-home exercise for a Frontend Software Engineer role. The component simulates a shared component-library workflow where content is authored and managed by non-engineering teams through a CMS.

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

The application separates the CMS-shaped content model from the reusable UI component.

```text
CMS-shaped Contentful Entry
          │
          ▼
PromoCalloutCmsEntry
          │
          ▼
mapPromoCallout()
          │
          ├── Valid content ───────► PromoCallout
          │                              │
          │                              ▼
          │                       PromoCalloutComponent
          │
          └── Invalid/incomplete
                    │
                    ├── console.warn(entry id)
                    │
                    └── return null
```

The component receives a normalized `PromoCallout` model rather than the raw CMS structure.

This keeps the reusable component independent from the CMS-specific data shape.

The project uses an adapter layer to validate and normalize external CMS content before it reaches the shared component.

---

## Content Shape Decision

I chose to introduce an adapter layer between the CMS payload and the reusable component rather than having the component consume the raw `sys` / `fields` structure directly.

The CMS payload is represented by `PromoCalloutCmsEntry`, while the component consumes the domain-specific `PromoCallout` model.

The adapter is responsible for:

* Extracting the CMS system ID
* Normalizing the CMS fields
* Validating required content
* Validating supported values at the CMS boundary
* Applying defaults
* Returning `null` for invalid or incomplete content
* Warning developers when required content is missing or invalid

This creates a clear boundary between external content validation and UI presentation.

If the CMS provider, schema, or API changes in the future, the adapter can change without requiring the shared UI component to know about those details.

The flow is:

```text
Raw CMS Data
     │
     ▼
CMS Model
     │
     ▼
Adapter / Mapper
     │
     ├───────────────┐
     │               │
     ▼               ▼
Valid             Invalid
     │               │
     ▼               ├── console.warn()
PromoCallout        │
     │               └── return null
     ▼
UI Component
```

For a larger application, I would consider whether this mapping should live in a dedicated CMS/content service rather than a simple adapter function.

---

## Dismissal State Decision

I chose to keep dismissal state outside the reusable component.

The `PromoCalloutComponent` emits the CMS entry ID when the user activates the dismiss control:

```text
PromoCalloutComponent
        │
        │ dismissed.emit(entryId)
        ▼
Parent Application
        │
        ├── Hide the component
        ├── Announce dismissal
        ├── Persist dismissal
        ├── Send analytics
        └── Apply business rules
```

The component therefore does not internally maintain a permanent "dismissed" state.

In the demo application, the parent handles the event by setting local dismissal state:

```text
dismissed.emit("promo-cc-cashback-2026-q3")
                │
                ▼
        App.onPromoDismissed()
                │
                ▼
      isPromoDismissed = true
                │
                ├── Hide promo callout
                │
                └── Announce dismissal
```

The informational callout follows the same pattern independently:

```text
dismissed.emit("info-security-alert-2026")
                │
                ▼
        App.onInfoDismissed()
                │
                ▼
       isInfoDismissed = true
                │
                ├── Hide info callout
                │
                └── Announce dismissal
```

This allows the consuming application to decide what dismissal means.

For example, a production implementation might:

* Hide the promo for the current session
* Persist the dismissal per member
* Store the dismissed entry ID in a backend service
* Use local storage
* Send an analytics event
* Apply different behavior for an A/B test

Keeping visibility controlled by the consumer makes the shared component more reusable and avoids coupling presentation with business or persistence logic.

---

## Feature Flagging

The component accepts a boolean `featureEnabled` input.

When the feature is disabled, the component renders nothing.

For this exercise, a boolean input was used instead of integrating a real feature flag SDK to keep the component isolated and unit-testable.

In a production application, I would expect the consuming application or feature layer to evaluate the feature flag and pass the result into the component.

The intended architecture would be:

```text
LaunchDarkly
     │
     ▼
Feature Flag Service
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

I would avoid having the shared presentation component directly depend on the LaunchDarkly SDK. Instead, the application or feature layer would own the feature-flag integration and pass the resulting boolean into the reusable component.

---

## Content States

The component supports three distinct content states.

### Loading

When `loading` is true, the component renders a lightweight skeleton instead of leaving an empty gap.

```text
Loading
   │
   ▼
Skeleton UI
```

The loading state uses `role="status"` so assistive technology can identify the loading state.

### Valid

When valid normalized content is provided, the component renders the callout.

```text
Valid Content
     │
     ▼
PromoCalloutComponent
     │
     ├── Info tone
     └── Promo tone
```

### Invalid or incomplete

The adapter validates CMS content before passing it to the component.

If a required field such as `title` or `tone` is missing or invalid:

1. A warning is logged with the CMS entry ID.
2. The adapter returns `null`.
3. The consuming application does not render the component.

This follows a fail-closed approach so malformed CMS content does not produce a broken or incomplete UI.

---

## Supported Variants

The same reusable component supports both promotional and informational content.

### Promotional content

```text
tone: "promo"
```

Used for marketing messages, offers, or promotional campaigns.

Example:

```text
🎁  Earn more with your M1st Cash Back card
    Members earn 3% back on gas and groceries through September.

    [ See offer details ]
```

### Informational content

```text
tone: "info"
```

Used for informational or account-related messages.

Example:

```text
🔒  Keep your account secure
    Review your security settings and make sure your contact information
    is up to date.
```

The component uses the same implementation for both variants. The `tone` value determines the accent border token.

```text
tone: "promo"
        │
        ▼
--color-promo-accent


tone: "info"
        │
        ▼
--color-info-accent
```

This allows the component to remain reusable without creating separate promotional and informational components.

---

## Optional CTA

The CTA is rendered only when both `ctaLabel` and `ctaUrl` are provided.

```text
ctaLabel + ctaUrl
      │
      ├── Both present ──► Render CTA
      │
      └── Either missing ─► Omit CTA
```

This prevents the component from rendering a broken or unusable link when CMS content is incomplete.

The CTA uses the shared primary action token rather than changing its color based on the `tone`.

I interpreted `tone` as controlling the visual emphasis of the callout itself, specifically the accent border. The CTA remains visually consistent across variants using the shared primary action token.

---

## Responsive Behavior

The component uses Flexbox for its primary layout.

### Desktop

The layout consists of:

```text
┌────────────────────────────────────────────┐
│ [icon]  Title text, one line, bold      ✕ │
│         Body copy                          │
│         [ Primary CTA ]                    │
└────────────────────────────────────────────┘
```

The main layout uses:

```text
Icon | Flexible Content | Dismiss
```

The content area expands to use the available space, while the icon and dismiss control remain fixed-size elements.

The title uses a single-line treatment with ellipsis on larger viewports so long content does not visually break the card.

### Narrow Viewports

At the mobile breakpoint:

* The card uses tighter padding.
* The title is allowed to wrap.
* The CTA becomes a full-width block below the body content.

```text
┌─────────────────────────────┐
│ [icon]  Title          ✕    │
│         Body                │
│                             │
│ [     Primary CTA        ]  │
└─────────────────────────────┘
```

This allows the CTA to remain easy to activate on smaller screens while preserving the overall card structure.

---

## Design Tokens

The exercise did not provide the application's real design tokens or Figma files.

I created a small simulated token layer using CSS custom properties to represent the types of tokens I would expect to exist in a shared design system.

Examples include:

* Surface/background color
* Primary and secondary text colors
* Informational accent color
* Promotional accent color
* Primary action color
* Focus color
* Card radius
* Card spacing
* Typography

The component consumes semantic CSS custom properties rather than hardcoding colors directly into the component styles.

In a production codebase, I would replace these simulated tokens with the existing shared design tokens provided by the design system.

---

## Accessibility

The component was designed with WCAG 2.1 AA considerations in mind.

### Semantic structure

The callout uses an `<aside>` element because the content is supplementary to the primary content of the page.

I intentionally did not use `role="alert"` because promotional and informational content should not be treated as urgent content that interrupts the user's experience.

### Dismiss button

The dismiss control is a real `<button>` element with an accessible name:

```text
Dismiss promotional message
```

The visual `×` character is not relied upon as the accessible name.

### Decorative icon

The optional icon is marked with:

```html
aria-hidden="true"
```

because it is decorative and does not provide information necessary to understand the message.

### Dismissal announcement

When the parent application removes the callout after dismissal, it renders a visually hidden live region using:

```html
role="status"
aria-live="polite"
```

This allows assistive technology to announce that the message was dismissed.

The live region is intentionally controlled by the parent application rather than the component itself because the component is responsible for emitting the dismissal event, while the consuming application owns visibility state.

### Keyboard accessibility

The CTA is a native anchor with an `href`, and the dismiss control is a native button.

Both controls include visible `:focus-visible` styles.

### Color contrast

The component uses semantic tokens including:

* `--color-text-primary`
* `--color-text-secondary`
* `--color-surface`
* `--color-action-primary`
* `--color-focus`

Because the production design tokens were not provided for this exercise, their actual contrast ratios cannot be verified here.

The final production implementation should verify the actual token values against the WCAG 2.1 AA 4.5:1 contrast requirement for normal text before release.

---

## Testing

The test suite covers:

### Component tests

* Component creation
* Valid content rendering
* `info` tone
* `promo` tone
* Loading state
* Missing content fail-closed behavior
* Feature flag disabled behavior
* CTA rendering with complete CTA content
* CTA omission when the label or URL is missing
* Dismiss event emitting the correct entry ID

### Accessibility-focused tests

* Use of `<aside>` for supplementary content
* Accessible name on the dismiss button
* Decorative icon hidden from assistive technology
* Keyboard-focusable native controls

### Adapter tests

* Valid CMS content mapping
* Promotional content mapping
* Informational content mapping
* Missing required title returns `null`
* Missing required content logs a warning containing the entry ID
* Invalid tone returns `null`
* Default dismissal behavior

The goal is to test both the component's UI behavior and the boundary between CMS content and the reusable component.

---

## Open Questions for UX / Design

If this were a real design handoff, I would clarify:

1. What are the exact design tokens for the `info` and `promo` tones?
2. Should the CTA always use the primary action token, or should the CTA color vary by tone?
3. Should the icon be selected from a controlled icon set rather than accepting arbitrary icon names?
4. What should happen if the title exceeds one line on desktop?
5. Is truncation with an ellipsis the intended behavior for long titles?
6. What are the expected tablet and intermediate breakpoints?
7. Is `<aside>` the desired semantic treatment for every usage of this component, or could some placements require a different semantic structure?
8. What are the exact focus styles from the design system?

---

## Open Questions for Content / Digital Engagement

I would clarify:

1. Which fields are required in the CMS schema?
2. Should `tone` be validated by the CMS itself, or should the frontend always validate it?
3. Are CTA labels and URLs always provided together?
4. Should a CTA support both internal and external URLs?
5. If external URLs are supported, should they open in a new tab?
6. Should CTA links include tracking or analytics metadata?
7. Should dismissals persist across sessions?
8. If dismissal persists, is it per member, per device, or per browser?
9. How long should a dismissal remain effective?
10. Should a new version of the same promotion reset a previous dismissal?
11. Should dismissal events be tracked for analytics?
12. Are there A/B testing requirements that affect dismissal behavior or content rendering?

---

## AI Usage Disclosure

AI assistance was used throughout the exercise as a development and learning aid.

### AI tools used

ChatGPT was used to:

* Explain Angular 20+ / Angular 21 signal-based `input()` and `output()` APIs
* Explain Angular standalone component conventions
* Help structure the component architecture
* Suggest and explain a CMS adapter pattern
* Generate initial TypeScript interfaces and component scaffolding
* Assist with Angular template syntax using native control flow
* Assist with SCSS and responsive styling
* Suggest accessibility considerations
* Assist with unit test structure
* Troubleshoot TypeScript, Angular, and Vitest test errors
* Review the implementation against the exercise requirements

### What was kept

AI-generated suggestions were kept when they aligned with the requirements and the intended architecture.

Examples include:

* Using signal-based `input()` / `output()`
* Using `OnPush` change detection
* Using native Angular control flow
* Separating the CMS model from the component's domain model
* Using an adapter for CMS validation and normalization
* Keeping dismissal state controlled by the consuming application
* Using semantic HTML and accessible controls
* Using Flexbox for the primary card layout and a responsive full-width CTA
* Using semantic CSS custom properties instead of hardcoded color values

### What was reviewed or changed

AI output was reviewed and adapted during implementation rather than accepted blindly.

Examples include:

* Moving the adapter from the models directory into a dedicated adapters directory to better separate data models from transformation logic.
* Replacing `toHaveClass()` assertions when the available Vitest setup did not support that matcher.
* Updating the generated Angular application test after replacing the default Angular starter template.
* Choosing parent-controlled dismissal state to support future persistence and experimentation.
* Keeping the dismissal live region in the parent application so the announcement remains available after the callout is removed.
* Choosing `<aside>` instead of `role="alert"` because the callout represents supplementary promotional or informational content rather than urgent information.
* Using a simulated design-token layer because the actual production tokens were not provided.
* Adjusting the responsive implementation to use the Flexbox layout required by the implemented component.
* Reviewing and fixing generated code and tests when they did not match the actual application behavior.

AI was used as a pair-programming and learning tool. Generated code was reviewed, tested, and adjusted to fit the requirements and the implementation decisions documented above.

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

Open:

```text
http://localhost:4200
```

Run tests:

```bash
npm test
```

Build the application:

```bash
npm run build
```
