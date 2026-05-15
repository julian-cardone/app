---
name: frontend-philosophy
description:
  Apply this repository's frontend architecture principles when designing, writing, or reviewing
  React components. Use whenever a component is being created or refactored, when deciding where
  state should live, when extracting a feature component from a page, when introducing an
  abstraction, when naming a new component, when deciding between context and prop passing, when
  writing a useEffect, when defining props or public interfaces, or when reviewing a PR for
  architectural issues. Trigger on casual phrasings too — "should this be a hook or a component",
  "where does this state go", "is this the right place for this logic", "this component is getting
  big", "should I make this generic". Do not rely on general React intuition for this codebase; the
  rules here are specific about component layers (shared primitives vs. feature components), state
  ownership, the three-condition test for introducing abstractions, banned name patterns (`Manager`,
  `Handler`, `Wrapper`, `DataTable`), how effects are used, and the separation between backend and
  frontend models. Applies to React on both web and mobile.
---

# Frontend Philosophy

These are the architectural principles for React code in this repository. They apply whenever
designing, writing, or reviewing components, hooks, and feature code.

The full prose version lives at `docs/standards/frontend-philosophy.md` in the repository. This
skill is the operational summary — consult the source doc for extended rationale.

The architecture must remain minimal, durable, predictable, and scalable. Favor explicit structure,
narrow ownership, and predictable refactoring over generic abstraction systems.

This skill covers component architecture and ownership. For styling rules, see the CSS skill for
your platform. For flex layout and overflow, see the layout skill for your platform. For folder
layout, see the project structure skill.

---

## Guiding Principles

Frontend systems must remain understandable as the application grows. A future engineer or AI agent
must be able to:

- Locate ownership quickly
- Modify behavior confidently
- Refactor features predictably
- Introduce new functionality without fragile coupling

The architecture favors:

- Explicit structure over hidden abstraction
- Composition over inheritance-like systems
- Narrow ownership boundaries
- Local reasoning
- Predictable data flow
- Stable public interfaces

Complexity is introduced deliberately. Abstraction exists to reduce complexity, not to centralize
it.

---

## Ownership

Every concern has a clear owner. Ambiguous ownership produces duplicated logic, diverging state, and
fragile behavior.

A concern belongs to the lowest layer capable of managing it correctly. Each layer's ownership rules
are defined in the document responsible for that layer — spatial and layout concerns in
`web-layout`, folder and module boundaries in `project-structure`, styling concerns in `web-css`.

---

## Component Layers

Components fall into two categories. Preserve the boundary.

### Shared UI Primitives

Reusable, domain-agnostic building blocks. They own:

- Structure
- Visual states
- Variants
- Accessibility behavior

They must not own:

- Workflow logic
- Backend integration
- Domain models
- Feature-specific behavior

Spatial concerns — scroll boundaries, viewport assumptions, overflow behavior, and external sizing —
are a separate category. Those rules live in the layout skill for your platform, not here.

Narrowly scoped, broadly reusable.

### Feature Components

Live in `features/<feature>/components/`. They compose shared primitives into domain workflows.
Examples: `EventCoverPicker`, `RsvpButton`, `EventCard`.

Feature components may:

- Reference domain models
- Own workflow state
- Manage loading and error states
- Coordinate multiple primitives
- Own feature-specific interactions

Names describe domain responsibility.

---

## Pages

Pages are route-level composition shells. They own:

1. Route-level layout
2. Feature composition
3. Page-level state
4. Routing concerns

Workflow logic and section-level rendering belong in feature components, not pages.

A block of JSX in a page must be extracted into a feature component when it:

- Owns state
- Manages a workflow
- Represents a distinct visual section

Pages stay composition-oriented, not content-heavy.

```tsx
/* Wrong — page renders content and owns state directly. */
export default function EventPage() {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  return (
    <div className={styles.page}>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <button onClick={() => setRsvpOpen(true)}>RSVP</button>
    </div>
  );
}

/* Right — page composes feature components. */
export default function EventPage() {
  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <EventDetails />
        <EventActions />
      </div>
    </div>
  );
}
```

The page defines the surface and layout container. State, workflow, and rendering belong in the
feature components.

---

## State Ownership

State lives at the lowest component that reasonably owns it.

- Form values belong to the form.
- Selection state belongs to the section managing selection.
- Modal state belongs to the component opening the modal.
- Route-level data belongs to the page.

**State must not be duplicated.** Derived values are computed from source state, not copied into
independent state variables. If a hook owns data, consuming components derive from that hook rather
than shadowing the same state locally.

Independent state is justified only when ownership genuinely differs.

---

## Context

Context exists for cross-cutting concerns: authentication, theme, current user, application-wide
preferences.

Context is not a substitute for ordinary composition or short-distance prop passing. Lift state only
when ownership genuinely spans multiple branches of the tree.

---

## Effects

Effects are synchronization boundaries, not general-purpose lifecycle hooks.

If logic can be derived during render, it does not belong in an effect.

Effects synchronize React state with:

- Network requests
- Browser APIs
- Timers
- External systems

An effect that only derives local values from other local values is a signal of misplaced state or
unnecessary synchronization. Move the logic into render, or move the state to its proper owner.

```tsx
/* Wrong — derived value implemented as an effect */
const [fullName, setFullName] = useState("");
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

/* Right — derived during render */
const fullName = `${firstName} ${lastName}`;
```

---

## Controlled vs. Uncontrolled State

Reusable primitives prefer controlled APIs when external workflow state matters. Feature components
may use uncontrolled internal state for ephemeral UI concerns that do not affect external workflows.

Controlled ownership stays explicit.

---

## Props and Interfaces

Every component declares typed props. Implicit `any` is disallowed.

```tsx
type ButtonProps = {
  variant: "primary" | "secondary";
  onClick: () => void;
  children: ReactNode;
};
```

Component interfaces stay narrow and explicit. A component accumulating many unrelated props or
feature flags usually indicates excessive responsibility.

Reusable components expose stable public interfaces rather than leaking implementation details.

---

## Public Interfaces

Components, services, and features expose stable public interfaces. Internal implementation details
stay private so modules can be refactored without breaking external consumers.

See the project structure skill for the public-surface and import rules that enforce this.

---

## Abstraction — The Three-Condition Test

Before introducing an abstraction, all three must be true:

1. The repeated structure is stable.
2. The abstraction is simpler than the duplication it replaces.
3. The abstraction makes future work easier.

If any condition fails, duplication is preferred.

**Appropriate abstractions:**

- Shared UI primitives
- Stable visual variants
- Pure mappers
- Reusable structural wrappers

**Inappropriate abstractions:**

- Universal `DataTable` systems
- Generic workflow engines
- Single abstractions covering unrelated behavior
- Generic `Manager` or `Handler` systems

**The rule of three:** two similar implementations are acceptable. Three is the threshold at which
shared structure should be evaluated — not automatically extracted, but evaluated against the three
conditions above.

---

## Naming

Names describe responsibility.

Generic names are reserved for shared primitives. Feature components use domain-specific names.

A name that describes a generic role rather than a domain concept typically indicates unclear
ownership or excessive responsibility. If a name could apply to multiple unrelated features, it is
too generic.

**Common examples to avoid:**

- `Manager`
- `Handler`
- `Wrapper`
- `DataTable`

When tempted to reach for one of these, rename the component after the domain concept it actually
represents, or split it into narrower components that can be named precisely.

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

A reset action clears both form state and any derived parent state — the form invokes a callback so
the parent can clear its own state in sync.

---

## Tables

Tables render rows and invoke callbacks. They do not fetch data or own workflow state.

Tables accept:

- Rows or items
- Selected identifiers
- Callbacks for row actions

The surrounding feature component owns loading, selection, modals, and workflow behavior.

---

## Backend and Frontend Separation

Backend and frontend models stay separate and serve distinct purposes.

**API types** live in `services/<x>/*.types.ts` — raw backend shapes, `snake_case`, used only within
the service layer.

**Domain models** live in `features/<feature>/models/` — the application-facing representation,
`camelCase`, consumed by components and hooks.

**Mappers** in `services/<x>/*.mappers.ts` translate between the two at the service boundary.

Raw backend shapes must not appear in component code. A `snake_case` field name inside a component
file is a signal of a missing or misplaced mapper.

---

## Comments

Comments explain:

- Why code exists
- What invariant is being preserved
- Why a constraint matters

Comments do not narrate obvious behavior. Good comments preserve architectural reasoning, not
implementation details.

---

## Component Scope

Components stay narrow in responsibility.

A component accumulating boolean flags like `isSpecialMode`, `alternateLayout`, or
`useLegacyBehavior` is a signal of a missed split. Divide the component rather than extending it
through branching configuration.

---

## Common Mistakes to Avoid

Recurring violations to watch for in review or when writing new code:

- A page rendering content directly instead of composing feature components.
- State duplicated across a hook and a `useState` in a consuming component.
- A `useEffect` that derives one local value from another instead of computing it in render.
- A shared primitive accumulating feature-specific props or domain knowledge.
- A new abstraction introduced on the second occurrence of a pattern (the threshold is three, and
  only after the three-condition test).
- A component named `XManager`, `XHandler`, `XWrapper`, or a generic `DataTable`.
- A boolean prop like `isSpecialMode` added instead of splitting the component.
- `snake_case` field names appearing in a component file (missing mapper at the service boundary).
- A form component navigating or making API calls itself instead of invoking parent callbacks.
- A table component fetching its own data or owning modal state.
- Context used for short-distance prop passing rather than genuinely cross-cutting state.
- Comments narrating what the code does instead of why it exists.

---

## Predictable Refactoring

The architecture optimizes for safe, predictable change. A feature must be modifiable without
requiring broad knowledge of unrelated systems.

Strong ownership boundaries, explicit composition, stable interfaces, and localized concerns are the
primary mechanisms by which the codebase remains maintainable as it grows.

---

## When to Consult the Related Standards

- For styling rules, units, variants, and class naming: the CSS skill for your platform (`web-css`,
  or the mobile equivalent when present).
- For flex layout, scroll ownership, and constraint chains: the layout skill for your platform
  (`web-layout`, or the mobile equivalent when present).
- For where files live, the boundary between `components/ui/` and `features/`, and the
  public-surface import rules: `project-structure`.
