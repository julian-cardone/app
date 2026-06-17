---
name: mobile-navigation
description:
  Apply this repository's React Navigation conventions when creating, editing, or reviewing route
  constants, route param types, navigators, navigation actions, onboarding/auth branch transitions,
  custom tab bar behavior, route config, or tab bar navigation styling.
---

# Mobile Navigation

## Navigation

Navigation lives in `src/navigation/`.

- `types.ts` owns route param contracts such as `RootStackParamList`, `OnboardingStackParamList`,
  and `MainTabParamList`.
- `routes.ts` owns centralized route constants as `as const` objects.
- Navigator files wire route constants to screen components.
- Navigators import screens from feature public surfaces.
- Navigators do not contain screen content, feature workflows, or dev menu content beyond minimal
  route registration.
- Use `replace` or `reset` for splash/auth/onboarding transitions that should not remain on the back
  stack.

Use route constants in navigators and navigation actions:

```tsx
<Stack.Screen name={ROOT_ROUTES.MAIN} component={MainNavigator} />;
navigation.navigate(MAIN_TAB_ROUTES.PROFILE);
```

Use route constants as the source of truth for navigator names, navigation actions, param-list keys,
and screen prop route names.

```ts
export const ROOT_ROUTES = {
  ONBOARDING: "Onboarding",
  MAIN: "Main",
} as const;

export type RootStackParamList = {
  [ROOT_ROUTES.ONBOARDING]: NavigatorScreenParams<OnboardingStackParamList>;
  [ROOT_ROUTES.MAIN]: NavigatorScreenParams<MainTabParamList>;
};

type Props = NativeStackScreenProps<OnboardingStackParamList, typeof ONBOARDING_ROUTES.PHONE_ENTRY>;
```

Do not repeat raw route strings in param-list keys, screen prop types, navigators, or navigation
actions once a route constant exists.

When real onboarding/auth state exists, root navigation should be gated by app access state and
should render only the allowed branch. Early prototypes may use `initialRouteName`, but persisted
access state should eventually decide the root tree.

---

## Custom Tab Bar

A custom tab bar should preserve React Navigation behavior.

Use the canonical focus check:

```ts
const focused = state.index === index;
```

On press, emit `tabPress` before navigating so listeners can prevent default behavior:

```ts
const event = navigation.emit({
  type: "tabPress",
  target: route.key,
  canPreventDefault: true,
});

if (!focused && !event.defaultPrevented) {
  navigation.navigate(route.name);
}
```

Use route config for labels, icons, and special treatment instead of route-name conditionals:

```ts
const TAB_CONFIG: Record<MainTabName, TabConfigItem> = {
  [MAIN_TAB_ROUTES.POST_PLAN]: { label: "Post a plan", icon: "plus", isFab: true },
};
```

If React Navigation exposes `route.name` as `string`, a small local assertion with a runtime guard
is acceptable when the route names are strictly controlled by the navigator.

---

## Constants and Literal Values

Use `as const` for centralized literal values like routes, storage keys, theme names, tab names, and
screen inset modes.

Use enums sparingly for domain states that are not just UI strings. Avoid enums for navigation
routes.

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

## Common Mistakes to Avoid

- Defining shared route param contracts inline in a navigator file.
- Repeating raw route strings in param lists, screen prop types, navigators, or navigation actions
  instead of using route constants.
- Putting screen content inside a navigator.
- Creating a mobile `router.tsx` route table.
