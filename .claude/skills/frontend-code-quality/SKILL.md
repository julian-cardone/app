---
name: frontend-code-quality
description:
  Apply this repository's frontend code-quality rules when writing or reviewing TypeScript,
  comments, guard clauses, null/undefined usage, assertions, `any`, constants, literal values, `as
  const`, enums, magic numbers, or floating strings.
---

# Frontend Code Quality

## Null vs Undefined

Use `null` and `undefined` intentionally; they represent different concepts.

- Use `null` when the application is explicitly modeling the absence of a domain value.
- Use `undefined` when a value is optional, omitted, or not provided.
- Prefer one representation for absence within a given API or domain model.

Examples:

```ts
const [selectedGender, setSelectedGender] = useState<GenderIdentity | null>(null);

const currentUser: User | null = null;
```

```ts
type TextFieldProps = { error?: string; placeholder?: string };

const error = isValid ? undefined : "Invalid value";
```

Avoid mixing both forms unnecessarily:

```ts
string | null | undefined;
```

Unless required by an external API, choose the representation that best matches the meaning of the
data.

Mental model:

```text
null = intentional absence undefined = omitted value
```

---

## Control Flow

Prefer guard clauses for invalid, blocked, or no-op states. Keep the successful path shallow and
easy to scan.

Good:

```tsx
const handleSubmit = () => {
  if (!canSubmit) return;
  submit();
};
```

Avoid nesting the main path under conditionals when an early return expresses the same intent more
clearly.

---

## Comments

Comments explain intent, ownership, or constraints. Keep them short enough to survive refactors.
Prefer explaining why code exists over narrating what the next line mechanically does.

Good comments preserve reasoning:

- why onboarding uses `replace` or `reset`
- why a hidden input drives verification boxes
- why a form is inert until backend work exists
- why a native driver is safe for opacity/transform

Avoid comments that:

- Narrate obvious implementation.
- Promise behavior that the code does not yet enforce.
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
if (!tab) return null;
```

This is reasonable when `route.name` comes from a navigator whose screens are registered from known
route constants, but the library exposes it as `string`.

Avoid assertions for uncertain data:

```tsx
const user = response as User;
```

External data must be validated, mapped, or parsed at the service boundary instead.

Avoid `any`. Use `unknown` at unsafe boundaries, then narrow before use.

---

## Literal Constants, `as const`, and Enums

Use `as const` for centralized literal values whose values are fixed and should be treated as exact
literals:

- routes and tab names
- storage keys
- environment names
- feature flags
- screen inset modes
- stable UI modes

Good:

```ts
export const MAIN_TAB_ROUTES = {
  DISCOVER: "Discover",
  MESSAGES: "Messages",
  POST_PLAN: "PostPlan",
} as const;

type MainTabName = (typeof MAIN_TAB_ROUTES)[keyof typeof MAIN_TAB_ROUTES];
```

Derive types from the source of truth when it is clearer than manually repeating a union.

Use enums sparingly for true domain states. Avoid enums for route names, tab names, storage keys,
and UI literal values.

---

## Meaningful Literals

Avoid magic numbers and floating strings in implementation code.

A literal should be named when it is:

- Repeated
- Domain-specific
- Route/navigation-specific
- Event/analytics-specific
- API/service-specific
- Used to control behavior
- Not immediately obvious from local context

Prefer:

- Local constants
- Typed config objects
- Domain-specific maps
- Design tokens for visual values

Good:

```tsx
const TAB_CONFIG: Record<MainTabName, TabConfigItem> = {
  [MAIN_TAB_ROUTES.MESSAGES]: { label: "Messages", icon: "message-circle", isFab: false },
  [MAIN_TAB_ROUTES.POST_PLAN]: { label: "Post a plan", icon: "plus", isFab: true },
};
```

Avoid:

```tsx
if (route.name === "PostPlan") {
  // ...
}
```

Prefer:

```tsx
if (tab.isFab) {
  // ...
}
```

Inline literals are acceptable only when they are obvious, local, non-reused, and not domain
significant. Do not extract constants so aggressively that the constant name is less clear than the
value.

---

## Common Mistakes to Avoid

- Comments that explain obvious behavior instead of constraints or intent.
- Deeply nested control flow where a guard clause would make the main path clearer.
- `as` used to silence uncertain external data instead of validating or mapping it.
- `any` used where `unknown`, a generic, or a narrow domain type would preserve safety.
- Using an enum for route names, tab names, or other UI literal values instead of an `as const`
  object.
