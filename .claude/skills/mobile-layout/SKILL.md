---
name: mobile-layout
description: Apply this repository's React Native flex layout conventions when writing or debugging layout for mobile components. Use whenever a layout is being built or fixed — flex columns, flex rows, scrollable regions, side-by-side views, list rows, screen shells, modals, bottom sheets, headers, card bodies, tab screens — and whenever a layout symptom appears: content escaping its container, text that won't truncate, a row laid out vertically, a view that won't shrink, stacked scroll views, a list that warns about nesting, or a screen that overlaps the notch or home indicator. Trigger on casual phrasings too — "make this scroll", "this is overflowing", "the row is blowing out", "why won't this shrink", "fix the layout". Do not rely on general web flex knowledge here: React Native's flex defaults differ from the web (flexDirection defaults to column, flexShrink defaults to 0, flex is a single number), scrolling is owned by ScrollView/FlatList rather than an overflow property, and screens must account for safe-area insets. The standard recipes here are the approved patterns; deviation requires a justified reason. Applies to React Native mobile components. Web has its own conventions.
---

# Mobile Layout

These are the flex layout mechanics for React Native in this repository. Follow them whenever
writing or fixing layout, debugging overflow or scroll issues, or deciding which component owns
sizing and clipping.

The layout philosophy is durable, predictable, and composition-oriented — identical in spirit to the
web standard. Layout behavior must remain stable under refactoring. Components must behave
consistently regardless of where they are rendered.

This skill covers layout, shrinking, and scroll ownership. For unit choices, variants, and tokens,
see the `mobile-styles` skill. For component architecture and ownership boundaries, see
`mobile-frontend-philosophy`.

React Native uses Flexbox as its only layout system (no Grid). Every `<View>` is a flex container by
default — there is no `display: flex` to set. The mechanics resemble web flexbox but the defaults
differ in ways that bite web developers, and those differences are the subject of this skill.

---

## How React Native Flex Differs from the Web

Four defaults differ from web CSS. Internalize these — most mobile layout bugs trace to one of them.

| Property        | Web default | React Native default |
| --------------- | ----------- | -------------------- |
| `flexDirection` | `row`       | **`column`**         |
| `flexShrink`    | `1`         | **`0`**              |
| `alignContent`  | `stretch`   | `flex-start`         |
| `flex`          | shorthand   | **single number**    |

The first two are the load-bearing ones. Children stack **vertically** by default, and they **do not
shrink** by default.

---

## Layout Ownership

Layout responsibility is divided across three roles. Preserve the boundary.

| Role                  | Owns                                                 |
| --------------------- | ---------------------------------------------------- |
| Screen                | Route-level layout and major content arrangement     |
| Layout container      | Constraints, scroll boundaries, clipping, safe areas |
| Reusable UI component | Internal structure and intrinsic shape               |

A **layout container** is any wrapper whose job is to constrain and arrange child content: a screen
shell, a modal body, a bottom sheet, a card body, a tab screen, a section wrapper.

Reusable components do not own:

- Scroll boundaries (no `ScrollView`/`FlatList` wrapping themselves)
- Safe-area insets
- Screen-level positioning
- Layout orchestration
- Hard-coded external sizing

Reusable components stay layout-agnostic regardless of where the style is written — a reusable
component's styles must not define external sizing, scroll boundaries, or screen-level positioning.
Screens and layout containers constrain them.

---

## Constraint Chains

Flex layouts operate through chains of constraints. A missing constraint at any level breaks
behavior below it.

Most React Native layout bugs trace to one of:

- A child that should shrink but has `flexShrink: 0` (the default)
- A row that forgot `flexDirection: 'row'`
- Incorrect `alignItems`
- A reusable component owning its own scroll
- Multiple competing scroll containers

Debugging focuses on locating the broken constraint rather than masking the symptom.

---

## flexDirection Defaults to Column

A `<View>` lays its children out **top to bottom** by default. Coming from the web, this is the most
common early surprise: a "row" of items will stack vertically until you say otherwise.

```tsx
// Children stack vertically — the default
<View>{...}</View>

// Children sit side by side — must be explicit
<View style={{ flexDirection: "row" }}>{...}</View>
```

Set `flexDirection: 'row'` explicitly for any horizontal arrangement. Do not assume row.

---

## The flexShrink Rule

This is the mobile counterpart of the web `min-width: 0` / `min-height: 0` rule — and it is
**inverted**. On the web, children default to `flexShrink: 1` and the bug is that `min-*: auto`
stops them from shrinking. In React Native, children default to **`flexShrink: 0`**, so they refuse
to shrink at all. The result:

- Text overflows its container or pushes siblings off-screen.
- A long row stretches past the screen edge.
- A child ignores the space pressure entirely.

Any flex child that must shrink declares one of:

```ts
{
  flexShrink: 1;
} // shrink only
{
  flex: 1;
} // grow AND shrink (flex: 1 = flexGrow 1, flexShrink 1, flexBasis 0)
```

`flex: 1` already includes `flexShrink: 1`, so a child sized with `flex: 1` will shrink. The
explicit `flexShrink: 1` is for children that should shrink without growing. Apply at **every level
of the chain that must shrink** — skipping one level breaks shrinking below it.

`minWidth: 0` occasionally helps on nested row wrappers as a belt-and-suspenders measure, but in
React Native the primary lever is `flexShrink`, not `minWidth`/`minHeight`.

---

## Text Truncation

Text is the most frequent shrink offender. To truncate cleanly:

1. The text's container must be allowed to shrink (`flex: 1` or `flexShrink: 1`).
2. The `<Text>` itself takes `numberOfLines` (and optionally `ellipsizeMode`).

```tsx
<View style={{ flexDirection: "row" }}>
  <View style={{ flex: 1 }}>
    <Text numberOfLines={1}>A very long event title that should truncate…</Text>
  </View>
  <Icon />
</View>
```

Without the shrinking wrapper, the text pushes the icon off-screen. Without `numberOfLines`, it
wraps instead of truncating.

---

## alignItems and Cross-Axis Sizing

`alignItems` controls cross-axis sizing. The default is `stretch`, which lets children fill the
container's cross-axis width (in a column) or height (in a row).

Changing `alignItems` to `center`, `flex-start`, or `flex-end` makes children intrinsically sized on
the cross axis rather than stretched. Use `center` only when intrinsic sizing is intentionally
desired — not on a container whose children are meant to fill and shrink within a constrained width.

---

## Scroll Ownership

There is no `overflow: 'auto'` or `overflow-y` scrolling in React Native. Scrolling is a
**component**: `ScrollView` for small, bounded content, and `FlatList` (or `SectionList`) for long
or unbounded lists, which virtualize for performance.

Scroll boundaries belong to screens or layout containers. Reusable components do not wrap themselves
in a scroll view.

```tsx
// Avoid — the component owns its own scrolling
<EventList />   // ScrollView baked inside

// Preferred — the layout container owns the scroll boundary
<View style={{ flex: 1 }}>
  <FlatList data={events} renderItem={renderEvent} />
</View>
```

Each scrollable region has **exactly one** scroll container. Nesting scroll views of the same
orientation causes broken gestures, unreachable content, and the runtime warning that a
VirtualizedList should not be nested inside a plain ScrollView of the same orientation. If you need
a scrolling list with a scrolling header, use the list's own header prop (e.g.
`ListHeaderComponent`) rather than nesting.

A `ScrollView` (or `FlatList`) needs a bounded parent to define its viewport — typically a parent
with `flex: 1`. Inner padding for a `ScrollView` goes on `contentContainerStyle`, not `style`.

---

## Safe Areas

Phones have notches, status bars, and home indicators. Content must not render under them. This has
no web equivalent and is a hard requirement on every screen.

Wrap screen-level content so it respects the device's safe-area insets (via
`react-native-safe-area-context` — `SafeAreaView` or the `useSafeAreaInsets` hook). Apply insets at
the **screen / layout-container level**, not inside reusable components. A reusable card should
never know about the notch.

```tsx
const insets = useSafeAreaInsets();
<View style={{ flex: 1, paddingTop: insets.top }}>{...}</View>;
```

---

## Sizing: flex Is a Single Number

React Native's `flex` accepts only a single number — the web shorthand does **not** port. The web
recipe `flex: 1 14rem` (grow, shrink, preferred basis) is invalid here. When you need a preferred
size with shrink-and-grow behavior, set the longhand properties:

```ts
// Web (does NOT work in React Native):
{ flex: "1 1 14rem" }

// React Native equivalent:
{ flexGrow: 1, flexShrink: 1, flexBasis: 224 }
```

Avoid hard `width` values for flexible regions. Use `flexBasis` for a preferred starting size and
let grow/shrink distribute the rest. Reserve fixed `width` for genuinely fixed-size elements (an
avatar, an icon button).

---

## Standard Recipes

### Fixed header with scrolling content

```tsx
<View style={styles.screen}>
  <View style={styles.header}>{...}</View>
  <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
    {...}
  </ScrollView>
</View>
```

```ts
const styles = StyleSheet.create({
  screen: { flex: 1 }, // fills the screen, column by default
  header: {}, // sizes to content; no flex
  scroll: { flex: 1 }, // fills remaining space, owns scrolling
  scrollContent: { padding: 16 }, // inner padding goes here, not on `scroll`
});
```

The header sizes to its content. The scroll region fills the rest and owns scrolling.

### Side-by-side regions

```ts
const styles = StyleSheet.create({
  row: { flexDirection: "row" }, // must be explicit
  left: { flex: 1 }, // grow + shrink
  right: { flex: 1 },
});
```

Each region grows and shrinks independently. Long content in one does not push the other off-screen.

### Row with a truncating label and a fixed action

```ts
const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  label: { flex: 1 }, // shrinks; pair with numberOfLines on the Text
  action: { flexShrink: 0 }, // fixed; never shrinks (also the default)
});
```

---

## Decorative Clipping Only

`overflow: 'hidden'` is permitted only for decorative clipping — most often clipping children to a
rounded corner:

```ts
{ borderRadius: 16, overflow: "hidden" }
```

Android note: clipping a child (e.g. an `<Image>`) to a parent's `borderRadius` requires
`overflow: 'hidden'` on the parent. Be aware this conflicts with `elevation` shadows on Android — a
view cannot both cast an elevation shadow and clip its overflow on the same node; split them across
two views when you need both.

Never use `overflow: 'hidden'` to suppress a layout bug. If content escapes a container, the cause
is upstream — usually a missing `flexShrink: 1`, a forgotten `flexDirection: 'row'`, or a wrong
`alignItems`. Fix the chain; do not mask the symptom.

---

## Debugging Checklist

Work the chain from outside in. The cause is almost always one of these:

1. **A "row" of items is stacked vertically** → missing `flexDirection: 'row'` (the default is
   column).

2. **Text or a child blows past the screen edge or pushes siblings off** → the child is not
   shrinking. Add `flexShrink: 1` (or `flex: 1`) at every level of the row chain that should shrink.
   React Native defaults `flexShrink` to `0`.

3. **Text won't truncate** → add `numberOfLines` to the `<Text>` and ensure its wrapper can shrink
   (`flex: 1` / `flexShrink: 1`).

4. **A child won't fill cross-axis width** → an ancestor uses `alignItems: 'center'` (or
   `flex-start` / `flex-end`), making children intrinsically sized. Revert to `stretch` (the
   default) on that ancestor if filling was intended.

5. **Reusable component breaks in a new context** → the component owns its own scroll, safe-area
   insets, or external sizing. Strip those and move them to the wrapping layout container.

6. **Two scroll views fight, or a VirtualizedList-nesting warning appears** → scroll containers are
   stacked. Remove the inner one; let one container own the boundary, or use the list's header prop.

7. **Content renders under the notch or home indicator** → safe-area insets are missing at the
   screen level. Wrap with safe-area handling.

8. **You're reaching for `overflow: 'hidden'` to fix a layout problem** → stop. Find the missing
   `flexShrink: 1`, `flexDirection: 'row'`, or correct `alignItems` upstream. `overflow: 'hidden'`
   is only for decorative clipping.

---

## Mental Model

```text
Screen
  owns route-level layout and safe-area insets

Layout container
  owns constraints, scroll boundaries (ScrollView / FlatList), and clipping

Reusable UI component
  owns structure and visual behavior — never scroll, safe areas, or external sizing

Rows
  require flexDirection: 'row' (column is the default)

Children that must shrink
  require flexShrink: 1 (the default is 0) — or flex: 1, which includes it

Scrollable regions
  are components (ScrollView / FlatList), exactly one per region
```

This model is the source of truth.

---

## When to Consult the Related Standards

- For unit choices, variants, design tokens, style keys, and platform-specific shadows:
  `mobile-styles`.
- For component ownership boundaries, the `style` prop convention, and when a primitive should be
  split: `mobile-frontend-philosophy`.
- For where screens, layout containers, and feature components live in the folder tree:
  `mobile-project-structure`.
