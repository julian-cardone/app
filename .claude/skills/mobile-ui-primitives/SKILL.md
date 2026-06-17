---
name: mobile-ui-primitives
description:
  Apply this repository's React Native UI primitive conventions when writing or reviewing AppText,
  Button, shared inputs, Wordmark, branding components, variants, text links, legal footnotes,
  primitive accessibility, parent style props, or feature-specific input wrappers.
---

# Mobile UI Primitives

## Shared Text Primitive

Use a shared app text primitive when the project has custom fonts or typography tokens.

The text primitive should stay small:

```tsx
type AppTextProps = TextProps & {
  variant?: "body" | "headline" | "caption";
};
```

Avoid creating a prop matrix such as `size`, `weight`, `tone`, `italic`, `muted`, `centered`, and
`specialMode` before those variants are proven. Typography consistency is the goal; a generic text
configuration system is not.

Branding text, such as a wordmark, may live in a branding component and use the same typography
tokens or text primitive internally.

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

Use `AppText` at typography boundaries. Inside an existing text block, nested React Native `<Text>`
is appropriate for inline emphasis or links when it should inherit the parent's typography and only
override a small difference such as color or weight. Do not reapply the same `AppText` variant
inside its own text block unless the child is intentionally establishing a new typography context.

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

A targeted `containerStyle` prop is acceptable when a primitive has an outer wrapper and the parent
needs to control only parent-owned layout, such as `flex: 1` in a row. It should not become a
backdoor for restyling the primitive's internal appearance.

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

Shared field primitives own common input chrome: border, radius, padding, placeholder treatment,
typography, focus states, and error presentation. Domain-specific inputs should compose the shared
field primitive and add domain behavior, not duplicate the field styling.

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

## Common Mistakes to Avoid

- A fake prop such as `variant?: "primary"` before a second variant exists.
- A fake single-value variant prop.
- Styling a child from a parent instead of giving the child a prop/variant.
- Feature-specific styles inside shared primitives.
- Putting layout/safe-area behavior in a UI primitive instead of a layout component.
- Creating CSS files or `.module.css` files.
- Putting `Wordmark` in `ui/` when a `branding/` boundary exists.
- Moving `PhoneNumberInput` or `CodeInput` to shared before reuse is proven.
