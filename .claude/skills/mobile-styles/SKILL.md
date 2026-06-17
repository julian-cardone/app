---
name: mobile-styles
description:
  Apply this repository's React Native styling conventions when writing or editing StyleSheet
  blocks, tokens, typography, shadows, static/dynamic styles, units, local style constants, or style
  file placement. Applies to React Native mobile. Web CSS has separate rules.
---

# Mobile Styling Standards

React Native has no CSS cascade, selectors, class names, media queries, `rem`, or `px`. Styles are
plain objects applied directly through `style` props.

This skill owns visual styling. Flex, scroll, keyboard, and safe-area behavior live in
`mobile-layout`. Component ownership lives in `frontend-philosophy`. File placement lives in
`mobile-project-structure`.

---

## StyleSheet First

Static styles belong in `StyleSheet.create` at the bottom of the component file.

```tsx
export function EventCard() {
  return <View style={styles.card}>{...}</View>;
}

const styles = StyleSheet.create({
  card: {
    /* ... */
  },
});
```

Use inline style objects only for genuinely dynamic values:

- safe-area values
- runtime dimensions
- animation values
- computed transforms
- values derived from props or index

Compose with style arrays. Later entries win:

```tsx
<View style={[styles.card, isSelected && styles.cardSelected, style]} />
```

`Pressable` state styles may use callback style arrays:

```tsx
style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
```

---

## Design Tokens

Repeated visual values live in `src/styles/tokens.ts`. Token objects use `as const` so callers get
literal-type inference.

Token categories:

- `colors` for semantic color decisions
- `spacing` for padding, margin, gap, size, and hit slop values
- `radii` for rounded corners
- `borders` for reusable border widths or treatments
- `fontFamily`, `fontSize`, and `lineHeight` for typography
- `shadows` for cross-platform elevation/shadow treatments
- `animation` for durations and timing decisions
- z-index/layers when needed

Avoid magic numbers in component styles. A recurring color, spacing, radius, duration, or typography
value is a missing token.

When the same visual adjustment appears in multiple components, centralize it at the right level.
Use a design token for app-wide visual decisions, a shared primitive for primitive-owned chrome, and
a local constant for one component's shape. Do not let repeated `+ 1` adjustments, input padding, or
field chrome drift across files.

Use clear semantic names for text colors and brand colors. Avoid ambiguous pairs where the darker
color sounds less prominent, such as `muted` being lighter than `subtle`.

Expose every loaded font family that components are expected to use. If `Nunito_400Regular` is
loaded, include a `regular` font token.

Keep token comments short. Tokens are the source of truth, not a prototype history log. Feature-only
animation tokens may stay in `tokens.ts` while small, but move them feature-local if they grow into
a specific workflow system.

---

## Local Style Constants

Use design tokens for reusable visual values:

- colors
- spacing
- radii
- typography
- shadows
- animation durations
- z-index/layer values

Use local constants for component-specific visual values that are not part of the design system:

```tsx
const BAR_HEIGHT = 60;
const FAB_SIZE = 44;
const ICON_SIZE = 22;
const PRESSED_SCALE = 0.94;
```

Avoid unexplained inline style values:

```tsx
height: BAR_HEIGHT,
borderRadius: radii.pill,
transform: [{ scale: PRESSED_SCALE }],
```

Small arithmetic should be named when it represents a visual decision:

```tsx
const LABEL_LINE_HEIGHT = LABEL_SIZE + 3;
```

Use inline numeric values only when they are truly local, obvious, and not meaningful outside the
immediate expression.

---

## Defensive Style Retention

Do not remove styles solely because they do not change the current screenshot. Keep styles that
protect behavior, touch targets, text rendering, clipping, or narrow-screen resilience.

Examples:

```tsx
dismiss: {
  alignItems: "center",
  justifyContent: "center",
}

message: {
  fontSize: fontSize.caption,
  lineHeight: lineHeight.caption,
}
```

Remove redundant styles when the parent/child contract proves they are not load-bearing. Keep small
defensive styles when they make the component more durable without obscuring intent.

---

## Units

Use unitless numbers for density-independent pixels:

```ts
{ padding: 16, borderRadius: 12 }
```

Rules:

- Do not use `px` or `rem`.
- Percentage strings are allowed only when a proportion of the parent is intended.
- Use `StyleSheet.hairlineWidth` for the thinnest device-appropriate border.
- Do not disable text font scaling unless the UI genuinely cannot reflow, and document why.

---

## Shadows

Shadows must work cross-platform.

Define shadow tokens that include iOS and Android properties:

```ts
export const shadows = {
  button: {
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
} as const;
```

Do not use only `elevation` or only iOS `shadow*` props.

Android note: a view cannot reliably both clip overflow and cast an elevation shadow. Split clipping
and shadow across nested views when both are needed.

---

## File Placement

This section owns style file placement only. General component/type/helper placement lives in
`mobile-project-structure`.

Keep styles co-located by default:

```text
Button.tsx       # StyleSheet at bottom
```

Extract to `Button.styles.ts` only when the style block becomes large enough to hurt readability. Do
not create separate style files automatically for every component.

---

## Common Mistakes to Avoid

- Inline static style objects.
- Magic numbers instead of tokens or local constants.
- Text styles that override `fontSize` without the matching `lineHeight` token.
- `px`, `rem`, or invented units.
- Disabling font scaling without a documented reason.
- Single-platform shadows.
- Stacking bottom safe-area padding in both `Screen` and a bottom tab bar.
- Adding parent `justifyContent`/`alignItems` that has no effect because children already fill and
  align themselves.
- Removing defensive centering, typography, or shrink styles just because the current screen still
  looks correct.
