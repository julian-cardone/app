---
name: mobile-project-structure
description:
  Apply this repository's React Native folder and module conventions when creating, moving, or
  reviewing files on mobile. Use when deciding where screens, feature components, shared UI,
  branding components, layout primitives, providers, navigation types, services, config, assets,
  hooks, or tokens belong. Trigger on "where should this go", "is this shared", "where do fonts
  live", "where do links/constants go", "should this be in components/ui", and PR reviews for
  boundary violations. Applies to Expo/React Native with React Navigation. Web has its own project
  structure skill.
---

# Mobile Project Structure

Mobile structure must make ownership obvious and prevent drift. Code stays local until reuse is
proven. Shared areas exist for domain-agnostic behavior only.

This skill owns physical file placement. Architecture rules live in `frontend-philosophy`. Styling
rules live in `mobile-styles`. Flex, scroll, keyboard, and safe-area rules live in `mobile-layout`.

---

## Reference Structure

```text
app.config.ts                      # Expo config: name, icon, splash, plugins, env-specific overrides
index.js                          # registerRootComponent(App)
assets/
  fonts/                          # bundled fonts if not using @expo-google-fonts
  images/                         # bundled images, icon, splash source

src/
  App.tsx                         # thin shell only

  components/
    ui/                           # shared UI primitives: Button, AppText, generic inputs
    layout/                       # shared layout primitives: Screen, Stack if proven
    branding/                     # brand primitives: Wordmark, Logo

  config/
    links.ts                      # app-wide external links, legal URLs, public constants

  features/
    <feature-name>/
      components/                 # feature-specific components
      hooks/                      # feature-scoped hooks
      lib/                        # feature-scoped pure logic
      models/                     # feature domain models
      screens/                    # route-level screens
      index.ts                    # feature public surface

  navigation/
    RootNavigator.tsx
    types.ts                      # route param contract

  providers/
    AppProviders.tsx              # GestureHandler, SafeArea, Navigation, app providers

  hooks/
    useAppBootstrap.ts            # font loading, splash coordination, blocking init

  services/
    <service-name>/
      <service-name>.api.ts
      <service-name>.mappers.ts
      <service-name>.types.ts
      index.ts

  lib/                            # cross-feature pure utilities, grouped by responsibility
  styles/
    tokens.ts                     # colors, spacing, radii, typography, shadows, animation
```

Folders are not created before they contain files.

---

## Application Entry

React Native has no DOM render, no route table, and no global CSS imports.

| File / module                    | Responsibility                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------------ |
| `index.js`                       | Registers the root component with `registerRootComponent(App)`                       |
| `src/App.tsx`                    | Thin shell: calls `useAppBootstrap`, gates readiness, renders `AppProviders`         |
| `src/hooks/useAppBootstrap.ts`   | Blocking app init: fonts, splash coordination, future auth/remote config gates       |
| `src/providers/AppProviders.tsx` | Provider tree: gesture root, safe-area provider, navigation container, app providers |
| `src/navigation/`                | Navigator tree and route param contract                                              |

`App.tsx` must not grow. It should look conceptually like:

```tsx
export default function App() {
  const appReady = useAppBootstrap();
  return appReady ? <AppProviders /> : null;
}
```

If initialization grows, edit `useAppBootstrap`. If providers grow, edit `AppProviders`. Do not put
business logic, screen logic, navigation decisions, or provider composition directly in `App.tsx`.

---

## Navigation

Navigation lives in `src/navigation/`.

- `types.ts` owns route param contracts for the navigation folder, such as `RootStackParamList`,
  `OnboardingStackParamList`, and `MainTabParamList`.
- Navigator files wire route names to screen components.
- Navigators import screens from feature public surfaces.
- Navigators do not contain screen content, feature workflows, or dev menu content beyond minimal
  route registration.
- Use `replace` for splash/auth transitions that should not remain on the back stack.

Example:

```ts
// navigation/types.ts
export type RootStackParamList = {
  Splash: undefined;
  PhoneEntry: undefined;
  Verify: { phoneNumber: string };
};
```

```tsx
// navigation/RootNavigator.tsx
import { PhoneEntryScreen, SplashScreen, VerifyScreen } from "@/features/onboarding";
```

---

## Shared, Layout, Branding, and Feature Boundaries

Use these locations deliberately:

| Location                         | Belongs here                                                                  | Does not belong here                              |
| -------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------- |
| `components/ui/`                 | Domain-agnostic primitives: `Button`, `AppText`, generic input primitives     | Feature text, workflow, navigation, backend calls |
| `components/layout/`             | Shared layout shells: `Screen`, proven `Stack`/`HStack`                       | Feature-specific page structure                   |
| `components/branding/`           | Brand-only primitives: `Wordmark`, `Logo`                                     | Screen positioning or feature behavior            |
| `features/<feature>/components/` | Feature-specific components: `PhoneNumberInput`, `CodeInput`, `TermsFootnote` | Cross-feature primitives                          |
| `features/<feature>/screens/`    | Route-level screens for that feature                                          | Shared UI primitives                              |
| `config/`                        | App-wide public constants and external links                                  | Feature-local constants                           |

Examples from the current app:

- `Wordmark` belongs in `components/branding/` because it is brand-owned and layout-agnostic.
- `Button` and `AppText` belong in `components/ui/`.
- `Screen` belongs in `components/layout/`.
- `PhoneNumberInput`, `CodeInput`, and `TermsFootnote` stay in `features/onboarding/components/`
  until reuse outside onboarding is proven.
- Legal URLs belong in `config/links.ts` if they are used by multiple screens or features.

---

## Promotion Rules

Code stays local until reuse is proven. Promotion to shared requires all three:

1. Proven reuse across features or app areas.
2. Domain-agnostic behavior.
3. Stable abstraction boundaries.

Do not promote a component just because it looks reusable. A phone-code input used only in
onboarding is still an onboarding component.

---

## Public Surfaces

Every major boundary exposes an `index.ts` public surface:

```text
components/ui/index.ts
components/layout/index.ts
components/branding/index.ts
features/onboarding/index.ts
services/auth/index.ts
```

Consumers import through the public surface:

```ts
import { Button, AppText } from "@/components/ui";
import { Screen } from "@/components/layout";
import { Wordmark } from "@/components/branding";
import { VerifyScreen } from "@/features/onboarding";
```

Within a feature, relative imports between sibling internal files are acceptable. Cross-feature
imports into another feature's internals are prohibited.

---

## Services and Models

Services encapsulate backend integration. Components do not call backend APIs directly.

```text
services/auth/
  auth.api.ts
  auth.mappers.ts
  auth.types.ts
  index.ts
```

- `*.api.ts` performs network requests.
- `*.types.ts` contains raw API shapes.
- `*.mappers.ts` converts API shapes into frontend/domain models.
- Feature domain models live in `features/<feature>/models/`.

Raw backend shapes and `snake_case` fields must not leak into components.

---

## Hooks and Providers

Cross-feature hooks live in `src/hooks/`. Feature hooks live in `features/<feature>/hooks/`.

Providers live in `src/providers/` and are composed in `AppProviders`. Provider-consuming hooks stay
near the provider they consume. Split providers that accumulate unrelated concerns.

---

## Styles and Assets

There are no CSS files on mobile. No `reset.css`, `globals.css`, `variables.css`, or `.module.css`.

- Shared visual values live in `src/styles/tokens.ts`.
- Fonts/images live under `assets/` at the project root.
- App icon and splash configuration live in the Expo config, not in component code.
- Style co-location and style extraction rules live in `mobile-styles`.

---

## File Co-location

Default to one component per `.tsx` file. Keep implementation-only types, constants, and helpers
local to that file.

Create extra files only when reuse or readability justifies it:

```text
CodeInput.tsx                  # fine while small

EventCard/
  EventCard.tsx
  types.ts                     # folder-scoped types, when shared or growing
  index.ts

MainTabBar.tsx
MainTabBar.types.ts            # flat-file companion when no parent folder owns the context
```

Type extraction rules:

- Keep types local when they are used by one file and the file remains easy to navigate.
- Extract types when they are shared across modules.
- Extract types when the file becomes difficult to scan.
- Extract contract types early when they are intentionally consumed across a boundary, such as route
  param lists, domain unions, and API response types.

Naming rules:

- Use `types.ts` when the parent folder already provides the context, such as `navigation/types.ts`
  or `EventCard/types.ts`.
- Use `<FileName>.types.ts` for a flat companion file, such as `MainTabBar.types.ts`.
- Do not create `*.types.ts`, `*.constants.ts`, or `*.utils.ts` files preemptively.

---

## Import Rules

- Import from public surfaces across boundaries.
- Use relative imports inside a feature boundary.
- Never import from another feature's internals.
- Use `import type` for type-only imports.

```ts
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";
```

---

## Folder Discipline

Avoid:

- Empty speculative folders
- `shared/` folders inside features
- `utils/` dumping grounds
- Deep nested component hierarchies before needed
- Generic folders without ownership meaning

Group utilities by responsibility:

```text
lib/date/
lib/format/
lib/string/
```

---

## Common Mistakes to Avoid

- Adding any `.tsx` file directly under `src/` other than `App.tsx`.
- Putting initialization or provider composition in `App.tsx`.
- Defining shared route param contracts inline in a navigator file.
- Putting screen content inside a navigator.
- Creating a mobile `router.tsx` route table.
- Creating CSS files or `.module.css` files.
- Putting `Wordmark` in `ui/` when a `branding/` boundary exists.
- Moving `PhoneNumberInput` or `CodeInput` to shared before reuse is proven.
- Keeping app-wide legal URLs inside one feature once multiple screens use them.
- Importing from internal implementation paths across boundaries.
- Creating `shared/` or `utils/` dumping grounds.
- Extracting local types, constants, helpers, or styles before reuse or readability requires it.
