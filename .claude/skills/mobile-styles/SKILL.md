---
name: mobile-styles
description:
  Apply this repository's React Native styling conventions when writing or editing StyleSheet
  blocks, tokens, typography, variants, shadows, static/dynamic styles, shared primitives, tab bars,
  or style props. Trigger on "style this", "add a variant", "fix spacing", "make an AppText",
  "button style", "wordmark", or style PR reviews. Applies to React Native mobile. Web CSS has
  separate rules.
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

When a style defines `fontSize`, generally define the matching `lineHeight` token too:

```tsx
message: {
  fontSize: fontSize.caption,
  lineHeight: lineHeight.caption,
}
```

This keeps text rendering predictable across fonts, platforms, and accessibility settings. Omit the
explicit pair only when the text primitive's variant already provides both values or there is a
clear local reason.

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

## Custom Tab Bar Styling

A custom tab bar should be config-driven, not route-name-condition driven.

Use a route config for label, icon, and special visual treatment:

```ts
const TAB_CONFIG: Record<MainTabName, TabConfigItem> = {
  [MAIN_TAB_ROUTES.MESSAGES]: { label: "Messages", icon: "message-circle", isFab: false },
  [MAIN_TAB_ROUTES.POST_PLAN]: { label: "Post a plan", icon: "plus", isFab: true },
};
```

Responsibility split:

```text
bar     = row, background, border, height, bottom inset
navBtn  = equal width, internal icon/label centering
fabWrap = equal width, internal FAB centering and press transform
fab     = size, radius, gradient, shadow, icon center
```

If each button has `flex: 1`, parent `justifyContent: "space-around"` is usually redundant. If each
button centers its own content, parent `alignItems: "center"` is often redundant.

Special tab/FAB accessibility:

```tsx
<Pressable
  accessibilityRole="button"
  accessibilityState={{ selected: focused }}
  accessibilityLabel={tab.label}
/>
```

The FAB is still a tab. It should expose selected state just like normal tabs.

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

App-wide legal URLs belong in `src/config/links.ts`, not in one feature component once multiple
screens need them.

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
- A fake single-value variant prop.
- Disabling font scaling without a documented reason.
- Styling a child from a parent instead of giving the child a prop/variant.
- Feature-specific styles inside shared primitives.
- Single-platform shadows.
- Putting layout/safe-area behavior in a UI primitive instead of a layout component.
- Stacking bottom safe-area padding in both `Screen` and a bottom tab bar.
- Adding parent `justifyContent`/`alignItems` that has no effect because children already fill and
  align themselves.
- Removing defensive centering, typography, or shrink styles just because the current screen still
  looks correct.
