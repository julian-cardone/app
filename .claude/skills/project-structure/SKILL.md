---
name: project-structure
description:
  Apply this repository's frontend folder and module conventions when creating files, organizing
  code, deciding where something belongs, or reviewing structural choices. Use whenever a new
  component, hook, service, or feature is being added, when deciding between `components/ui/` and
  `features/<feature>/components/`, when introducing a new feature folder, when setting up a public
  surface (`index.ts`), when promoting code from feature-local to shared, when configuring imports,
  or when reviewing a PR for boundary violations. Trigger on casual phrasings too — "where should I
  put this", "is this shared or feature-specific", "should I make a new folder for X", "can I import
  this from here", "this feels like it's in the wrong place". Do not rely on general React project
  intuition here; this codebase has specific rules about the three-file app entry (`index.tsx` /
  `router.tsx` / `App.tsx`), promotion criteria for shared code, public-surface imports, service
  file naming (`*.api.ts` / `*.mappers.ts` / `*.types.ts` / `index.ts`), forbidden folder names
  (`shared/` inside features, `utils/` as a dumping ground), and `import type` for type-only
  imports. Applies to React on both web and mobile.
---

# Project Structure

These are the folder and module conventions for frontend code in this repository. Follow them
whenever creating files, deciding where code belongs, defining a module boundary, or reviewing
structural placement.

The full prose version lives at `docs/standards/project-structure.md` in the repository. This skill
is the operational summary — consult the source doc for extended rationale.

The project structure must remain scalable, predictable, and easy to navigate. A future engineer or
AI agent must be able to determine where code belongs, what owns a concern, which modules are
public, and which boundaries must remain isolated.

This skill covers physical organization. For component ownership and architectural rules, see
`frontend-philosophy`. For platform-specific styling and layout, see the CSS and layout skills for
your platform.

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

**Folders are not created before they contain files.** Structure emerges from real complexity, not
from speculative scaffolding.

---

## Application Entry

The application root consists of exactly three files:

| File         | Responsibility                            |
| ------------ | ----------------------------------------- |
| `index.tsx`  | DOM entry and global stylesheet imports   |
| `router.tsx` | Route configuration                       |
| `App.tsx`    | Root application shell and provider setup |

These files stay narrowly scoped and do not absorb unrelated concerns. They are the **only** `.tsx`
files permitted directly under `src/`. All other components belong within feature or component
boundaries.

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

Internal implementation details stay private to their boundary. This is what allows internal
refactoring without cascading dependency breakage. If a consumer is reaching into an internal file,
the public surface is missing something — fix the surface, don't bypass it.

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

| File           | Responsibility               |
| -------------- | ---------------------------- |
| `*.api.ts`     | Network requests             |
| `*.mappers.ts` | Backend/frontend translation |
| `*.types.ts`   | Backend and frontend types   |
| `index.ts`     | Public surface               |

Backend/frontend translation happens in mappers. Raw backend response shapes must not leak into
component code — that's a sign the mapper is missing or misplaced.

---

## Hooks

Hooks are organized by scope.

**Cross-feature hooks** live in `src/hooks/`. Examples: `useDebounce`, `useLocalStorage`,
`useMediaQuery`.

**Feature-scoped hooks** live in `features/<feature>/hooks/`. Examples: `useEvent`, `useRsvp`.

A hook used by only one feature stays in that feature. Promotion requires proven cross-feature
reuse.

---

## Providers

Context providers live in `src/providers/`. Providers own cross-cutting state and application-wide
concerns.

Hooks that consume a provider's state live alongside the provider itself. Providers stay narrowly
scoped — a provider accumulating unrelated concerns should be split.

---

## Styles

Global stylesheets live in `src/styles/`. Only these files are permitted:

- `reset.css`
- `globals.css`
- `variables.css`

All other styling uses CSS Modules co-located with components. Global styles stay minimal. See the
CSS skill for your platform for the rules governing what belongs in global files versus a module.

---

## Feature Folders

A new feature folder is introduced only when the work owns:

1. A distinct user-facing workflow.
2. Distinct domain logic or models.

A feature folder is **not** created for:

- Generic dialogs
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
  EventCard.module.css
  EventCard.types.ts
  index.ts
```

Additional files are introduced only when complexity justifies the split. Small components stay
compact — a single `.tsx` is fine until it isn't. Structure scales gradually with complexity, never
in advance of it.

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
  dom/
```

Folder depth emerges from real project complexity, not speculative organization.

---

## Common Mistakes to Avoid

Recurring violations to watch for when adding files or reviewing structure:

- A new `.tsx` file placed directly under `src/` (anything beyond `index.tsx`, `router.tsx`,
  `App.tsx` belongs in a feature or `components/ui/`).
- A component promoted to `components/ui/` after a single use in a feature — promotion requires
  proven reuse and domain-agnostic behavior.
- A consumer importing from an internal implementation file
  (`@/features/events/components/EventCard/EventCard`) instead of the public surface
  (`@/features/events`).
- A feature folder created for a generic dialog, shared primitive, or component without distinct
  domain behavior.
- A component fetching from a backend directly instead of going through a service.
- `snake_case` field names in a component file (the mapper at the service boundary is missing or
  misplaced).
- A `shared/` folder created inside a feature for cross-feature primitives. Those belong in
  `components/ui/`.
- A `utils/` folder accumulating unrelated helpers instead of `lib/date/`, `lib/string/`, etc.
- A type-only import without `import type`.
- An empty folder created in anticipation of files that don't yet exist.
- A provider in `src/providers/` accumulating unrelated cross-cutting concerns instead of being
  split.

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
- For styling rules, units, variants, and class naming: the CSS skill for your platform (`web-css`,
  or the mobile equivalent when present).
- For flex layout, scroll ownership, and constraint chains: the layout skill for your platform
  (`web-layout`, or the mobile equivalent when present).
