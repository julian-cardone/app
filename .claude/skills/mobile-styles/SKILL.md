---
name: mobile-styles
description:
  Apply this repository's React Native styling conventions when writing or editing styles for mobile
  components. Use whenever a `StyleSheet.create` block is being written or modified, when adding or
  changing component styling, when introducing variants, when deciding what goes in a shared token
  module versus a component, or when reviewing styles for compliance. Trigger this skill even when
  the user phrases the request casually — "style this button", "add a new variant", "fix the spacing
  on the card", "this component looks wrong" — because the conventions here govern unit choice,
  design tokens, style keys, variants, platform-specific styling, and where styles are allowed to
  live. Do not rely on general CSS or web knowledge for this codebase; React Native styling differs
  from web CSS in several load-bearing ways (unitless dp not rem/px, StyleSheet objects not CSS
  files, no selectors, style arrays for variants, split iOS/Android shadows). Applies to React
  Native mobile components. Web has its own conventions.
---

# Mobile Styling Standards

These are the styling conventions for React Native components in this repository. Follow them
whenever writing or editing `StyleSheet` blocks, component styles, or shared style tokens.

The styling philosophy is minimal, durable, predictable, and scalable — identical in spirit to the
web standard. Styles should remain easy to reason about as the app grows. Favor composition,
consistency, and predictable refactoring over short-term convenience.

This skill covers visual presentation. Flex layout, shrinking, scroll ownership, and safe-area rules
are in the `mobile-layout` skill. Component ownership and architectural boundaries are in
`mobile-frontend-philosophy`.

React Native has no CSS, no DOM, and no stylesheet cascade. There are no selectors, no inheritance
(except limited text-style inheritance inside nested `<Text>`), and no media queries. A style is a
plain object of camelCase properties applied directly to a component via its `style` prop. Most web
CSS intuition about specificity and cascade does not apply.

---

## Styling System

All component styles use `StyleSheet.create`. Each component defines its own co-located styles:

```tsx
import { StyleSheet, View, Text } from "react-native";

export function EventCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    /* ... */
  },
  title: {
    /* ... */
  },
});
```

Because there is no global namespace to pollute, short structural keys (`card`, `title`, `content`,
`actions`, `header`) are appropriate inside a component's `StyleSheet`.

`StyleSheet.create` is preferred over inline object literals for all static styles: it keeps styles
out of the render path, groups them in one readable block, and makes them reusable. Compose multiple
styles with an array — later entries win:

```tsx
<View style={[styles.card, styles.cardElevated]} />
```

There is no equivalent of a "global stylesheet." Shared values live in the token module (below), not
in a catch-all style file.

---

## Design Tokens

Repeated visual values are extracted into design tokens in a single shared module (e.g.
`styles/tokens.ts`), exported as typed objects. Token categories:

- Colors
- Spacing
- Radii
- Typography (size, weight, line height)
- Shadows (see the platform note below)
- Z-index layers
- Animation durations

```ts
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const colors = {
  /* ... */
} as const;
```

A recurring visual value in component styles indicates a missing token. Magic numbers do not belong
in component `StyleSheet` blocks. This is the mobile analog of the web `variables.css` rule — same
principle, expressed as a typed module instead of CSS custom properties.

---

## Units: unitless dp, not rem or px

React Native has no `rem` and no `px`. Numeric length values are **density-independent pixels (dp)**
— plain unitless numbers that React Native scales per device automatically:

```ts
{ padding: 16, borderRadius: 12, marginTop: 8 }
```

There is no conversion math and no base-16 calculation. Write the intended dp value directly.

Specifics:

- **Numbers** are dp. Use them for nearly everything.
- **Percentage strings** (`"50%"`) are permitted where a proportion of the parent is genuinely
  intended.
- **Hairline borders**: use `StyleSheet.hairlineWidth` for the thinnest device-appropriate line
  rather than a hardcoded `1`.
- Never append `"px"` to a value — it is invalid in React Native and will throw or be ignored.

**Font scaling is the mobile analog of the web `rem` rationale.** On the web, `rem` exists so
layouts respect the user's font-size preference. On mobile, `<Text>` respects the OS Dynamic Type /
font scaling setting by default. Do not disable this with `allowFontScaling={false}` except for
genuinely fixed-size UI (e.g. a numeric badge that must not reflow), and document the reason when
you do.

---

## Inline and Dynamic Styles

Inline style objects are reserved for genuinely dynamic values that cannot be expressed as a static
style:

- Runtime positioning or sizing values
- Dynamically computed transforms
- Animation values (Animated / Reanimated)
- Values derived from props or index (e.g. a staggered delay)

```tsx
<View style={[styles.row, { transform: [{ translateX: offset }] }]} />
```

Static, reusable values always belong in `StyleSheet.create` and are composed via the style array —
not inlined. An inline object for a static value is a missed token or missed style key.

---

## Variants

Stable visual modes are expressed through variants, applied with the style array — not scattered
overrides or ad-hoc conditionals sprinkled through markup.

```tsx
<Button variant="primary" />
<Button variant="secondary" />
```

```tsx
const styles = StyleSheet.create({
  button: {
    /* base */
  },
  buttonPrimary: {
    /* primary variant */
  },
  buttonSecondary: {
    /* secondary variant */
  },
});

const variantStyle = {
  primary: styles.buttonPrimary,
  secondary: styles.buttonSecondary,
}[variant];

<Pressable style={[styles.button, variantStyle]} />;
```

A reusable primitive exposes only a small number of stable variants. A primitive requiring many
unrelated variants likely owns too much responsibility and should be split.

---

## File Placement

Styles are co-located with their component:

```text
EventCard/
  EventCard.tsx        // StyleSheet defined here, at the bottom of the file
```

A component's `StyleSheet` contains styles for that component only. Styles for sibling or child
components live in those components' own files. Keeping the `StyleSheet.create` block at the bottom
of the component file is the default; extract to a separate `EventCard.styles.ts` only when the
block grows large enough to hurt readability.

---

## Styling Placement

Styling stays co-located with the concern it supports.

- Reusable primitives may contain only domain-agnostic styling.
- Feature-specific presentation belongs in feature components.
- Feature-specific styling does not appear inside shared primitives.

A feature-specific rule appearing inside a shared primitive is a leak. Move it to the feature
component.

---

## Style Keys and Naming

Style object keys use camelCase. Short and structural is fine — keys are scoped to the component's
own `StyleSheet`, so there is no namespacing concern.

```ts
const styles = StyleSheet.create({
  panel: {
    /* ... */
  },
  header: {
    /* ... */
  },
  content: {
    /* ... */
  },
});
```

Variants and modifiers use camelCase suffixes on the base key: `button`, `buttonPrimary`,
`buttonDisabled`.

**BEM and class-name conventions do not apply** — there are no class names in React Native. These
are object keys, not CSS classes.

---

## No Selectors — Compose Through Structure

React Native has no selectors at all. You cannot target a descendant, a sibling, or a state from
within a style. There is nothing to keep "shallow" because the concept does not exist.

The principle the web skill expresses through shallow selectors still holds in a different form:
**style each element directly, and compose through component structure and variants — never reach
into a child's internals.** A parent does not style its child; the child owns its own styles and
exposes variants or props. Coupling presentation across component boundaries is the failure to
avoid.

Limited exception: text styles (color, font, weight) inherit down through nested `<Text>` elements.
This is the only inheritance React Native provides; rely on it for text only.

---

## Shadows and Platform Differences

Shadows are not a single cross-platform property. They must be set per platform:

- **iOS**: `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`.
- **Android**: `elevation` (a single number; Android renders its own shadow from it).

Define shadow tokens that bundle both so callers get a correct shadow on both platforms from one
reference:

```ts
export const shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
} as const;
```

Other properties also differ by platform (e.g. `fontFamily` weights, `letterSpacing` behavior). When
a value must differ, use `Platform.select({ ios, android })` rather than branching in render.

---

## Minimalism

Every style declaration must do work. Remove declarations that are not actively required.

The principles:

- Repeated values become tokens.
- Compose through style arrays and variants, not conditional override soup.
- Static styles live in `StyleSheet.create`; only dynamic values go inline.
- Layout bugs are fixed at the source (see the `mobile-layout` skill).
- Generic abstractions are introduced cautiously.

Styles must stay predictable under refactoring. A future engineer or AI agent should be able to
modify styling confidently without unintended side effects.

---

## Common Failures

### Magic numbers in component styles

Hardcoded values instead of tokens → inconsistent values, brittle refactoring.

### Feature-specific styles in shared primitives

Domain styling inside `components/ui/` → coupled primitives, leaking feature concerns.

### Hardcoded `"px"` or invented units

Appending `"px"` or assuming `rem` → invalid in React Native; values throw or are ignored.

### Inline objects replacing reusable styles

Inline `style={{}}` for static values → values can't be tokenized, reused, or kept out of render.

### Variants expressed as scattered conditionals

One-off inline conditionals instead of defined variants → fragile, inconsistent visual treatment.

### Single-platform shadows

`elevation` only (invisible on iOS) or `shadow*` only (invisible on Android) → shadow missing on
half your users' devices.

---

## Common Mistakes to Avoid

- Using `rem`/`px`, or appending any unit string to a numeric value.
- Hardcoded color, spacing, radius, or duration values that should reference a token.
- Inline `style` objects used for static values that should be a keyed style.
- A shared primitive accumulating feature-specific styling.
- A primitive that has grown five-plus unrelated variants — split it instead of adding more.
- Setting only `elevation` or only the iOS `shadow*` props.
- Disabling `allowFontScaling` without a documented reason.
- Attempting to style a child from a parent instead of letting the child own its styles.

---

## When to Consult the Related Standards

- For flex direction, shrinking, scroll ownership, safe areas, and the `flexShrink` / `flex: 1`
  rules that govern sizing and overflow: `mobile-layout`.
- For component design, state ownership, the `style` prop convention, and when to split a primitive:
  `mobile-frontend-philosophy`.
- For where files live and the boundary between `components/ui/` and `features/`:
  `mobile-project-structure`.
