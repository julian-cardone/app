---
name: web-css
description:
  Apply this repository's web CSS conventions when writing or editing styles for React components.
  Use whenever a `.module.css` file is being created or modified, when adding or changing component
  styling, when introducing variants, when deciding between global and scoped CSS, or when reviewing
  styles for compliance. Trigger this skill even when the user phrases the request casually — "style
  this button", "add a new variant", "fix the spacing on the card", "this component looks wrong" —
  because the conventions here govern unit choice, design tokens, selectors, class naming, variants,
  and where styles are allowed to live. Do not rely on general CSS knowledge for this codebase; the
  rules here override common practice in several places (rem-only units, CSS Modules only, no BEM,
  shallow selectors, no inline styles). Applies to web React components. Mobile has its own
  conventions.
---

# Web CSS Standards

These are the styling conventions for web React components in this repository. Follow them whenever
writing or editing `.module.css` files, component styles, or global CSS.

The full prose version lives at `docs/standards/css.md` in the repository. This skill is the
operational summary — consult the source doc for extended rationale.

The styling philosophy is minimal, durable, predictable, and scalable. CSS should remain easy to
reason about as the application grows. Favor composition, consistency, and predictable refactoring
over short-term convenience.

This skill covers visual presentation. Layout, overflow, and flex-constraint rules are in the
`web-layout` skill. Component ownership and architectural boundaries are in
`web-frontend-philosophy`.

---

## Styling System

All component styles use CSS Modules. Each component imports its own co-located `.module.css` file:

```tsx
import styles from "./EventCard.module.css";

<div className={styles.card}>
  <h2 className={styles.title}>...</h2>
</div>;
```

Class names are scoped at build time, so short structural names (`card`, `title`, `content`,
`actions`, `header`) are appropriate inside a module.

Global CSS is restricted to three files only:

- `reset.css`
- `globals.css`
- `variables.css`

A rule that applies to a single feature or component does not belong in a global stylesheet.

---

## Design Tokens

Repeated visual values are extracted into design tokens in `variables.css`. Token categories
include:

- Colors
- Spacing
- Radii
- Typography
- Shadows
- Z-index layers
- Transition durations

A recurring visual value in component CSS indicates a missing token. Magic numbers do not belong in
component CSS.

---

## Units: rem, not px

Length values use `rem` unless the value is conceptually pixel-bound. This keeps layouts consistent
with user font-size preferences and avoids brittle pixel-based sizing.

Calculate `rem` directly from the intended pixel value at the browser default base of 16px:

```text
target_px / 16 = rem
```

Examples: `8px → 0.5rem`, `24px → 1.5rem`. Calculate precisely; do not round to arbitrary
increments.

`px` is permitted only for conceptually pixel-bound values:

- `1px` hairline borders
- Extremely small shadow blur values
- Browser APIs that operate in pixels

---

## Inline Styles

Inline `style` attributes are reserved for genuinely dynamic values that cannot be expressed as a
class:

- Runtime positioning values
- Dynamically computed transforms
- Animation delays derived from index
- Runtime CSS variable assignment

Inline styles do not replace reusable styling patterns. If a value is reusable, it belongs in a
class.

---

## Variants

Stable visual modes are expressed through variants — not scattered overrides or one-off modifier
classes.

```tsx
<Button variant="primary" />
<Button variant="secondary" />
<Input variant="ghost" />
```

```css
.button {
  /* base styles */
}
.buttonPrimary {
  /* primary variant */
}
.buttonSecondary {
  /* secondary variant */
}
```

A reusable primitive exposes only a small number of stable variants. A primitive requiring many
unrelated variants likely owns too much responsibility and should be split.

---

## File Placement

CSS files are co-located with their component:

```text
EventCard/
  EventCard.tsx
  EventCard.module.css
```

A `.module.css` file contains styles for one component only. Styles for sibling or child components
live in those components' own files.

---

## Styling Placement

Styling stays co-located with the concern it supports.

- Reusable primitives may contain only domain-agnostic styling.
- Feature-specific presentation belongs in feature components.
- Feature-specific styling does not appear inside shared primitives.

A feature-specific rule appearing inside a shared primitive is a leak. Move it to the feature
component.

---

## Class Naming

camelCase within a module. Short and structural is fine — module scoping already provides
namespacing.

```css
.panel {
  /* ... */
}
.header {
  /* ... */
}
.content {
  /* ... */
}
```

Variants and modifiers use camelCase suffixes on the base name:

```css
.button {
  /* ... */
}
.buttonPrimary {
  /* ... */
}
.buttonDisabled {
  /* ... */
}
```

**BEM (`block__element--modifier`) is not used.** CSS Modules already solve namespacing.

---

## Selectors

Selectors stay shallow. Component CSS targets its own structure directly.

```css
/* Wrong — even two levels creates coupling between markup structure and styling */
.card .title {
}

/* Right */
.title {
}
```

Descendant selectors couple styling to markup structure. Compose through structure and variants
instead of specificity battles.

---

## Minimalism

Every CSS declaration must do work. Remove rules that are not actively required.

The principles:

- Repeated values become tokens.
- Selectors stay shallow.
- Overrides are avoided.
- Variants are preferred over branching selectors.
- Layout bugs are fixed at the source (see the `web-layout` skill).
- Generic abstractions are introduced cautiously.

CSS must stay predictable under refactoring. A future engineer or AI agent should be able to modify
styling confidently without unintended side effects.

---

## Common Failures

The rules above prevent several recurring styling failures. For each failure, the cause and result
are documented in `docs/standards/web-css.md`. The summary:

### Magic numbers in component CSS

Hardcoded values instead of tokens → inconsistent values, brittle refactoring.

### Feature-specific rules in shared primitives

Domain rules in `components/ui/` → coupled primitives, leaking feature concerns.

### `px` where `rem` is required

Pixel sizing → ignores user font-size preferences, inconsistent accessibility behavior.

### Inline styles replacing reusable classes

`style={{}}` for static values → values can't be tokenized or reused.

### Variants expressed as scattered overrides

One-off modifier classes instead of defined variants → fragile, inconsistent visual treatment.

### Deep descendant selectors

Targeting markup structure instead of direct classes → styling coupled to DOM, silent breakage on
refactor.

---

## Common Mistakes to Avoid

Recurring violations to watch for in review or when writing styles:

- Pixel values where `rem` was required (`padding: 12px` instead of `0.75rem`).
- Rounded `rem` values instead of precise conversions from the pixel target.
- Hardcoded color, spacing, radius, or duration values that should reference a token from
  `variables.css`.
- A rule applying to a single component or feature placed in `globals.css`.
- Inline `style` attributes used for static values that should be a class.
- BEM-style class names (`card__header--active`) in a module file.
- Deep descendant selectors (`.card .content .header`) instead of direct class targeting.
- A shared primitive accumulating feature-specific styling rules.
- A primitive that has grown five-plus unrelated variants — split it instead of adding more.

---

## When to Consult the Related Standards

- For flex layout, scroll ownership, and the `min-height: 0` / `min-width: 0` / `align-items` rules
  that govern shrinking and overflow: `web-layout`.
- For component design, state ownership, the `className` prop convention, and when to split a
  primitive: `web-frontend-philosophy`.
- For where files live and the boundary between `components/ui/` and `features/`:
  `web-project-structure`.
