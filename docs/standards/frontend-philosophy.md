---
title: Frontend Philosophy
doc_type: standard
status: draft
owners: ["@julian-cardone"]
last_reviewed: 2026-05-08
related:
  [
    "docs/standards/css.md",
    "docs/standards/project-structure.md",
    "docs/standards/layout.md",
    "docs/standards/documentation.md",
  ]
tags: [standards]
---

# Frontend Philosophy

This document defines the architectural principles governing frontend code.

It covers component ownership, abstraction boundaries, state ownership, workflow composition, and
frontend system design philosophy.

The frontend architecture must remain minimal, durable, predictable, and scalable.

Code organization should favor explicit structure, narrow ownership, and predictable refactoring
over generic abstraction systems.

For styling rules and CSS conventions, see [CSS Standards](./css.md).

For flex behavior, overflow ownership, and layout mechanics, see [Layout](./layout.md).

For folder structure and module boundaries, see [Project Structure](./project-structure.md).

---

## Guiding Principles

Frontend systems must remain understandable as the application grows.

A future engineer or AI agent should be able to:

- Locate ownership quickly
- Modify behavior confidently
- Refactor features predictably
- Introduce new functionality without fragile coupling

The architecture therefore favors:

- Explicit structure over hidden abstraction
- Composition over inheritance-like systems
- Narrow ownership boundaries
- Local reasoning
- Predictable data flow
- Stable public interfaces

Complexity must be introduced deliberately.

Abstraction exists to reduce complexity, not to centralize it.

---

## Ownership

Every concern in the frontend should have a clear owner.

Ambiguous ownership produces duplicated logic, diverging state, and fragile behavior.

Ownership boundaries must remain explicit.

Examples:

| Concern             | Owner             |
| ------------------- | ----------------- |
| Workflow state      | Feature component |
| Form state          | Form component    |
| Route-level data    | Page              |
| Visual styling      | CSS               |
| Layout constraints  | Layout container  |
| Cross-cutting state | Context provider  |
| Backend integration | Service layer     |

A concern should generally be owned by the lowest layer capable of managing it correctly.

---

## Component Layers

Components fall into two categories.

The boundary between them must remain explicit.

### Shared UI Primitives

Shared UI primitives are reusable, domain-agnostic building blocks.

They own:

- Structure
- Visual states
- Variants
- Accessibility behavior

They must not own:

- Workflow logic
- Backend integration
- Domain models
- Feature-specific behavior

Shared primitives should remain narrowly scoped and broadly reusable.

See [Project Structure](./project-structure.md) for placement and module-boundary rules.

---

### Feature Components

Feature components live in `features/<feature>/components/`.

They compose shared primitives into domain workflows.

Examples include:

- `EventCoverPicker`
- `RsvpButton`
- `EventCard`

Feature components may:

- Reference domain models
- Own workflow state
- Manage loading and error states
- Coordinate multiple primitives
- Own feature-specific interactions

Feature components must use names describing domain responsibility.

---

## Pages

Pages are route-level composition shells.

Pages primarily own:

1. Route-level layout
2. Feature composition
3. Page-level state
4. Routing concerns

Workflow logic and section-level rendering belong in feature components rather than pages.

If a block of JSX:

- Owns state
- Manages a workflow
- Represents a distinct visual section

it should generally be extracted into a feature component.

Pages should remain composition-oriented rather than content-heavy.

---

## State Ownership

State must live at the lowest component that reasonably owns it.

The following ownership patterns apply:

- Form values belong to the form
- Selection state belongs to the section managing selection
- Modal state belongs to the component opening the modal
- Route-level data belongs to the page

State must not be duplicated.

Derived values should be computed from source state whenever possible rather than copied into
independent state variables.

If a hook owns data, consuming components should derive from that hook rather than shadowing the
same state locally.

Independent state is justified only when ownership genuinely differs.

---

## Context

Context exists for cross-cutting concerns.

Examples include:

- Authentication
- Theme
- Current user
- Application-wide preferences

Context must not become a substitute for ordinary composition or short-distance prop passing.

State should be lifted only when ownership genuinely spans multiple branches of the tree.

---

## Effects

Effects are synchronization boundaries, not general-purpose lifecycle hooks.

If logic can be derived during render, it must not be implemented in an effect.

Effects should primarily synchronize React state with:

- Network requests
- Browser APIs
- Timers
- External systems

Effects that only derive local values from other local values usually indicate misplaced state or
unnecessary synchronization.

---

## Controlled vs. Uncontrolled State

Reusable primitives should generally prefer controlled APIs when external workflow state matters.

Feature components may use uncontrolled internal state for ephemeral UI concerns that do not affect
external workflows.

Controlled ownership should remain explicit.

---

## Props and Interfaces

Every component must declare typed props.

Implicit `any` props are disallowed.

```tsx
type ButtonProps = {
  variant: "primary" | "secondary";
  onClick: () => void;
  children: ReactNode;
};
```

Component interfaces should remain narrow and explicit.

A component accumulating many unrelated props or feature flags usually indicates excessive
responsibility.

Reusable components should expose stable public interfaces rather than leaking implementation
details.

---

## Public Interfaces

Components, services, and features should expose stable public interfaces.

Internal implementation details should remain private so modules can be refactored without breaking
external consumers.

See [Project Structure](./project-structure.md) for public surface and import rules.

---

## Abstraction

Abstraction should be introduced cautiously.

Before introducing an abstraction, the following must be true:

1. The repeated structure is stable
2. The abstraction is simpler than the duplication it replaces
3. The abstraction makes future work easier

If any condition is not met, duplication is preferred.

Appropriate abstractions include:

- Shared UI primitives
- Stable visual variants
- Pure mappers
- Reusable structural wrappers

Inappropriate abstractions include:

- Universal `DataTable` systems
- Generic workflow engines
- Single abstractions covering unrelated behavior
- Generic `Manager` or `Handler` systems

Two similar implementations are acceptable.

Three similar implementations is the threshold at which shared structure should be evaluated.

---

## Naming

Names must describe responsibility.

Generic names are reserved for shared primitives.

Feature components must use domain-specific names.

The following names should generally be avoided:

- `Manager`
- `Handler`
- `Wrapper`
- `DataTable`

These names usually indicate unclear ownership or excessive responsibility.

---

## Forms

Forms own:

- Field values
- Validation state
- Submission shape

Parents own:

- Submission consequences
- API calls
- Navigation
- Success workflows

A reset action should clear both form state and any derived parent state.

---

## Tables

Tables render rows and invoke callbacks.

They must not fetch data or own workflow state.

Tables accept:

- Rows or items
- Selected identifiers
- Callbacks for row actions

The surrounding feature component owns loading, selection, modals, and workflow behavior.

---

## Backend and Frontend Separation

Backend and frontend models must remain separate.

Backend conventions remain backend conventions.

Frontend conventions remain frontend conventions.

Examples:

- Backend models may use `snake_case`
- Frontend models should use `camelCase`

Translation occurs at the service boundary through explicit mapping.

Raw backend response shapes must not leak into component code.

---

## Comments

Comments should explain:

- Why code exists
- What invariant is being preserved
- Why a constraint matters

Comments must not narrate obvious behavior.

Good comments preserve architectural reasoning rather than repeating implementation details.

---

## Component Scope

Components must remain narrow in responsibility.

A component accumulating feature flags such as:

- `isSpecialMode`
- `alternateLayout`
- `useLegacyBehavior`

usually indicates a missed split.

Components should generally be divided rather than extended through branching configuration.

---

## Predictable Refactoring

Frontend architecture should optimize for safe, predictable change.

A feature should be modifiable without requiring broad knowledge of unrelated systems.

Strong ownership boundaries, explicit composition, stable interfaces, and localized concerns are the
primary mechanisms by which the codebase remains maintainable as it grows.
