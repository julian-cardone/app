---
title: Web CSS Standards
doc_type: standard
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-05-08
related:
  [
    "docs/standards/frontend-philosophy.md",
    "docs/standards/project-structure.md",
    "docs/standards/web-layout.md",
    "docs/standards/documentation.md",
  ]
tags: [standards]
---

# Web CSS Standards

This document defines the styling conventions for frontend code.

It covers the styling system, CSS ownership boundaries, variants, naming, design tokens, and file
organization.

The styling philosophy is minimal, durable, predictable, and scalable.

CSS should remain easy to reason about as the application grows. Styling decisions should favor
composition, consistency, and predictable refactoring over short-term convenience.

The goal of these standards is to ensure that features can be added, layouts adjusted, and
components refactored without creating fragile coupling or cascading visual regressions.

For related layout and component architecture rules, see [Web Layout](./web-layout.md) and
[Frontend Philosophy](./frontend-philosophy.md).

---

## Styling Scope

CSS is responsible for visual presentation.

Layout ownership, overflow behavior, and constraint management are defined in [Layout](./layout.md).

Component ownership and architectural boundaries are defined in
[Frontend Philosophy](./frontend-philosophy.md).

---

## Styling System

All component styles must use CSS Modules.

Each component imports its own `.module.css` file.

```tsx
import styles from "./EventCard.module.css";

<div className={styles.card}>
  <h2 className={styles.title}>...</h2>
</div>;
```

Class names within a CSS Module are scoped at build time.

Scoped names may therefore remain short and structural:

- `card`
- `title`
- `content`
- `actions`
- `header`

Global CSS is restricted to:

- `reset.css`
- `globals.css`
- `variables.css`

Global rules must only exist when the rule is genuinely global.

A rule applying to a single feature or component must not appear in a global stylesheet.

---

## Design Tokens

Repeated visual values must be extracted into design tokens.

Design tokens live in `variables.css`.

Examples include:

- Colors
- Spacing
- Radii
- Typography
- Shadows
- Z-index layers
- Transition durations

Magic numbers must not appear repeatedly throughout component CSS.

A recurring visual value indicates a missing token.

---

## Units

Length values should use `rem` rather than `px` unless the value is conceptually pixel-bound.

This keeps layouts consistent with user font-size preferences and avoids brittle pixel-based sizing
assumptions.

`rem` values should be calculated directly from the intended pixel value using the browser default
base size of `16px`.

```text
target_px / 16 = rem
```

Examples:

- `8px → 0.5rem`
- `24px → 1.5rem`

Values must be calculated precisely rather than rounded to arbitrary increments.

`px` is permitted only for conceptually pixel-bound values:

- `1px` hairline borders
- Extremely small shadow blur values
- Browser APIs that operate in pixels

---

## Inline Styles

Inline `style` attributes must not be used unless the value is genuinely dynamic and cannot be
expressed through a class.

Acceptable inline usage includes:

- Runtime positioning values
- Dynamically computed transforms
- Animation delays derived from index
- Runtime CSS variable assignment

Inline styles must not replace reusable styling patterns.

---

## Variants

Stable visual modes must be expressed through variants.

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

Variants are preferred over scattered overrides or one-off modifier classes.

A reusable primitive should expose only a small number of stable variants.

A primitive requiring many unrelated variants likely owns too much responsibility and should be
split.

---

## File Placement

CSS files must remain co-located with the component they style.

```text
EventCard/
  EventCard.tsx
  EventCard.module.css
```

A CSS file must contain only styles for its associated component.

Styles for sibling or child components belong in those components' own files.

See [Project Structure](./project-structure.md) for broader folder organization rules.

---

## Styling Placement

Styling should remain co-located with the concern it supports.

Reusable primitives may contain only domain-agnostic styling.

Feature-specific presentation belongs in feature components.

Feature-specific styling must not appear inside shared primitives.

See [Frontend Philosophy](./frontend-philosophy.md) for component ownership boundaries.

---

## Class Naming

Within CSS Modules, class names use camelCase.

Class names may remain short and structural because module scoping already provides namespacing.

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

Variants and modifiers use camelCase suffixes:

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

BEM naming must not be used.

CSS Modules already solve namespacing.

---

## Selectors

Selectors must remain shallow.

Component CSS should target the component's own structure directly.

Deep descendant selectors indicate brittle coupling between markup and styling.

```css
/* Avoid */
.card .title {
}

/* Prefer */
.title {
}
```

Even a two-level descendant selector creates coupling between markup structure and styling. CSS
should compose through structure and variants rather than selector specificity battles.

---

## Common Failures

The rules above prevent several recurring styling failures.

### Magic numbers in component CSS

A value is hardcoded directly in a component rather than referencing a token.

Result:

- Inconsistent values across components
- Refactoring requires hunting down every occurrence
- Design changes require multiple edits

---

### Feature-specific rules in shared primitives

A rule describing domain behavior or feature-specific layout appears in `components/ui/`.

Result:

- Shared primitives become coupled to feature concerns
- Reuse breaks when the feature changes
- Domain knowledge leaks into the component layer

---

### `px` used where `rem` is required

A sizing value uses pixels rather than `rem`.

Result:

- Layout ignores user font-size preferences
- Sizing behaves inconsistently across accessibility settings

---

### Inline styles replacing reusable classes

A static visual value is applied via `style={{}}` rather than a class.

Result:

- Values cannot be reused or tokenized
- Styling is invisible to design-token tooling
- Overrides become inconsistent

---

### Variants expressed as scattered overrides

Visual modes are handled through one-off modifier classes or prop-driven conditional styles rather
than defined variants.

Result:

- Visual treatment is fragile and inconsistent
- Adding a mode requires changes in multiple places
- The component's visual contract becomes implicit

---

### Deep descendant selectors

A selector targets markup structure rather than a direct class.

Result:

- Styling is coupled to DOM structure
- Markup refactoring breaks styles silently
- Specificity conflicts accumulate

---

## Minimalism

CSS rules must be removed when they are not actively required.

Each declaration must do work.

The following principles apply:

- Repeated values become tokens
- Selectors remain shallow
- Overrides are avoided
- Variants are preferred over branching selectors
- Layout bugs are fixed at the source
- Generic abstractions are introduced cautiously

CSS should remain predictable under refactoring.

A future engineer or AI agent should be able to modify styling confidently without unintended side
effects.
