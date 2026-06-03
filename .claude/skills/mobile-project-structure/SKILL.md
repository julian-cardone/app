---
name: mobile-project-structure
description:
  Apply this repository's React Native folder and module conventions when creating files, organizing
  code, deciding where something belongs, or reviewing structural choices on mobile. Use whenever a
  new component, hook, service, screen, or feature is being added, when deciding between
  `components/ui/` and `features/<feature>/components/`, when introducing a new feature folder, when
  setting up a public surface (`index.ts`), when adding a screen to navigation, when promoting code
  from feature-local to shared, when placing fonts or images, or when reviewing a PR for boundary
  violations. Trigger on casual phrasings too — "where should I put this", "is this shared or
  feature-specific", "where does this screen go", "where do fonts live", "can I import this from
  here". Do not rely on general React project intuition here; React Native structure differs from
  the web in load-bearing ways - the entry is `registerRootComponent(App)` not a DOM render, there
  is no `router.tsx` route table (navigation is a navigator tree), there are no global CSS files
  (design tokens live in a TS module), route-level units are screens not pages, and
  fonts/images/icon/splash live in `assets/` and the Expo config. Applies to React Native mobile.
  Web has its own conventions.
---

# Mobile Project Structure

These are the folder and module conventions for React Native code in this repository. Follow them
whenever creating files, deciding where code belongs, defining a module boundary, or reviewing
structural placement.

The project structure must remain scalable, predictable, and easy to navigate. A future engineer or
AI agent must be able to determine where code belongs, what owns a concern, which modules are
public, and which boundaries must remain isolated.

This skill covers physical organization for a React Native app (Expo managed workflow, React
Navigation). For component ownership and architectural rules, see `frontend-philosophy`. For styling
and layout, see `mobile-styles` and `mobile-layout`.

The shared spine of this structure — the `components/ui/` vs `features/` split, promotion rules,
public surfaces, services, import rules, and folder discipline — is identical to the web standard.
The differences are concentrated in the application entry, navigation, styling files, route-level
naming, and assets. Those are the sections that diverge below.

---

## Reference Structure

```text
app.json (or app.config.ts)    # Expo config: app name, icon, splash, plugins
index.js                       # Entry — registerRootComponent(App)
assets/
  fonts/                       # Bundled font files (expo-font)
  images/                      # Bundled images, icon, splash source

src/
  components/
    ui/                        # Shared UI primitives

  features/
    <feature-name>/
      components/              # Feature components
      hooks/                   # Feature-scoped hooks
      lib/                     # Feature-scoped pure logic
      models/                  # Feature domain models
      screens/                 # Route-level screens

  navigation/                  # Navigator tree + route param types

  services/                    # Backend integrations
  providers/
    AppProviders.tsx           # Provider tree: GestureHandler, SafeArea, Navigation
  hooks/
    useAppBootstrap.ts         # Async init gate: fonts, auth, remote config
  lib/                         # Cross-feature pure utilities

  styles/
    tokens.ts                  # Colors, spacing, radii, typography, shadows

  App.tsx                      # Thin shell: useAppBootstrap + AppProviders, nothing else
```

**Folders are not created before they contain files.** Structure emerges from real complexity, not
from speculative scaffolding.

---

## Application Entry

React Native has no DOM, no HTML document, and no global stylesheet to import — so the web's
`index.tsx` / `router.tsx` / `App.tsx` triad does not apply. The mobile entry has two pieces:

| File / dir                          | Responsibility                                                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `index.js` (root)                   | The entry. Registers the root component: `registerRootComponent(App)`. No DOM render.                              |
| `App.tsx`                           | Thin shell. Calls `useAppBootstrap`, gates on readiness, renders `AppProviders`. Zero business logic.              |
| `src/hooks/useAppBootstrap.ts`      | Async init gate. Owns font loading, splash coordination, and any future blocking init (auth, remote config, flags). Returns `boolean`. |
| `src/providers/AppProviders.tsx`    | Provider tree. Owns `GestureHandlerRootView`, `SafeAreaProvider`, `NavigationContainer`, and the navigator.        |
| `navigation/`                       | The navigator tree (stack and tab navigators) and route param types. **Not** a route-config table.                 |

`App.tsx` is the **only** top-level `.tsx` file under `src/`. It is a thin shell — three lines of
logic: call `useAppBootstrap`, gate on readiness, render `AppProviders`. It must never accumulate
initialization logic or provider composition.

**`useAppBootstrap` is the extension point for async initialization.** Any work that must complete
before the first frame — font loading, auth token rehydration, remote config fetches, feature flag
hydration — belongs here. The hook returns `boolean`; `App.tsx` renders `null` (keeping the native
splash visible) until it returns `true`. Adding new bootstrap behavior requires only editing this
hook.

**`AppProviders` is the extension point for the provider tree.** New context providers are added
here by wrapping inside the existing tree. Provider ordering is documented inline when dependencies
between providers make nesting non-obvious.

**The scalability principle: `App.tsx` never grows.** All growth lands in `useAppBootstrap`
(blocking init) or `AppProviders` (provider tree).

There is no `router.tsx`. Navigation is expressed as a tree of navigator components (e.g.
`RootNavigator` composing a tab navigator and stack navigators), not as a flat route configuration
object. Route param types live alongside the navigator that owns them.

> This structure assumes React Navigation (the navigation choice recorded in the frontend ADR). If
> the project ever adopts file-based routing instead, the entry, the `navigation/` folder, and the
> location of screens would all change — revisit this section if that decision is revisited.

---

## Shared and Feature Boundaries

Shared code lives outside `features/` and is domain-agnostic.

Feature code lives inside:

```text
features/<feature-name>/
```

The import rules:

- Shared modules must not import from feature folders.
- Feature modules may import from shared modules and services.
- Feature modules must not import directly from unrelated feature folders.

Cross-feature behavior is introduced through shared abstractions or service boundaries — only after
reuse is proven.

---

## Promotion Rules

Code stays local until reuse is proven.

A module used by only one feature belongs in that feature. Promotion into shared areas
(`components/ui/`, `hooks/`, `lib/`) requires:

1. Proven reuse.
2. Domain-agnostic behavior.
3. Stable abstraction boundaries.

Premature promotion creates fragile generic systems and weak ownership boundaries. When in doubt,
leave it in the feature folder.

---

## Public Surfaces

Every major boundary exposes a public surface through an `index.ts`:

```text
components/ui/index.ts
features/events/index.ts
services/events/index.ts
```

Consumers import through the public surface, not internal implementation files:

```ts
import { EventCard } from "@/features/events";
import { Button } from "@/components/ui";
```

Screen components live inside `features/<feature>/screens/` and are part of the feature they serve.
They are exported through the feature's `index.ts` so the navigator can register them without
reaching into internal paths:

```ts
// features/events/index.ts
export { EventScreen } from "./screens/EventScreen";

// navigation/EventsStack.tsx
import { EventScreen } from "@/features/events";
```

Internal implementation details stay private to their boundary. This is what allows internal
refactoring without cascading dependency breakage. If a consumer is reaching into an internal file,
the public surface is missing something — fix the surface, don't bypass it.

---

## Navigation

Navigation lives in `src/navigation/`. It owns:

- The navigator tree — a root navigator composing tab and stack navigators.
- Route param type definitions, co-located with the navigator that declares the routes.

Navigators register screens imported from feature public surfaces. They do not contain screen
content themselves — a navigator file wires routes to screens and nothing more. Feature-specific
workflow stays in the screen and its feature components, never in the navigator.

Cross-cutting navigation concerns (deep-link config, the `NavigationContainer`, theme) are set up in
`AppProviders`, not scattered across feature navigators.

---

## Services

Services encapsulate backend integration. Components must not call backend APIs directly.

A service folder structure:

```text
services/
  events/
    events.api.ts
    events.mappers.ts
    events.types.ts
    index.ts
```

| File           | Responsibility                            |
| -------------- | ----------------------------------------- |
| `*.api.ts`     | Network requests                          |
| `*.mappers.ts` | Backend/frontend translation              |
| `*.types.ts`   | API response types and raw backend shapes |
| `index.ts`     | Public surface                            |

`*.types.ts` holds API-layer types only — raw backend shapes in backend conventions. Domain models
live in `features/<feature>/models/` and are the `camelCase` application-facing types consumed by
components. Mappers translate between the two at the service boundary. Raw backend shapes must not
appear in component code.

---

## Hooks

Hooks are organized by scope.

**Cross-feature hooks** live in `src/hooks/`. Examples: `useDebounce`, `useColorScheme`,
`useAppState`. (Note: there is no `useLocalStorage` or `useMediaQuery` on mobile — persistent
storage goes through AsyncStorage / SecureStore in a service or provider, and responsive sizing uses
`useWindowDimensions`.)

**Feature-scoped hooks** live in `features/<feature>/hooks/`. Examples: `useEvent`, `useRsvp`.

A hook used by only one feature stays in that feature. Promotion requires proven cross-feature
reuse.

---

## Providers

Context providers live in `src/providers/`. Providers own cross-cutting state and application-wide
concerns (auth, theme, current user). They are composed in `AppProviders`.

Hooks that consume a provider's state live alongside the provider itself. Providers stay narrowly
scoped — a provider accumulating unrelated concerns should be split.

---

## Styles and Tokens

There are no global stylesheets and no CSS files. The web triad of `reset.css` / `globals.css` /
`variables.css` does not exist on mobile.

Shared design tokens live in `src/styles/tokens.ts` — a typed module exporting colors, spacing,
radii, typography, and shadows. All other styling is co-located with its component via
`StyleSheet.create`. See `mobile-styles` for the rules governing tokens versus component styles.

---

## Assets

Bundled assets live under `assets/` at the project root:

- `assets/fonts/` — font files loaded via `expo-font` (or `@expo-google-fonts`). Fonts are loaded
  once during app bootstrap in `src/hooks/useAppBootstrap.ts`.
- `assets/images/` — bundled images, plus the source images for the app icon and splash screen.

The app icon, splash screen, name, and native plugin configuration are declared in the Expo config
(`app.json` or `app.config.ts`) — not in code. Treat that config as part of the project structure: a
single source of truth for app-level identity, referenced by path into `assets/`.

---

## Feature Folders

A new feature folder is introduced only when the work owns:

1. A distinct user-facing workflow.
2. Distinct domain logic or models.

A feature folder is **not** created for:

- Generic dialogs or sheets
- Shared primitives
- Generic utilities
- Isolated visual components lacking domain behavior

Feature boundaries reflect product boundaries, not visual grouping.

---

## File Co-location

Files stay co-located with the concern they support:

```text
EventCard/
  EventCard.tsx
  EventCard.styles.ts   # only when the StyleSheet grows large; otherwise keep it at the bottom of the .tsx
  EventCard.types.ts
  index.ts
```

There is no `.module.css` — styles are a `StyleSheet.create` block inside the component file by
default, extracted to `EventCard.styles.ts` only when size justifies it. Additional files are
introduced only when complexity justifies the split. Small components stay compact — a single `.tsx`
is fine until it isn't.

---

## Import Rules

Imports respect ownership boundaries:

- Consumers import from public surfaces, not internal implementation files.
- Within a feature, relative imports between sibling modules are acceptable.
- Cross-feature imports reaching into internal implementation details are prohibited.
- Type-only imports use `import type`.

```ts
import type { Event } from "@/features/events";
```

`import type` makes runtime dependencies explicit, improves clarity, and reduces accidental runtime
coupling between modules.

---

## Folder Discipline

Folders stay intentional and minimal:

- Folders are not created before they contain files.
- Nested component hierarchies stay shallow.
- A `shared/` folder inside a feature must not exist. Cross-feature primitives belong in
  `components/ui/`.
- A `utils/` folder must not become a dumping ground.
- Generic folders without ownership meaning are avoided.

Utilities are grouped by responsibility, not pooled:

```text
lib/
  date/
  string/
  format/
```

Folder depth emerges from real project complexity, not speculative organization.

---

## Common Mistakes to Avoid

Recurring violations to watch for when adding files or reviewing structure:

- A `router.tsx` route-config table created on mobile — navigation is a navigator tree under
  `navigation/`, not a flat route object.
- A `.tsx` file other than `App.tsx` placed directly under `src/` (screens belong in a feature;
  primitives belong in `components/ui/`).
- CSS files (`reset.css`, `globals.css`, `variables.css`) or `.module.css` files — there is no CSS
  on mobile; tokens live in `styles/tokens.ts` and styles are co-located `StyleSheet` blocks.
- A screen placed outside its feature, or a navigator containing screen content instead of just
  wiring routes to screens.
- A component promoted to `components/ui/` after a single use — promotion requires proven reuse and
  domain-agnostic behavior.
- A consumer importing from an internal implementation file
  (`@/features/events/screens/EventScreen/EventScreen`) instead of the public surface
  (`@/features/events`).
- Fonts or images scattered through feature folders instead of `assets/`, or app icon/splash set in
  code instead of the Expo config.
- A component fetching from a backend directly instead of going through a service.
- `snake_case` field names in a component file (the mapper at the service boundary is missing or
  misplaced).
- A `shared/` folder inside a feature, or a `utils/` dumping ground instead of `lib/date/`,
  `lib/format/`, etc.
- A type-only import without `import type`.
- A provider accumulating unrelated cross-cutting concerns instead of being split.
- Any initialization logic in `App.tsx` beyond `useAppBootstrap()` and `<AppProviders />` — blocking
  init belongs in `useAppBootstrap`, provider composition belongs in `AppProviders`.

---

## Predictable Navigation

The structure makes ownership obvious. A future engineer or AI agent should be able to answer the
following quickly:

- Where does this code belong?
- Which layer owns this concern?
- Is this feature-specific or shared?
- What is the public interface?
- What dependencies are allowed?

The structure optimizes for local reasoning and predictable refactoring, not maximal generic reuse.

---

## When to Consult the Related Standards

- For component ownership, the boundary between shared primitives and feature components,
  abstraction rules, and naming conventions: `frontend-philosophy`.
- For unit choices, design tokens, variants, style keys, and platform-specific shadows:
  `mobile-styles`.
- For flex direction, shrinking, scroll ownership, safe areas, and constraint chains:
  `mobile-layout`.
