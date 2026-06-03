---
name: web-layout
description: Apply this repository's web flex layout conventions when writing or debugging layout CSS for React web components. Use whenever a layout is being built or fixed — flex columns, flex rows, scrollable regions, side-by-side panes, table cells, page shells, modals, sidebars, card bodies, tab panels — and whenever a layout symptom appears: content escaping its container, a scroll bar that should exist but doesn't, stacked scroll bars, text that won't truncate, a table that stretches past its parent, a page that scrolls when it should fit, or anything fixed by reaching for `overflow: hidden`. Trigger on casual phrasings too — "make this scroll", "this is overflowing", "the sidebar is blowing out", "why won't this shrink", "fix the layout". Do not rely on general flex knowledge here: this repo has specific rules about `min-height: 0`, `min-width: 0`, `align-items: stretch`, and which role (page, layout container, or reusable component) owns scrolling and clipping. The standard recipes here are the approved patterns; deviation requires a justified reason. Applies to web React components. Mobile has its own conventions.
---

# Web Layout

These are the flex layout mechanics for this repository. Follow them whenever writing or fixing
layout CSS, debugging overflow or scroll issues, or deciding which component owns sizing and
clipping.

The full prose version lives at `docs/standards/layout.md` in the repository. This skill is the
operational summary — consult the source doc for extended rationale.

The layout philosophy is durable, predictable, and composition-oriented. Layout behavior must remain
stable under refactoring. Components must behave consistently regardless of where they are rendered.

This skill covers layout, overflow, and constraint chains. For styling rules, variants, and tokens,
see the `web-css` skill. For component architecture and ownership boundaries, see
`web-frontend-philosophy`.

---

## Layout Ownership

Layout responsibility is divided across three roles. Preserve the boundary.

| Role                  | Owns                                                  |
| --------------------- | ----------------------------------------------------- |
| Page                  | Route-level layout and major content arrangement      |
| Layout container      | Constraints, overflow boundaries, clipping, scrolling |
| Reusable UI component | Internal structure and intrinsic shape                |

A **layout container** is any wrapper whose job is to constrain and arrange child content:

- A pane
- A modal body
- A sidebar
- A card body
- A tab panel
- A section wrapper

Reusable components do not own:

- Scroll boundaries
- Viewport assumptions
- Page-level positioning
- Layout orchestration
- Hard-coded external sizing

Behavioral concerns — workflow logic, backend integration, domain models, and feature-specific
behavior — are a separate category. Those rules live in `frontend-philosophy`, not here.

Reusable components stay layout-agnostic. This applies regardless of where the CSS rule is written —
a reusable component's `.module.css` must not define external sizing, scroll boundaries, viewport
assumptions, or page-level positioning. Pages and layout containers constrain them.

---

## Constraint Chains

Flex layouts operate through chains of constraints. A missing constraint at any level breaks
containment below it.

Most layout bugs trace to one of:

- Missing `min-width: 0`
- Missing `min-height: 0`
- Incorrect `align-items`
- Incorrect ownership of scrolling
- Multiple competing scroll containers

Debugging focuses on locating the broken constraint rather than masking the symptom.

---

## The `min-height: 0` Rule

In a flex column, children default to `min-height: auto` — they refuse to shrink below their content
height. This breaks:

- Scroll containers (never receive a constrained height)
- Overflow clipping (nothing to clip against)
- Page bounds (content pushes past the viewport instead of scrolling)

Any flex child that must shrink, scroll, or contain a scrolling descendant declares:

```css
min-height: 0;
```

Full example:

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

Apply this at **every shrinking level** of the flex column chain. Skipping one level breaks
scrolling below it.

---

## The `min-width: 0` Rule

In a flex row, children default to `min-width: auto` — they refuse to shrink below their intrinsic
content width. This breaks:

- Text containment (overflows horizontally)
- Container width (stretches beyond the parent)
- Tables (grow indefinitely)
- Side-by-side layouts (adjacent panes get pushed offscreen)

Any flex child that must shrink horizontally declares:

```css
min-width: 0;
```

Full example:

```css
.row {
  display: flex;
}

.cell {
  flex: 1;
  min-width: 0;
}
```

Apply throughout the shrinking chain. `min-width: 0` only works when ancestors use
`align-items: stretch` (the default) — an ancestor overriding this makes `min-width: 0` ineffective
on all descendants. See `align-items` and Width Inheritance below.

Common use cases:

- Table cells with arbitrary content
- Side-by-side layout regions
- Resizable panes
- Content-heavy cards
- Flex children containing long text

---

## `align-items` and Width Inheritance

A flex container's `align-items` controls cross-axis sizing. The default is `stretch`, which lets
descendants inherit constrained width from the chain.

Changing `align-items` to `center`, `flex-start`, or `flex-end` makes children intrinsically sized
rather than width-constrained. `min-width: 0` then stops working because no upstream constrained
width exists.

```css
/* Avoid — breaks the chain */
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Preferred — keeps the chain intact */
.page {
  display: flex;
  flex-direction: column;
  /* align-items: stretch is the default */
}
```

Use `align-items: center` only when intrinsic-width behavior is intentionally desired. Never on a
container participating in a constrained layout chain.

---

## Scroll Ownership

Scroll boundaries belong to pages or layout containers. Reusable components do not own scrolling.

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

Each scrollable region has **exactly one** scroll container. Nested scroll ownership produces:

- Double scrollbars
- Unreachable content
- Broken keyboard scrolling
- Inconsistent wheel behavior
- Fragile layout interactions

Scroll ownership stays explicit and singular.

---

## Stretch and Content Sizing Cheatsheet

| Behavior                        | Pattern                          |
| ------------------------------- | -------------------------------- |
| Fill remaining vertical space   | `flex: 1; min-height: 0;`        |
| Fill remaining horizontal space | `flex: 1; min-width: 0;`         |
| Size to content, never shrink   | `flex-shrink: 0;`                |
| Preferred width with shrinking  | `flex: 1 <basis>; min-width: 0;` |

Layouts requiring exceptions document the reason in a comment.

---

## Column Sizing

Avoid hard widths. Declare preferred basis values and let flex handle distribution.

```css
/* Avoid */
.cell {
  width: 12rem;
}

/* Preferred */
.cell {
  flex: 1 14rem;
} /* grow and shrink, preferred starting width of 14rem */
```

`flex: 1 14rem` is shorthand for `flex-grow: 1; flex-shrink: 1; flex-basis: 14rem`. It gives the
column a sensible default width while allowing it to grow into available space and shrink when
constrained. Avoid large minimum widths unless they represent a genuine product constraint.

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

The header sizes to content. The content region fills remaining space and owns scrolling.

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

Each region shrinks independently. Long content in one region does not force the other outside the
viewport.

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

The basis establishes preferred sizing while still allowing flexible growth and shrinking.

---

## Decorative Clipping Only

`overflow: hidden` is permitted only for decorative clipping:

- Rounded-corner image clipping
- Decorative overlay masking
- Purely visual overflow masking

```css
.card {
  border-radius: 1rem;
  overflow: hidden;
}
```

Never use `overflow: hidden` to suppress broken layout behavior. If content escapes a container, the
root cause is upstream — usually a missing `min-width: 0`, missing `min-height: 0`, incorrect
`align-items`, or incorrect scroll ownership. Fix the chain; do not mask the symptom.

---

## Debugging Checklist

When a layout misbehaves, work the chain from outside in. The cause is almost always one of these:

1. **Content overflows the viewport instead of scrolling** → a scroll container exists, but an
   ancestor in its flex column chain is missing `min-height: 0`. The scroll child never gets a
   constrained height. Walk up the chain and add `min-height: 0` at every flex column level.

2. **Text or table content blows out a flex row** → a child needs `min-width: 0`. Apply at every
   level of the row chain that should shrink.

3. **`min-width: 0` on a child has no effect** → an ancestor uses `align-items: center` (or
   `flex-start` / `flex-end`), making children intrinsic-width. Revert to `align-items: stretch`
   (the default) on the ancestor that starts the constrained chain.

4. **Reusable component breaks in a new context** → the component declares its own `overflow`,
   `max-height`, or external sizing. Strip those rules from the component and move them to the
   wrapping layout container.

5. **Two scrollbars appear in the same area** → scroll containers are stacked. Remove the inner one
   and let the outer layout container own the boundary.

6. **You're reaching for `overflow: hidden` to fix a layout problem** → stop. Find the missing
   `min-width: 0`, `min-height: 0`, or `align-items: stretch` upstream. `overflow: hidden` is only
   for decorative clipping.

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

---

## When to Consult the Related Standards

- For unit choices, variants, design tokens, and class naming: `web-css`.
- For component ownership boundaries, the `className` prop convention, and when a primitive should
  be split: `web-frontend-philosophy`.
- For where pages, layout containers, and feature components live in the folder tree:
  `web-project-structure`.
