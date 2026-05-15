---
title: Web Layout
doc_type: standard
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-05-08
related:
  [
    "docs/standards/web-css.md",
    "docs/standards/frontend-philosophy.md",
    "docs/standards/project-structure.md",
    "docs/standards/documentation.md",
  ]
tags: [standards]
---

# Web Layout

This document defines the layout mechanics used throughout the application.

It covers flex behavior, shrinking rules, overflow ownership, scrolling boundaries, and layout
constraint chains.

The layout philosophy is durable, predictable, and composition-oriented.

Layout behavior must remain stable under refactoring. Components should behave consistently
regardless of where they are rendered.

For styling rules, variants, and design-token conventions, see [Web CSS Standards](./web-css.md).

For component architecture and ownership boundaries, see
[Frontend Philosophy](./frontend-philosophy.md).

---

## Layout Ownership

Layout responsibility is divided across three roles.

The ownership boundary between them must remain explicit.

| Role                  | Owns                                                  |
| --------------------- | ----------------------------------------------------- |
| Page                  | Route-level layout and major content arrangement      |
| Layout container      | Constraints, overflow boundaries, clipping, scrolling |
| Reusable UI component | Internal structure and intrinsic shape                |

A layout container may be:

- A pane
- A modal body
- A sidebar
- A card body
- A tab panel
- A section wrapper

Any wrapper whose job is to constrain and arrange child content is a layout container.

Reusable components must not own:

- Scroll boundaries
- Viewport assumptions
- Page-level positioning
- Layout orchestration
- Hard-coded external sizing

Behavioral concerns — workflow logic, backend integration, domain models, and feature-specific
behavior — are a separate category governed by [Frontend Philosophy](./frontend-philosophy.md), not
by this document.

Reusable components should remain layout-agnostic.

Layout ownership applies regardless of where the CSS rule is written. A reusable component's CSS
must not define external sizing, scroll boundaries, viewport assumptions, or page-level positioning.

Pages and layout containers constrain them.

---

## Constraint Chains

Flex layouts operate through chains of constraints.

A missing constraint at any level breaks containment below it.

Most layout bugs are caused by one of the following:

- Missing `min-width: 0`
- Missing `min-height: 0`
- Incorrect `align-items`
- Incorrect ownership of scrolling
- Multiple competing scroll containers

Layout debugging should focus on locating the broken constraint chain rather than masking symptoms.

---

## The `min-height: 0` Rule

In a flex column, children default to `min-height: auto`.

This prevents them from shrinking below their content height.

When this occurs:

- Scroll containers never receive a constrained height
- Overflow cannot clip
- Content pushes past the viewport instead of scrolling

Any flex child that must shrink, scroll, or contain a scrolling descendant must declare:

```css
min-height: 0;
```

Example:

```css
.parent {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.child {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
```

This rule must be applied at every shrinking level in the flex column chain.

Skipping a single level breaks scrolling below it.

---

## The `min-width: 0` Rule

In a flex row, children default to `min-width: auto`.

This prevents them from shrinking below their intrinsic content width.

When this occurs:

- Text overflows horizontally
- Containers stretch beyond their parent
- Tables grow indefinitely
- Adjacent panes are pushed outside the viewport

Any flex child that must shrink horizontally must declare:

```css
min-width: 0;
```

Example:

```css
.row {
  display: flex;
}

.cell {
  flex: 1;
  min-width: 0;
}
```

This rule must be applied throughout the shrinking chain.

Skipping a single level breaks containment below it.

`min-width: 0` only works when ancestors use `align-items: stretch` (the default). An ancestor
overriding this breaks the constrained width chain and makes `min-width: 0` ineffective on all
descendants. See [`align-items` and Width Inheritance](#align-items-and-width-inheritance) below.

Common use cases include:

- Table cells with arbitrary content
- Side-by-side layout regions
- Resizable panes
- Content-heavy cards
- Flex children containing long text

---

## `align-items` and Width Inheritance

A flex container's `align-items` value controls cross-axis sizing behavior.

The default value is:

```css
align-items: stretch;
```

This allows descendants to inherit constrained width from the layout chain.

Changing `align-items` to:

- `center`
- `flex-start`
- `flex-end`

causes children to become intrinsically sized rather than width-constrained.

As a result, `min-width: 0` may stop functioning because no upstream constrained width exists.

```css
/* Avoid */
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Preferred */
.page {
  display: flex;
  flex-direction: column;
  /* align-items: stretch is the default */
}
```

`align-items: center` should only be used when intrinsic-width behavior is intentionally desired.

It must not be used on containers participating in a constrained layout chain.

---

## Scroll Ownership

Scroll boundaries belong to pages or layout containers.

Reusable components must not own scrolling.

```tsx
/* Avoid */
<Table />
```

```css
.table {
  overflow-y: auto;
}
```

```tsx
/* Preferred */
<div className={styles.scrollRegion}>
  <Table />
</div>
```

```css
.scrollRegion {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
```

Each scrollable region must have exactly one scroll container.

Nested scroll ownership produces:

- Double scrollbars
- Unreachable content
- Broken keyboard scrolling
- Inconsistent wheel behavior
- Fragile layout interactions

Scroll ownership must remain explicit and singular.

---

## Stretch and Content Sizing

The following patterns cover the majority of layout behavior.

| Behavior                        | Pattern                          |
| ------------------------------- | -------------------------------- |
| Fill remaining vertical space   | `flex: 1; min-height: 0;`        |
| Fill remaining horizontal space | `flex: 1; min-width: 0;`         |
| Size to content, never shrink   | `flex-shrink: 0;`                |
| Preferred width with shrinking  | `flex: 1 <basis>; min-width: 0;` |

Layouts requiring exceptions should document the reason.

---

## Column Sizing

Hard widths should generally be avoided.

Columns should declare preferred basis values and allow flex distribution to handle resizing.

```css
/* Avoid */
.cell {
  width: 12rem;
}

/* Preferred */
.cell {
  flex: 1 14rem; /* grow and shrink, preferred starting width of 14rem */
}
```

`flex: 1 14rem` is shorthand for `flex-grow: 1; flex-shrink: 1; flex-basis: 14rem`. It gives the
column a sensible default width while allowing it to grow into available space and shrink when
constrained.

This approach:

- Produces sensible default widths
- Allows graceful shrinking
- Reduces brittle layout assumptions
- Improves responsiveness naturally

Large minimum widths should also be avoided unless they represent a genuine product constraint.

---

## Standard Recipes

### Fixed header with scrolling content

```css
.parent {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.header {
  flex-shrink: 0;
}

.content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
```

The header sizes to content.

The content region fills remaining space and owns scrolling.

---

### Side-by-side shrinking regions

```css
.row {
  display: flex;
  flex: 1;
  min-height: 0;
}

.left {
  flex: 1;
  min-width: 0;
}

.right {
  flex: 1;
  min-width: 0;
}
```

Each region shrinks independently.

Long content in one region does not force the other region outside the viewport.

---

### Table cell that shrinks correctly

```css
.row {
  display: flex;
}

.cell {
  flex: 1 5rem;
  min-width: 0;
}
```

The basis value establishes preferred sizing while still allowing flexible growth and shrinking.

---

## Decorative Clipping

`overflow: hidden` is permitted only for decorative clipping.

Examples include:

- Rounded-corner image clipping
- Decorative overlay masking
- Purely visual overflow masking

```css
.card {
  border-radius: 1rem;
  overflow: hidden;
}
```

`overflow: hidden` must never be used to suppress broken layout behavior.

If content escapes a container, the root cause is usually:

- Missing `min-width: 0`
- Missing `min-height: 0`
- Incorrect flex constraints
- Incorrect scroll ownership
- Broken constraint chains

The constraint chain must be corrected rather than visually masking the symptom.

---

## Common Failures

The rules above prevent several recurring layout failures.

### Missing `min-height: 0`

A scroll container never receives a constrained height.

Result:

- Content overflows the viewport
- Scrolling never activates

---

### Missing `min-width: 0`

A flex child refuses to shrink horizontally.

Result:

- Text overflow
- Blown-out layouts
- Horizontal scrolling

---

### Incorrect `align-items`

An ancestor uses intrinsic-width sizing unintentionally.

Result:

- `min-width: 0` stops functioning
- Width constraints collapse

---

### Nested scroll containers

Multiple regions compete for scroll ownership.

Result:

- Double scrollbars
- Broken interaction behavior
- Fragile scrolling UX

---

### Layout bugs hidden with `overflow: hidden`

Visual overflow disappears, but the constraint problem remains unresolved.

Result:

- Fragile layouts
- Hidden clipping bugs
- Unpredictable resizing behavior

---

## Mental Model

```text
Page
  owns major route-level layout

Layout container
  owns constraints, overflow, and scrolling

Reusable UI component
  owns structure and visual behavior

Rows and cells
  require min-width: 0 to shrink

Scrollable flex descendants
  require min-height: 0 to shrink
```

This model is the source of truth.
