---
name: mobile-project-structure
description:
  Apply this repository's React Native folder and module conventions when creating, moving, or
  reviewing files on mobile. Use when deciding where screens, feature components, shared UI,
  branding components, layout primitives, providers, navigation types, services, config, assets,
  hooks, tokens, Expo config, dependency policy, or tooling config belong. Trigger on "where should
  this go", "is this shared", "where do fonts live", "where do links/constants go", "should this be
  in components/ui", and PR reviews for boundary violations. Applies to Expo/React Native with React
  Navigation. Web has its own project structure skill.
---

# Mobile Project Structure

Mobile structure must make ownership obvious and prevent drift. Code stays local until reuse is
proven. Shared areas exist for domain-agnostic behavior only.

This skill owns physical file placement and project-level tooling placement. Architecture rules live
in `frontend-philosophy`. Styling rules live in `mobile-styles`. Flex, scroll, keyboard, and
safe-area rules live in `mobile-layout`.

---

## Reference Structure

```text
app.config.ts                      # Expo config: native/build metadata, env-specific overrides
babel.config.js                    # Babel/Expo transforms and runtime alias support
eslint.config.mjs                  # lint rules and file-environment overrides
package.json                       # scripts, dependencies, dependency policy surface
tsconfig.json                      # TypeScript compiler and editor config
.nvmrc                             # Node LTS version for the project
assets/
  fonts/                           # bundled fonts if not using @expo-google-fonts
  images/                          # bundled images, icon, splash source
config/                            # optional build-time Node config shared by root config files

src/
  App.tsx                          # thin shell only

  components/
    ui/                            # shared UI primitives: Button, AppText, generic inputs
    layout/                        # shared layout primitives: Screen, Stack if proven
    branding/                      # brand primitives: Wordmark, Logo

  config/
    links.ts                       # app runtime public constants, legal URLs, public links

  features/
    <feature-name>/
      components/                  # feature-specific components
      hooks/                       # feature-scoped hooks
      lib/                         # feature-scoped pure logic
      models/                      # feature domain models
      screens/                     # route-level screens
      index.ts                     # feature public surface

  navigation/
    RootNavigator.tsx
    MainNavigator.tsx
    OnboardingNavigator.tsx
    MainTabBar.tsx
    routes.ts                      # centralized route name constants
    types.ts                       # route param contracts

  providers/
    AppProviders.tsx               # GestureHandler, SafeArea, Navigation, app providers

  hooks/
    useAppBootstrap.ts             # font loading, splash coordination, blocking init

  services/
    <service-name>/
      <service-name>.api.ts
      <service-name>.mappers.ts
      <service-name>.types.ts
      index.ts

  lib/                             # cross-feature pure utilities, grouped by responsibility
  styles/
    tokens.ts                      # colors, spacing, radii, typography, shadows, animation
```

Folders are not created before they contain files.

---

## Application Entry

React Native has no DOM render, no route table, and no global CSS imports.

| File / module                    | Responsibility                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------------ |
| `index.ts`                       | Registers the root component with `registerRootComponent(App)`                       |
| `src/App.tsx`                    | Thin shell: calls `useAppBootstrap`, gates readiness, renders `AppProviders`         |
| `src/hooks/useAppBootstrap.ts`   | Blocking app init: fonts, splash coordination, future auth/remote config gates       |
| `src/providers/AppProviders.tsx` | Provider tree: gesture root, safe-area provider, navigation container, app providers |
| `src/navigation/`                | Navigator tree and route param contracts                                             |

`App.tsx` must not grow. It should look conceptually like:

```tsx
export default function App() {
  const appReady = useAppBootstrap();
  return appReady ? <AppProviders /> : null;
}
```

If initialization grows, edit `useAppBootstrap`. If providers grow, edit `AppProviders`. Do not put
business logic, screen logic, navigation decisions, or provider composition directly in `App.tsx`.

`useAppBootstrap` should prevent the native splash from hiding before init finishes, load fonts, and
avoid permanent startup hangs by treating font load errors as ready enough to continue.

---

## Expo Config and Build-Time Environment

`app.config.ts` belongs at the app root. It configures the native/build-time app identity: app name,
slug, icon, splash, orientation, bundle/package identifiers, plugins, and environment-specific
native settings.

Rules:

- `app.config.ts` runs in Node before the app bundle exists.
- Do not import from `src/` inside `app.config.ts`.
- Keep simple env logic inline in `app.config.ts`.
- If root config files need shared env logic, place it in root `config/`, not `src/config/`.
- `src/config/` is for runtime app constants used by bundled application code.

Good simple config:

```ts
import type { ConfigContext, ExpoConfig } from "expo/config";

const APP_ENV = process.env.APP_ENV ?? "development";
const IS_PROD = APP_ENV === "production";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: IS_PROD ? "Placecard" : "Placecard Dev",
  slug: "placecard",
  version: "1.0.0",
  orientation: "portrait",
});
```

`APP_ENV` is set by shell commands, package scripts, or later by EAS build profiles. If not set, the
project should default to development.

---

## Tooling and Dependency Management

Use active LTS Node versions for Expo/React Native development. Do not use Current/experimental Node
versions unless the project has a documented requirement. Add `.nvmrc` so new machines use the same
Node LTS version.

Dependency updates are handled through Dependabot and follow SemVer:

| Update Type | Policy                                                                            |
| ----------- | --------------------------------------------------------------------------------- |
| Patch       | Merge after CI passes.                                                            |
| Minor       | Review release notes. Merge after CI passes and a smoke test.                     |
| Major       | Create a dedicated issue and branch. Review migration guidance. Never auto-merge. |

Dependabot PRs follow the same review process as any other change:

- CI must pass.
- Updates must be reviewed before merging.
- Major updates require a dedicated issue and implementation plan.
- Dependabot PRs are never auto-merged.

Expo, React, React Native, `expo-*`, and native `react-native-*` packages are a compatibility group.
Do not upgrade them independently without verifying compatibility with the current Expo SDK. Prefer
Expo-managed versions when updating Expo-managed dependencies.

Validation for dependency updates:

```bash
npm run typecheck
npm run lint
npm run format:check
```

Runtime dependency updates also require a manual app smoke test.

---

## TypeScript, Babel, and Aliases

`tsconfig.json` teaches TypeScript and the editor how to resolve aliases:

```json
"paths": {
  "@/*": ["./src/*"]
}
```

Babel/Metro must also understand runtime imports. Keep alias configuration aligned in
`babel.config.js` when the project uses Babel module resolution:

```js
alias: {
  "@": "./src",
}
```

Mental model:

```text
tsconfig paths = TypeScript/editor understands @
Babel/Metro alias = app bundler understands @
```

---

## ESLint File Environments

Root config files may run in Node/CommonJS while app code runs in React Native. ESLint must know the
difference.

Use overrides for files such as:

```text
babel.config.js
metro.config.js
*.config.js
*.config.cjs
```

so globals like `process`, `module`, `require`, and `__dirname` are allowed only where appropriate.

---

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

## Shared, Layout, Branding, and Feature Boundaries

Use these locations deliberately:

| Location                         | Belongs here                                                                  | Does not belong here                              |
| -------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------- |
| `components/ui/`                 | Domain-agnostic primitives: `Button`, `AppText`, generic input primitives     | Feature text, workflow, navigation, backend calls |
| `components/layout/`             | Shared layout shells: `Screen`, proven `Stack`/`HStack`                       | Feature-specific page structure                   |
| `components/branding/`           | Brand-only primitives: `Wordmark`, `Logo`                                     | Screen positioning or feature behavior            |
| `features/<feature>/components/` | Feature-specific components: `PhoneNumberInput`, `CodeInput`, `TermsFootnote` | Cross-feature primitives                          |
| `features/<feature>/screens/`    | Route-level screens for that feature                                          | Shared UI primitives                              |
| `src/config/`                    | App runtime public constants and external links                               | Build-time Expo/tooling config                    |
| root `config/`                   | Build-time Node config shared by root config files                            | Runtime app code                                  |

Examples from the current app:

- `Wordmark` belongs in `components/branding/`.
- `Button` and `AppText` belong in `components/ui/`.
- `Screen` belongs in `components/layout/`.
- `PhoneNumberInput`, `CodeInput`, and `TermsFootnote` stay in `features/onboarding/components/`
  until reuse outside onboarding is proven.
- Legal URLs belong in `src/config/links.ts` if they are used by multiple screens or features.

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

Treat a feature-level `index.ts` as that feature's public API. Export only the screens, providers,
hooks, components, or models intentionally used outside the feature. Do not export implementation
details just because they exist.

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

If app access state becomes real, prefer an app access provider plus `useAppAccess` hook over a
standalone `useOnboardingRequired` hook.

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
CodeInput.tsx

EventCard/
  EventCard.tsx
  types.ts
  index.ts

MainTabBar.tsx
MainTabBar.types.ts
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

When a module exports both runtime values and types and both are needed, use one mixed import to
avoid duplicate imports while preserving type-only markers:

```ts
import { SCREEN_INSET_MODE, type ScreenInsetMode } from "./types";
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
- Importing from `src/` inside `app.config.ts`.
- Defining shared route param contracts inline in a navigator file.
- Repeating raw route strings in param lists, screen prop types, navigators, or navigation actions
  instead of using route constants.
- Putting screen content inside a navigator.
- Creating a mobile `router.tsx` route table.
- Creating CSS files or `.module.css` files.
- Putting `Wordmark` in `ui/` when a `branding/` boundary exists.
- Moving `PhoneNumberInput` or `CodeInput` to shared before reuse is proven.
- Keeping app-wide legal URLs inside one feature once multiple screens use them.
- Importing from internal implementation paths across boundaries instead of public `index.ts`
  surfaces.
- Creating `shared/` or `utils/` dumping grounds.
- Extracting local types, constants, helpers, or styles before reuse or readability requires it.
- Using an enum for route names, tab names, or other UI literal values instead of an `as const`
  object.
- Using non-LTS Node for Expo/React Native development.
- Auto-merging Dependabot updates or treating major dependency updates as routine patches.
