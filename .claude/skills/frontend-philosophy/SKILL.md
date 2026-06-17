---
name: frontend-philosophy
description:
  Apply this repository's frontend architecture principles when designing, writing, or reviewing
  React or React Native components, hooks, screens/pages, feature code, props, state ownership,
  effects, abstractions, or public interfaces. Trigger on questions like "where does this logic go",
  "should this be shared", "should this be a hook", "is this component too big", "should I make this
  generic", or when reviewing PRs for ownership and coupling. Platform-specific folder, styling, and
  layout rules live in the relevant project-structure, styles, and layout skills.
---

# Frontend Philosophy

Frontend code must stay minimal, explicit, predictable, and scalable. Favor narrow ownership,
composition, and local reasoning over generic abstraction systems.

This skill owns architecture and component responsibility. It does not own platform-specific folder
structure, StyleSheet rules, flex layout, scrolling, or safe areas. Use the platform-specific skills
for those details.

---

## Core Principles

A future engineer or coding agent must be able to answer quickly:

- What owns this concern?
- Where does state live?
- Which interface is public?
- Is this feature-specific or domain-agnostic?
- Can this be refactored without touching unrelated features?

Optimize for clear ownership and predictable refactoring, not maximum reuse.

Optimize for long-term maintainability over short-term convenience.

A small amount of duplication is acceptable when ownership is still emerging, but known sources of
tech debt should be reduced once a stable pattern is identified. The codebase should become simpler
over time, not more complex.

When evaluating a design, prefer the option that is easier to understand, maintain, test, and
refactor in the future.

---

## Code Stewardship and Refactoring

Refactoring in the name of reducing tech debt is allowed and expected when it improves ownership,
removes duplication, or replaces an inconsistent pattern with a clearer one. Do not layer new code
on top of a pattern that is already proving brittle if a small, scoped refactor would leave the
codebase healthier.

Refactors should be scoped and behavior-preserving unless the task explicitly asks for behavior
change. Prefer improving the boundary you are already touching over broad rewrites. When a repeated
concern becomes a shared primitive, token, pure helper, or domain config, migrate the nearby call
sites so the old duplicate pattern does not remain as a parallel standard.

Good refactors create a single obvious owner for a stable concern. Bad refactors spread the concern
across more files, add generic machinery, or make future changes require touching unrelated
features.

---

## Component Layers

### Shared UI Primitives

Shared primitives are reusable, domain-agnostic building blocks. They own:

- Internal structure
- Visual states
- Stable variants
- Basic accessibility behavior
- Small layout-internal details needed for their own shape

They must not own:

- Workflow logic
- Navigation/routing decisions
- Backend/API calls
- Domain models
- Feature-specific text or behavior
- Screen-level layout, scroll boundaries, or safe-area behavior

Examples: `Button`, `AppText`, `Screen`, generic form fields, and brand-only components when placed
in a branding boundary.

### Feature Components

Feature components live inside `features/<feature>/components/`. They compose primitives into a
product workflow and may own:

- Domain-specific rendering
- Feature-specific interactions
- Local workflow state
- Loading/error states for that feature
- Composition of multiple primitives

A component used by one feature stays feature-local until reuse is proven.

Domain-specific wrappers should compose shared primitives and add domain behavior rather than
reimplementing primitive styling or behavior. For example, a DOB field may add masking, and a phone
field may add phone-specific props and country-code layout, while the shared text/input primitives
continue to own typography, chrome, focus states, and errors.

### Pages and Screens

Screens are route-level composition shells. They own:

1. Route-level layout
2. Feature composition
3. Route/screen-level state
4. Routing or navigation consequences

They should not become content-heavy. Extract markup into feature components when a section owns
state, manages a workflow, or represents a distinct visual/product section.

---

## State Ownership

State lives at the lowest component that can own it correctly.

- Form values belong to the form or screen that submits them.
- Selection state belongs to the section managing selection.
- Modal state belongs to the component opening the modal.
- Route-level data belongs to the page/screen or a route-level hook.
- Shared application state belongs in a focused provider only when it genuinely spans branches.

Do not duplicate source state. Derived values are computed during render:

```tsx
const digitCount = phoneNumber.replace(/[^0-9]/g, "").length;
const canSend = digitCount >= MIN_DIGITS;
```

Do not copy derived values into separate `useState` variables.

---

## Context Access

Keep contexts private when they are intended for normal application consumption. Export a focused
custom hook next to the provider instead of exporting the raw context.

Good:

```tsx
const ProfileCompletionContext = createContext<ProfileCompletionValue | null>(null);

export function useProfileCompletion(): ProfileCompletionValue {
  const value = useContext(ProfileCompletionContext);
  if (!value) {
    throw new Error("useProfileCompletion must be used within a ProfileCompletionProvider");
  }
  return value;
}
```

Why:

- consumers avoid repeated null checks
- missing providers fail with useful errors
- implementation details stay behind the feature/provider boundary
- future provider internals can change without touching callers

Avoid exporting raw contexts unless there is a specific framework or testing need.

---

## Forms

Forms own:

- Field values
- Validation state
- Submission shape

Input components may normalize keystrokes when the shape is part of the field experience, such as
masking a date or stripping non-code digits. Business validation and submission rules still belong
to the form, screen, or parent workflow that owns the outcome.

Parents own:

- Submission consequences
- API calls
- Navigation
- Success workflows

For mobile auth/onboarding flows, a screen may hold a simple controlled value and pass it into a
feature input. When the form grows beyond a few fields or begins owning validation/workflow, extract
a feature form component.

---

## Effects

Effects synchronize React with external systems. They are not a place for ordinary derived logic.

Use effects for:

- Network requests
- Native/browser APIs
- Timers
- Subscriptions
- Imperative animation starts
- Synchronization with external state

Do not use effects to derive one local value from another.

Timers and subscriptions must clean up after themselves:

```tsx
useEffect(() => {
  const timer = setTimeout(run, delayMs);
  return () => clearTimeout(timer);
}, [delayMs]);
```

---

## Props and Public Interfaces

Every component declares typed props. Interfaces stay narrow and explicit.

Reusable components should expose:

- Stable behavior props
- Stable variants only after a second variant is real
- `style` for parent layout overrides when useful
- Targeted style props only when there is a proven need, such as `contentContainerStyle`

Do not expose deep internal styling hooks like `headerTitleTextWrapperInnerStyle`. That leaks the
component's internals and makes refactors fragile.

Use `style` mostly for parent-owned layout concerns such as margin, width, alignment, and local
placement. Component appearance should come from the component's own styles, tokens, and stable
variants.

---

## Abstraction Rules

Refactoring to reduce tech debt is encouraged when it improves ownership, consistency, simplicity,
or maintainability.

Examples:

- Centralizing repeated visual decisions into tokens
- Consolidating duplicated logic into a shared helper
- Moving repeated UI patterns into a shared primitive
- Simplifying component responsibilities
- Eliminating drift between multiple implementations of the same concept

Refactoring should reduce complexity, not relocate it.

Before introducing an abstraction, all three must be true:

1. The repeated structure is stable.
2. The abstraction is simpler than the duplication it replaces.
3. The abstraction makes future work easier.

The rule of three applies: two similar implementations are acceptable. At the third occurrence,
evaluate the pattern against the three-condition test. Do not automatically extract.

Do not preserve duplication for the sake of stability once a clear and stable ownership boundary has
emerged.

When a repeated pattern has proven stable and ownership is obvious, refactor toward a single source
of truth. Reducing tech debt through simplification, consolidation, and clearer ownership is
encouraged when it makes the codebase easier to maintain.

Examples include:

- Centralizing repeated visual decisions into design tokens
- Consolidating duplicated logic into shared helpers
- Composing feature inputs from shared field primitives
- Eliminating multiple implementations of the same behavior
- Moving stable cross-feature concerns behind a shared abstraction

Refactoring should reduce complexity, not relocate it.

Appropriate abstractions:

- Shared UI primitives
- Stable visual variants
- Pure mappers
- Reusable screen/layout wrappers
- Small focused hooks

Avoid:

- Generic workflow engines
- Universal table/list systems
- `Manager`, `Handler`, or `Wrapper` components
- Shared primitives created from a single feature use
- Boolean-flag components that should be split

---

## Naming

Names describe responsibility.

- Shared primitives may use generic names: `Button`, `AppText`, `Screen`.
- Feature components use domain names: `PhoneNumberInput`, `TermsFootnote`, `EventCoverPicker`.
- Avoid `Manager`, `Handler`, `Wrapper`, and generic `DataTable` names.

A component name that could apply to many unrelated features is usually too generic unless it is a
true shared primitive.

---

## Backend and Frontend Separation

Components do not consume raw backend shapes.

- API types live in `services/<x>/*.types.ts`.
- Domain models live in `features/<feature>/models/`.
- Mappers translate backend shapes into frontend models at the service boundary.

A `snake_case` field in component code usually means the mapper is missing or misplaced.

---

## Common Mistakes to Avoid

- A screen/page rendering large content blocks instead of composing feature components.
- State duplicated between a hook and local component state.
- A `useEffect` that only derives local values.
- A shared primitive containing feature-specific text, workflow, or domain assumptions.
- A component promoted to shared after one use.
- A component accumulating boolean flags instead of being split.
- A form navigating or calling APIs directly when those consequences belong to the parent.
- Context used for short-distance prop passing.
- Raw contexts exported for normal app consumption instead of focused provider hooks.
