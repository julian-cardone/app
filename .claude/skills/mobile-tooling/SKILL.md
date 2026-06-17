---
name: mobile-tooling
description:
  Apply this repository's Expo and React Native tooling conventions when working with app config,
  build-time environment, Node versions, dependency updates, TypeScript/Babel aliases, ESLint file
  environments, package scripts, or root config files.
---

# Mobile Tooling

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

## Common Mistakes to Avoid

- Importing from `src/` inside `app.config.ts`.
- Using non-LTS Node for Expo/React Native development.
- Auto-merging Dependabot updates or treating major dependency updates as routine patches.
