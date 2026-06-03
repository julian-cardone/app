---
name: web-project-structure
description:
  Apply this repository's web frontend folder and module conventions when creating files, organizing
  code, deciding where something belongs, setting up public surfaces, or reviewing web React
  structure. Use for web projects with `index.tsx` / `router.tsx` / `App.tsx`, CSS modules,
  shared-vs-feature placement, services, hooks, providers, and import boundaries. For React Native
  mobile, use `mobile-project-structure` instead.
---

# Web Project Structure

This skill is for web React structure only. React Native has different entry, navigation, styling,
and asset rules; use `mobile-project-structure` for mobile.

Physical structure must make ownership clear and prevent drift. Architecture rules live in
`frontend-philosophy`. CSS rules live in the web CSS skill. Layout rules live in the web layout
skill.

---

## Reference Structure

```text
src/
  index.tsx                    # DOM entry and global stylesheet imports
  router.tsx                   # route configuration
  App.tsx                      # root application shell and provider setup

  components/
    ui/                        # shared UI primitives

  features/
    <feature-name>/
      components/              # feature-specific components
      hooks/                   # feature-scoped hooks
      lib/                     # feature-scoped pure logic
      models/                  # feature domain models
      pages/                   # route-level pages
      index.ts                 # feature public surface

  services/                    # backend integrations
  providers/                   # context providers
  hooks/                       # cross-feature hooks
  lib/                         # cross-feature pure utilities

  styles/
    reset.css
    globals.css
    variables.css
```

Folders are not created before they contain files.

---

## Application Entry

The web root has exactly three top-level `.tsx` files under `src/`:

| File         | Responsibility                           |
| ------------ | ---------------------------------------- |
| `index.tsx`  | DOM render and global stylesheet imports |
| `router.tsx` | Route configuration                      |
| `App.tsx`    | Root shell and provider setup            |

These files stay narrow. All other `.tsx` files belong in feature or shared component boundaries.

---

## Shared and Feature Boundaries

Shared code lives outside `features/` and is domain-agnostic.

Feature code lives inside `features/<feature-name>/` and owns a distinct user-facing workflow or
domain area.

Rules:

- Shared modules must not import from feature folders.
- Feature modules may import from shared modules and services.
- Feature modules must not import directly from unrelated feature folders.
- Cross-feature behavior is introduced through shared abstractions or service boundaries only after
  reuse is proven.

---

## Promotion Rules

Code stays local until reuse is proven. Promotion into `components/ui/`, `hooks/`, or `lib/`
requires:

1. Proven reuse.
2. Domain-agnostic behavior.
3. Stable abstraction boundaries.

When in doubt, leave code in the feature folder.

---

## Public Surfaces

Every major boundary exposes an `index.ts` public surface:

```text
components/ui/index.ts
features/events/index.ts
services/events/index.ts
```

Consumers import through public surfaces:

```ts
import { EventPage } from "@/features/events";
import { Button } from "@/components/ui";
```

Pages live in `features/<feature>/pages/` and are exported through the feature public surface so
`router.tsx` does not reach into internal paths.

---

## Services

Services encapsulate backend integration. Components must not call backend APIs directly.

```text
services/events/
  events.api.ts
  events.mappers.ts
  events.types.ts
  index.ts
```

- `*.api.ts` performs network requests.
- `*.types.ts` contains raw API response/request shapes.
- `*.mappers.ts` translates API shapes into frontend/domain models.
- Feature domain models live in `features/<feature>/models/`.

Raw backend shapes and `snake_case` fields must not appear in component code.

---

## Hooks and Providers

Cross-feature hooks live in `src/hooks/`. Feature-scoped hooks live in `features/<feature>/hooks/`.

Providers live in `src/providers/` and own cross-cutting state such as auth, theme, current user, or
application-wide preferences. Split providers that accumulate unrelated concerns.

---

## Styles

Only global stylesheets live in `src/styles/`:

- `reset.css`
- `globals.css`
- `variables.css`

All other styling uses CSS Modules co-located with components. Global styles stay minimal.

---

## Feature Folders

Create a feature folder only for a distinct user-facing workflow or domain area.

Do not create a feature folder for:

- Generic dialogs
- Shared primitives
- Generic utilities
- Isolated visual components without domain behavior

Feature boundaries reflect product boundaries, not visual grouping.

---

## File Co-location

Keep files with the concern they support:

```text
EventCard/
  EventCard.tsx
  EventCard.module.css
  EventCard.types.ts
  index.ts
```

Additional files are introduced only when complexity justifies the split. Small components may stay
as a single `.tsx` plus co-located CSS module when appropriate.

---

## Import Rules

- Consumers import from public surfaces, not internal implementation files.
- Within a feature, relative imports between sibling modules are acceptable.
- Cross-feature imports into another feature's internals are prohibited.
- Type-only imports use `import type`.

```ts
import type { Event } from "@/features/events";
```

---

## Folder Discipline

Avoid:

- Empty speculative folders
- `.tsx` files directly under `src/` beyond `index.tsx`, `router.tsx`, and `App.tsx`
- `shared/` folders inside features
- `utils/` dumping grounds
- Deep hierarchy before real complexity exists

Group utilities by responsibility:

```text
lib/date/
lib/string/
lib/dom/
```

---

## Common Mistakes to Avoid

- Putting route/page content in `App.tsx`.
- Creating files directly under `src/` instead of a feature or shared boundary.
- Promoting a component to shared after one use.
- Importing from internal feature paths across boundaries.
- Creating a feature folder for a generic visual component.
- Fetching from a backend directly inside a component.
- Letting raw backend shapes leak into components.
- Creating `shared/` or `utils/` dumping grounds.
- Missing `import type` for type-only imports.
