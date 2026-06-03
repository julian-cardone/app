---
name: mobile-styles
description:
  Apply this repository's React Native styling conventions when writing or editing StyleSheet
  blocks, tokens, typography, variants, shadows, static/dynamic styles, shared primitives, or style
  props. Trigger on "style this", "add a variant", "fix spacing", "make an AppText", "button style",
  "wordmark", or style PR reviews. Applies to React Native mobile. Web CSS has separate rules.
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

---

## Design Tokens

Repeated visual values live in `src/styles/tokens.ts`.

Token categories:

- `colors`
- `spacing`
- `radii`
- `fontFamily`
- `fontSize`
- `lineHeight`
- `shadows`
- `animation`
- z-index/layers when needed

Avoid magic numbers in component styles. A recurring color, spacing, radius, duration, or typography
value is a missing token.

Allowed local constants are values that are truly component-specific and not part of the design
system, such as `CODE_LENGTH = 6`.

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

## Typography and `AppText`

Use a shared `AppText` primitive once custom fonts/tokens are in use. It centralizes typography,
default text color, future dark mode, accessibility scaling, and localization pressure.

Keep it small:

```tsx
type AppTextProps = TextProps & {
  variant?: "body" | "headline" | "caption";
  style?: StyleProp<TextStyle>;
};
```

Recommended variants come from real repeated usage:

- `headline`
- `body`
- `caption`
- optionally `label`

Avoid building a typography prop matrix before it is needed.

Feature screens should prefer:

```tsx
<AppText variant="headline">Enter your code</AppText>
```

instead of repeating font family, size, line height, and color across many screens.

---

## Branding Components

Branding components live in `components/branding/`, not `components/ui/`, when a branding boundary
exists.

`Wordmark` owns only the visual rendering of the brand name. It does not own layout, margins,
centering, or screen position.

Recommended props:

```tsx
type WordmarkProps = {
  size?: "splash" | "compact";
  style?: StyleProp<TextStyle>;
};
```

Do not force `accessibilityRole="header"` inside `Wordmark` by default. The screen decides whether
brand text is acting as a heading.

---

## Shared Button Primitive

A shared `Button` owns its internal structure and visual states, not workflow.

Recommended API at the current stage:

```tsx
type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};
```

Rules:

- Do not include `variant?: "primary"` when only one variant exists.
- Add variants only when a second stable treatment is real.
- Keep navigation/API consequences in the caller.
- Use `accessibilityRole="button"` and `accessibilityState={{ disabled }}`.
- Allow `style` for parent placement/layout, not for deep internal restyling.
- Use gradient/shadow tokens when available.

The button may defensively guard its handler:

```tsx
const handlePress = () => {
  if (disabled) return;
  onPress();
};
```

---

## Variants

Stable visual modes are variants. Do not create variants speculatively.

Good:

```tsx
<Button variant="primary" />
<Button variant="secondary" />
```

only after both treatments exist and are stable.

Avoid:

```tsx
variant?: "primary";
void variant;
```

A primitive with many unrelated variants probably owns too much and should be split.

---

## Parent Style Prop Convention

Shared primitives should usually accept a `style` prop when parent layout control is useful:

```tsx
<Button style={styles.submitButton} />
<Wordmark style={styles.headerBrand} />
```

Use `style` for parent-owned placement: margin, width, alignment, or local positioning.

Do not expose many deep style props unless there is a proven need. Prefer stable variants or split
the component.

`contentContainerStyle` is appropriate for layout containers like `Screen`/`ScrollView` wrappers.

---

## Text Links and Legal Footnotes

Inline text links inside a sentence may use nested `<Text onPress={...}>`.

Recommended:

```tsx
<Text accessibilityRole="link" onPress={handleTermsPress}>
  Terms
</Text>
```

Handlers should be named, not inlined, when the component owns the interaction. Use `void` or
`try/catch` for promise-returning native APIs such as `Linking.openURL`.

App-wide legal URLs belong in `config/links.ts`, not in one feature component once multiple screens
need them.

---

## Inputs

Controlled input components receive `value` and `onChangeText`.

Phone inputs should use relevant mobile props:

```tsx
<TextInput
  keyboardType="phone-pad"
  autoComplete="tel"
  textContentType="telephoneNumber"
  returnKeyType="done"
/>
```

If a country-code chip is not interactive yet, do not present it as an active button. Disable the
`Pressable` or render non-pressable text/view when no handler exists.

Verification-code inputs should prefer one real hidden `TextInput` driving visual boxes. This keeps
paste, deletion, keyboard behavior, and one-time-code autofill working correctly.

Useful props:

```tsx
<TextInput
  keyboardType="number-pad"
  autoComplete="one-time-code"
  textContentType="oneTimeCode"
  returnKeyType="done"
  caretHidden
/>
```

---

## Shadows

Shadows must work cross-platform.

Define shadow tokens that include iOS and Android properties:

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

Do not use only `elevation` or only iOS `shadow*` props.

---

## File Placement

Keep styles co-located by default:

```text
Button.tsx       # StyleSheet at bottom
```

Extract to `Button.styles.ts` only when the style block becomes large enough to hurt readability. Do
not create separate style files automatically for every component.

---

## Common Mistakes to Avoid

- Inline static style objects.
- Magic numbers instead of tokens.
- `px`, `rem`, or invented units.
- A fake single-value variant prop.
- Disabling font scaling without a documented reason.
- Styling a child from a parent instead of giving the child a prop/variant.
- Feature-specific styles inside shared primitives.
- Single-platform shadows.
- Putting layout/safe-area behavior in a UI primitive instead of a layout component.
