---
name: mobile-layout
description:
  Apply this repository's React Native layout conventions when building or debugging mobile layout –
  screens, flex rows/columns, shrinking, scroll regions, keyboard-aware screens, safe areas,
  headers, footers, cards, lists, modals, bottom tabs, and bottom sheets. Trigger on "make this
  scroll", "this overflows", "the footer moved", "keyboard covers the input", "safe area", "row",
  "gap", "why won't it shrink", or layout PR reviews. Applies to React Native mobile.
---

# Mobile Layout

React Native layout must be predictable under refactoring. Screens and layout containers own space,
constraints, safe areas, keyboard avoidance, and scroll boundaries. Reusable UI primitives own only
their internal shape.

This skill owns flex layout, shrinking, scrolling, safe areas, and keyboard-aware screen behavior.
Styling tokens and `StyleSheet` rules live in `mobile-styles`. Component ownership lives in
`frontend-philosophy`. File placement lives in `mobile-project-structure`.

---

## React Native Flex Differences

React Native uses Flexbox by default, but not with web defaults.

| Property        | Web default | React Native default |
| --------------- | ----------- | -------------------- |
| `flexDirection` | `row`       | `column`             |
| `flexShrink`    | `1`         | `0`                  |
| `alignContent`  | `stretch`   | `flex-start`         |
| `flex`          | shorthand   | single number        |

Load-bearing rules:

- Children stack vertically unless `flexDirection: "row"` is set.
- Children do not shrink unless `flexShrink: 1` or `flex: 1` is set.
- `flex: 1` means grow and shrink into available space; it is not the web shorthand.

---

## Layout Ownership

| Owner                 | Responsibilities                                                       |
| --------------------- | ---------------------------------------------------------------------- |
| Screen                | Route-level layout, major content arrangement, safe-area participation |
| Layout container      | Constraints, scroll boundaries, clipping, keyboard-aware behavior      |
| Bottom tab bar        | Bottom safe-area inset and tab bar height                              |
| Reusable UI primitive | Internal structure and visual behavior only                            |

Reusable components must not own:

- Safe-area insets
- Scroll boundaries
- Screen-level positioning
- External margins used to place them on a screen
- Hard-coded viewport assumptions

The root app should provide safe-area data with `SafeAreaProvider`; it should not apply global
top/bottom padding to the whole app.

---

## Shared Screen Primitive

Use a shared `Screen` layout primitive for route-level content instead of repeating safe-area and
keyboard boilerplate in every screen.

Recommended API:

```tsx
<Screen>{children}</Screen>
<Screen insetMode={SCREEN_INSET_MODE.TOP}>{children}</Screen>
<Screen keyboardAware>{children}</Screen>
<Screen scroll keyboardAware>{children}</Screen>
```

Use a typed inset mode constant:

```ts
export const SCREEN_INSET_MODE = {
  TOP: "top",
  BOTTOM: "bottom",
  BOTH: "both",
  NONE: "none",
} as const;

export type ScreenInsetMode = (typeof SCREEN_INSET_MODE)[keyof typeof SCREEN_INSET_MODE];
```

`Screen` owns:

- `flex: 1`
- app background color
- horizontal screen padding
- safe-area inset padding according to `insetMode`
- optional `KeyboardAvoidingView`
- optional `ScrollView`

Default `insetMode` should be `SCREEN_INSET_MODE.BOTH` because no-tab/full-screen flows need top and
bottom protection by default.

`Screen` should keep a stable two-layer mental model:

```text
style                 = outer screen viewport
contentContainerStyle = inner content layout
```

Use `style` for screen-level concerns such as background, horizontal padding, or outer sizing. Use
`contentContainerStyle` for child layout such as `gap`, `justifyContent`, `alignItems`,
`paddingVertical`, or scroll content growth. Do not change these meanings between scroll and
non-scroll implementations. A small wrapper view is acceptable when it keeps this contract
predictable.

---

## Safe Areas

Every screen must account for notches, status bars, rounded corners, and home indicators.

Safe areas are applied at the screen/layout-container level, not inside reusable UI primitives.

Use this contract:

```text
No bottom navigator: Screen owns top and bottom inset.
With bottom tab bar: Screen owns top inset; TabBar owns bottom inset.
```

Examples:

```tsx
// Onboarding/no-tab screens
<Screen />

// Main tab screens
<Screen insetMode={SCREEN_INSET_MODE.TOP} />
```

Do not add global safe-area padding around the whole app. It becomes brittle once the app has bottom
tabs, custom headers, modals, onboarding, and keyboard-aware screens.

---

## Bottom Tab Bar Insets

A custom bottom tab bar owns the bottom safe area:

```tsx
const tabBarStyle = [
  styles.bar,
  {
    height: BAR_HEIGHT + insets.bottom,
    paddingBottom: insets.bottom,
  },
];
```

This creates a fixed visual tab area plus home-indicator protection.

Rules:

- The tab bar owns bottom inset padding.
- Tab screens should not also apply bottom safe-area padding.
- Keep the tab bar's base height as a named local constant.
- Use `useSafeAreaInsets` in the tab bar, not in every tab screen, for bottom-tab spacing.

---

## Keyboard-Aware Layout

Use `keyboardAware` on `Screen` for forms and inputs that may be covered by the keyboard.

The implementation should use:

```tsx
<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
  {content}
</KeyboardAvoidingView>
```

Why:

- iOS usually needs `padding` to keep inputs visible.
- Android often handles keyboard resizing natively; forcing padding can double-adjust.

Use `keyboardShouldPersistTaps="handled"` when a scrollable screen contains inputs/buttons.

---

## Scroll Ownership

Scrolling is a component (`ScrollView`, `FlatList`, `SectionList`), not CSS overflow.

Rules:

- One scroll container per scrollable region.
- Screens or layout containers own scrolling.
- Reusable UI components do not wrap themselves in `ScrollView`/`FlatList`.
- Use `FlatList`/`SectionList` for long or unbounded data.
- Use `ScrollView` only for small bounded content.
- A scroll container needs a bounded parent, usually `flex: 1`.
- Inner padding for `ScrollView` goes on `contentContainerStyle`, not `style`.

Avoid nesting a `VirtualizedList` inside a same-direction `ScrollView`. Use list header/footer props
instead.

---

## Rows and Shrinking

For horizontal layout:

```ts
row: {
  flexDirection: "row",
  alignItems: "center",
}
```

Any child that must shrink needs `flexShrink: 1` or `flex: 1` at every level of the constraint
chain.

Text truncation requires both:

```tsx
<View style={{ flex: 1 }}>
  <Text numberOfLines={1}>Long title...</Text>
</View>
```

Without the shrinking wrapper, text can push siblings off-screen.

---

## Parent/Child Layout Responsibility

Let parents own container size and outer arrangement. Let children own their internal alignment.

Example tab bar split:

```text
bar    = row, background, border, height
tab    = flex: 1, icon/label alignment
button = internal press state and content centering
```

Avoid redundant parent alignment when children already fill and align themselves:

```ts
bar: {
  flexDirection: "row",
  backgroundColor: colors.white,
  borderTopWidth: StyleSheet.hairlineWidth,
  borderTopColor: colors.border,
}
```

If each tab item has `flex: 1`, parent `justifyContent: "space-around"` usually does nothing. If
each tab item centers its own content, parent `alignItems: "center"` is often redundant.

---

## `gap` and Alternatives

Use `gap` when the project's React Native/Expo version supports it. It is clearer than manual
margins for simple stacks and rows.

```ts
body: {
  gap: spacing.md,
}
```

Fallback options:

- Apply `marginBottom` / `marginTop` to children.
- Introduce a small `Stack` / `HStack` layout primitive only after repeated use is proven.

Do not introduce `Stack` on the first or second occurrence. Evaluate it when repeated layout spacing
becomes noisy across multiple screens/components.

---

## Bottom-Aligned Content

Use direct flex intent for fixed-bottom content in a vertical screen. `marginTop: "auto"` is
appropriate when a footer should consume the remaining space above itself and sit at the bottom of a
flex column.

```ts
footer: {
  marginTop: "auto",
}
```

Prefer this over adding fake spacer views solely to push content down. Only introduce an explicit
spacer when it carries a real layout responsibility that cannot be expressed on the content being
positioned.

---

## `alignItems` and Cross-Axis Sizing

`alignItems: "center"` makes children intrinsically sized on the cross axis. Use it only when that
is intended.

If children should stretch and shrink within the available width, keep the default `stretch` or set
width/flex constraints explicitly.

---

## Decorative Clipping Only

Use `overflow: "hidden"` only for decorative clipping, such as rounded images/cards:

```ts
{ borderRadius: 16, overflow: "hidden" }
```

Never use it to hide a layout bug. Fix the missing `flexShrink`, row direction, or constraint chain
instead.

Android note: a view cannot reliably both clip overflow and cast an elevation shadow. Split clipping
and shadow across nested views when both are needed.

---

## Standard Recipes

### Fixed header, flexible body, footer

```tsx
<Screen keyboardAware>
  <View style={styles.header}>{...}</View>
  <View style={styles.body}>{...}</View>
  <View style={styles.footer}>{...}</View>
</Screen>
```

```ts
const styles = StyleSheet.create({
  header: { paddingTop: spacing.xl },
  body: { flex: 1, justifyContent: "center", gap: spacing.md },
  footer: { gap: spacing.md },
});
```

### Tab screen

```tsx
<Screen insetMode={SCREEN_INSET_MODE.TOP}>
  {...}
</Screen>
```

The bottom tab bar owns bottom inset padding.

### Scrollable form

```tsx
<Screen scroll keyboardAware contentContainerStyle={styles.content}>
  {...}
</Screen>
```

```ts
const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: "center",
    gap: spacing.md,
  },
});
```

### Row with truncating label and fixed action

```ts
const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  labelWrap: { flex: 1 },
  action: { flexShrink: 0 },
});
```

```tsx
<View style={styles.row}>
  <View style={styles.labelWrap}>
    <Text numberOfLines={1}>Very long label...</Text>
  </View>
  <Pressable style={styles.action}>{...}</Pressable>
</View>
```

---

## Debugging Checklist

1. Row is vertical → add `flexDirection: "row"`.
2. Text/content blows past screen → add `flexShrink: 1` or `flex: 1` through the chain.
3. Text will not truncate → add shrinking wrapper plus `numberOfLines`.
4. Child will not fill width → check `alignItems: "center"` on ancestors.
5. Footer sits too high → check for stacked bottom padding from `Screen` safe area plus footer
   padding.
6. Content overlaps bottom tab bar → tab screen should use `SCREEN_INSET_MODE.TOP`; tab bar owns
   bottom inset.
7. Content under home indicator without tabs → no-tab screen should use default/both inset mode.
8. Keyboard covers input → use `<Screen keyboardAware>`.
9. Two scroll views fight → remove one scroll boundary or use list header/footer props.
10. `overflow: "hidden"` hides a bug → fix the constraint chain instead.
11. `style` and `contentContainerStyle` mean different things per screen mode → restore the stable
    outer/inner Screen contract.
12. A fake spacer view only pushes a footer down → use direct flex intent such as
    `marginTop: "auto"`.
