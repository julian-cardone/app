---
title: Project Structure
doc_type: standard
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-05-08
related:
  [
    "docs/standards/frontend-philosophy.md",
    "docs/standards/web-css.md",
    "docs/standards/web-layout.md",
    "docs/standards/documentation.md",
  ]
tags: [standards]
---

# Project Structure

This document defines the physical organization of frontend code.

It covers folder boundaries, module ownership, public surfaces, feature organization, and file
placement conventions.

The project structure must remain scalable, predictable, and easy to navigate.

A future engineer or AI agent should be able to determine:

- Where code belongs
- What owns a concern
- Which modules are public
- Which boundaries must remain isolated

For architectural philosophy and ownership rules, see
[Frontend Philosophy](./frontend-philosophy.md).

For styling conventions, see [Web CSS Standards](./web-css.md).

For layout mechanics and overflow behavior, see [Web Layout](./web-layout.md).

---

## Reference Structure

```text
src/
  components/
    ui/                        # Shared UI primitives

  features/
    <feature-name>/
      components/              # Feature components
      hooks/                   # Feature-scoped hooks
      lib/                     # Feature-scoped pure logic
      models/                  # Feature domain models
      pages/                   # Route-level pages

  services/                    # Backend integrations
  providers/                   # Context providers
  hooks/                       # Cross-feature hooks
  lib/                         # Cross-feature pure utilities

  styles/
    reset.css
    globals.css
    variables.css

  App.tsx
  router.tsx
  index.tsx
```

Folders must not be created before they contain files.

Structure should emerge from real complexity rather than speculative organization.

---

## Application Entry

The application root consists of three files:

- `index.tsx`
- `router.tsx`
- `App.tsx`

Responsibilities are divided as follows:

| File         | Responsibility                            |
| ------------ | ----------------------------------------- |
| `index.tsx`  | DOM entry and global stylesheet imports   |
| `router.tsx` | Route configuration                       |
| `App.tsx`    | Root application shell and provider setup |

These files must remain narrowly scoped.

They must not absorb unrelated concerns.

These are the only `.tsx` files permitted directly under `src/`.

All other components belong within feature or component boundaries.

---

## Shared and Feature Boundaries

Shared code lives outside `features/` and must remain domain-agnostic.

Feature code lives inside:

```text
features/<feature-name>/
```

Shared modules must not import from feature folders.

Feature modules may import from shared modules and services.

Feature modules must not import directly from unrelated feature folders.

Cross-feature behavior should be introduced through shared abstractions or service boundaries only
after reuse is proven.

See [Frontend Philosophy](./frontend-philosophy.md) for component ownership and abstraction rules.

---

## Promotion Rules

Code should remain local until reuse is proven.

A module used by only one feature belongs in that feature.

Promotion into shared areas such as:

- `components/ui/`
- `hooks/`
- `lib/`

requires:

1. Proven reuse
2. Domain-agnostic behavior
3. Stable abstraction boundaries

Premature promotion creates fragile generic systems and weak ownership boundaries.

The decision of whether a pattern is stable enough to abstract — the three-condition test and the
rule of three — is defined in [Frontend Philosophy](./frontend-philosophy.md).

---

## Public Surfaces

Every major boundary should expose a public surface.

Examples include:

```text
components/ui/index.ts
features/events/index.ts
services/events/index.ts
```

Consumers import through the public surface rather than internal implementation files.

```ts
import { EventCard } from "@/features/events";
import { Button } from "@/components/ui";
```

Page components live inside `features/<feature>/pages/` and are part of the feature they serve. They
must be exported through the feature's `index.ts` so that `router.tsx` can import them from the
feature's public surface rather than reaching into internal paths.

```ts
// features/events/index.ts
export { EventPage } from "./pages/EventPage";

// router.tsx
import { EventPage } from "@/features/events";
```

Internal implementation details must remain private to their boundary.

This allows internal refactoring without cascading dependency breakage.

---

## Services

Services encapsulate backend integration.

Components must not call backend APIs directly.

A service structure typically includes:

```text
services/
  events/
    events.api.ts
    events.mappers.ts
    events.types.ts
    index.ts
```

Responsibilities are divided as follows:

| File           | Responsibility                        |
| -------------- | ------------------------------------- |
| `*.api.ts`     | Network requests                      |
| `*.mappers.ts` | Backend/frontend translation          |
| `*.types.ts`   | API response types and backend shapes |
| `index.ts`     | Public surface                        |

`*.types.ts` holds API-layer types: the raw shapes returned by the backend, expressed in backend
conventions. These types must not be used directly in component code.

Domain models live in `features/<feature>/models/`. These are frontend types expressed in frontend
conventions — the mapped, application-facing representation of backend data. Mappers in
`*.mappers.ts` translate from API types to domain models at the service boundary.

```text
services/events/events.types.ts   → ApiEvent (snake_case, raw API shape)
features/events/models/           → Event (camelCase, domain model)
services/events/events.mappers.ts → maps ApiEvent → Event
```

Component code uses domain models from `features/<feature>/models/`. API types from services must
not appear in component files.

See [Frontend Philosophy](./frontend-philosophy.md) for model-separation rules.

---

## Hooks

Hooks are organized by scope.

### Cross-feature hooks

Cross-feature hooks live in:

```text
src/hooks/
```

Examples include:

- `useDebounce`
- `useLocalStorage`
- `useMediaQuery`

---

### Feature hooks

Feature-scoped hooks live in:

```text
features/<feature>/hooks/
```

Examples include:

- `useEvent`
- `useRsvp`

Hooks used by only one feature remain in that feature.

Promotion to shared hooks requires proven cross-feature reuse.

---

## Providers

Context providers live in:

```text
src/providers/
```

Providers own cross-cutting state and application-wide concerns.

Hooks consuming provider state should live alongside the provider itself.

Providers must remain narrowly scoped.

A provider accumulating unrelated concerns should be split.

---

## Styles

Global stylesheets live in:

```text
src/styles/
```

Only the following files are permitted:

- `reset.css`
- `globals.css`
- `variables.css`

All other styling must use CSS Modules co-located with components.

Global styles must remain minimal.

See [CSS Standards](./web-css.md).

---

## Feature Folders

A new feature folder should be introduced only when the work owns:

1. A distinct user-facing workflow
2. Distinct domain logic or models

A feature folder must not be created for:

- Generic dialogs
- Shared primitives
- Generic utilities
- Isolated visual components lacking domain behavior

Feature boundaries should reflect product boundaries rather than visual grouping alone.

---

## File Co-location

Files should remain co-located with the concern they support.

Example:

```text
EventCard/
  EventCard.tsx
  EventCard.module.css
  EventCard.types.ts
  index.ts
```

Additional files should only be introduced when complexity justifies the split.

Small components should remain compact.

Structure should scale gradually with complexity.

---

## Import Rules

Imports must respect ownership boundaries.

Consumers should import from public surfaces rather than internal implementation files.

Within a feature, relative imports between sibling modules are acceptable.

Cross-feature imports reaching into internal implementation details are prohibited.

Feature boundaries should remain encapsulated.

Type-only imports must use `import type`.

```ts
import type { Event } from "@/features/events";
```

This makes runtime dependencies explicit, improves clarity, and reduces accidental runtime coupling
between modules.

---

## Folder Discipline

Folders should remain intentional and minimal.

The following rules apply:

- Folders must not exist before they contain files
- Nested component hierarchies should remain shallow
- `shared/` folders inside features must not exist
- `utils/` must not become a dumping ground
- Generic folders without ownership meaning should be avoided

Utilities should instead be grouped by responsibility:

```text
lib/
  date/
  string/
  dom/
```

Folder depth should emerge from real project complexity rather than speculative organization.

---

## Predictable Navigation

The structure of the project should make ownership obvious.

A future engineer or AI agent should be able to answer the following quickly:

- Where does this code belong?
- Which layer owns this concern?
- Is this feature-specific or shared?
- What is the public interface?
- What dependencies are allowed?

The structure should optimize for local reasoning and predictable refactoring rather than maximal
generic reuse.
