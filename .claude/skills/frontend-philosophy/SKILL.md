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
structure, CSS/StyleSheet rules, flex layout, scrolling, or safe areas. Use the platform-specific
skills for those details.

---

## Core Principles

A future engineer or coding agent must be able to answer quickly:

- What owns this concern?
- Where does state live?
- Which interface is public?
- Is this feature-specific or domain-agnostic?
- Can this be refactored without touching unrelated features?

Optimize for clear ownership and predictable refactoring, not maximum reuse.

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

Examples: `Button`, `AppText`, `Screen`, generic form fields, brand-only components when placed in a
branding boundary.

### Feature Components

Feature components live inside `features/<feature>/components/`. They compose primitives into a
product workflow and may own:

- Domain-specific rendering
- Feature-specific interactions
- Local workflow state
- Loading/error states for that feature
- Composition of multiple primitives

A component used by one feature stays feature-local until reuse is proven.

### Pages and Screens

Pages on web and screens on mobile are route-level composition shells. They own:

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

## Shared Text Primitive

Use a shared app text primitive when the project has custom fonts or typography tokens.

The text primitive should stay small:

```tsx
type AppTextProps = TextProps & {
  variant?: "body" | "headline" | "caption";
};
```

Avoid creating a prop matrix such as `size`, `weight`, `tone`, `italic`, `muted`, `centered`, and
`specialMode` before those variants are proven. Typography consistency is the goal; a generic text
configuration system is not.

Branding text, such as a wordmark, may live in a branding component and use the same typography
tokens or text primitive internally.

---

## Abstraction Rules

Before introducing an abstraction, all three must be true:

1. The repeated structure is stable.
2. The abstraction is simpler than the duplication it replaces.
3. The abstraction makes future work easier.

The rule of three applies: two similar implementations are acceptable. At the third occurrence,
evaluate the pattern against the three-condition test. Do not automatically extract.

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

## Comments

Comments explain intent, ownership, or constraints. Keep them short enough to survive refactors.

Good comments preserve reasoning:

- why a splash uses `replace`
- why a hidden input drives verification boxes
- why a form is inert until backend work exists
- why a native driver is safe for opacity/transform

Avoid comments that:

- Narrate obvious implementation.
- Preserve prototype history.
- Explain details that are already clear from names and structure.
- Require frequent updates when nearby code changes.

Prefer concise component comments:

```tsx
/**
 * Custom bottom tab bar for the signed-in app.
 */
```

Do not use long comments to compensate for unclear code. Rename, extract, or simplify first.

---

## TypeScript Assertions

Prefer type-safe code without `as` or `any`.

Use `satisfies`, narrow explicit prop types, discriminated unions, small helper types, and clear
domain models before reaching for assertions.

Accept a localized `as` only when all of these are true:

1. The input is already strictly controlled by nearby code or a typed framework boundary.
2. The assertion corrects a type that is broader than the real domain.
3. The assertion is smaller and clearer than complex type machinery.
4. The assertion does not hide unvalidated external data.

Acceptable example:

```tsx
const tab = TAB_CONFIG[route.name as MainTabName];
```

This is reasonable when `route.name` comes from a navigator whose screens are registered from
`MainTabParamList`, but the library exposes it as `string`.

Avoid assertions for uncertain data:

```tsx
const user = response as User;
```

External data must be validated, mapped, or parsed at the service boundary instead.

Avoid `any`. Use `unknown` at unsafe boundaries, then narrow before use.

---

## Common Mistakes to Avoid

- A screen/page rendering large content blocks instead of composing feature components.
- State duplicated between a hook and local component state.
- A `useEffect` that only derives local values.
- A shared primitive containing feature-specific text, workflow, or domain assumptions.
- A fake prop such as `variant?: "primary"` before a second variant exists.
- A component promoted to shared after one use.
- A component accumulating boolean flags instead of being split.
- A form navigating or calling APIs directly when those consequences belong to the parent.
- Context used for short-distance prop passing.
- Comments that explain obvious behavior instead of constraints or intent.
- `as` used to silence uncertain external data instead of validating or mapping it.
- `any` used where `unknown`, a generic, or a narrow domain type would preserve safety.
