---
title: Dependency Management
doc_type: process
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-06-09
related:
  [
    "docs/process/ci-pipeline.md",
    "docs/process/done-criteria.md",
    "docs/technologies/stack.md",
  ]
tags: [dependencies, dependabot, semver, expo, react-native]
---

# Dependency Management

Dependencies are updated through Dependabot and follow Semantic Versioning (SemVer).

---

## Update Policy

| Update Type              | Policy                                                                          |
| ------------------------ | ------------------------------------------------------------------------------- |
| Patch (`1.2.3 → 1.2.4`) | Merge after CI passes.                                                          |
| Minor (`1.2.3 → 1.3.0`) | Review release notes. Merge after CI passes and a smoke test.                  |
| Major (`1.2.3 → 2.0.0`) | Create a dedicated issue and branch. Review migration guidance. Never auto-merge. |

Dependabot batches patch and minor updates into a single weekly PR. Apply the minor policy to any
PR that contains at least one minor bump.

---

## Dependabot

Dependabot pull requests follow the same review process as any other change:

- CI must pass.
- Updates must be reviewed before merging.
- Major updates require a dedicated issue and implementation plan.
- Dependabot pull requests are never auto-merged.

---

## Expo and React Native

The following packages are treated as a compatibility group and must not be upgraded independently
without verifying compatibility:

```text
expo
react
react-native
expo-*
react-native-*
```

Use Expo-managed versions when updating these dependencies.

---

## Validation

All dependency updates must pass:

```bash
npm run typecheck
npm run lint
npm run format:check
```

Runtime dependency updates also require a manual smoke test before merging.
