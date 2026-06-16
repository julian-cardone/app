---
title: Technology Stack
doc_type: technology
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-06-16
related:
  [
    "docs/adrs/0003-ai-assisted-development.md",
    "docs/adrs/0004-repository-tooling-stack.md",
    "docs/adrs/0005-frontend-technologies.md",
    "docs/process/ci-pipeline.md",
    "docs/agents/capabilities.md",
  ]
tags: [tooling, ai-agent, ci-cd, mobile, react-native, frontend, typescript]
---

# Technology Stack

This document defines the approved tooling stack for this repository. It covers the purpose of each
tool and the rationale for its inclusion. It is the authoritative reference for what tools are in
use and why.

For the architectural decisions that led to this stack, see
[ADR-0004: Repository Tooling Stack](../adrs/0004-repository-tooling-stack.md). For how these tools
are configured in CI, see [CI Pipeline](../process/ci-pipeline.md). For how agents interact with
these tools, see [Agent Capabilities](../agents/capabilities.md).

---

## AI-Assisted Development

### Claude Code

Claude Code is the primary AI agent for this repository. It is used for agentic development tasks
including multi-file edits, documentation drafting, and codebase reasoning. It operates via the
terminal and as a VS Code extension.

Claude Code reads `CLAUDE.md` at the repository root as its primary instruction file. All agent
behavior is governed by the constraints and capabilities defined in `docs/agents/`. Use
`.claudeignore` to exclude files and directories from Claude's view of the repository.

### GitHub Copilot

GitHub Copilot provides inline code completions and chat assistance within VS Code. The Autofixes
feature applies suggested corrections directly in the editor. Copilot Code Review provides automated
pull request feedback in CI. Copilot reads `.github/copilot-instructions.md` for repository-specific
instructions.

### Codebase Q&A

Copilot `@workspace` is the approved tool for repository queries — asking questions about code,
documentation, or architecture without initiating an agentic task. `@workspace` provides RAG-based
retrieval across the codebase at significantly lower token cost than an agentic Claude Code session.
Use `@workspace` when the goal is understanding, not making changes.

---

## Mobile Application

### React Native

React Native is the UI framework for the Placecard mobile app. It renders to native iOS and Android
components using React's component model. React JS knowledge — components, hooks, props, and state —
transfers directly; the learning surface is limited to React Native's rendering primitives and
layout model.

The decision to use React Native is documented in
[ADR-0005: Frontend Framework, Dev Toolchain, and Navigation](../adrs/0005-frontend-technologies.md).

### Expo

Expo is the development toolchain for the current phase (managed workflow). Expo Go — a companion
app installed on a physical device — serves as the primary live preview environment, enabling
instant hot-reload via QR code with no Xcode or Android Studio required.

Expo ecosystem packages in use:

- **expo-font** — loads custom fonts at app startup.
- **expo-splash-screen** — controls the native splash screen during bootstrap.
- **expo-linear-gradient** — gradient backgrounds used in onboarding screens.
- **@expo/vector-icons** — wraps icon sets (Ionicons, FontAwesome, etc.) as React Native components.
- **@expo-google-fonts/nunito** — the Nunito font family, the app's primary typeface.

Babel is configured via `babel-preset-expo` with the `module-resolver` plugin, which provides the
`@/` path alias rooted at `src/`.

When App Store and Play Store distribution is needed, the path forward is Expo's EAS Build service
or ejecting to a bare React Native workflow. That decision is deferred to a future ADR.

### React Navigation

React Navigation is the navigation library. It manages the five-tab bottom navigation (Discover,
Explore, Add a Plan, Messages, Profile), stack navigators for screen-level transitions, and modal
presentation.

Packages in use: `@react-navigation/native` (core), `@react-navigation/native-stack` (stack
navigator), `@react-navigation/bottom-tabs` (tab bar). Peer dependencies `react-native-screens` and
`react-native-gesture-handler` are installed alongside.

---

## Language

### TypeScript

TypeScript is the language for all mobile application source code. Strict mode is enabled. Path
alias `@/*` maps to `src/*`, consistent with the Babel module-resolver configuration.

---

## Code Quality

### ESLint

ESLint is the linter for all JavaScript and TypeScript source files in `app/`. The configuration
uses the flat config format (`eslint.config.mjs`) with the following plugins:

- **typescript-eslint** — TypeScript-aware lint rules, including enforced type-only imports
  (`@typescript-eslint/consistent-type-imports`).
- **eslint-plugin-react** and **eslint-plugin-react-hooks** — React and hooks best-practice rules.
- **eslint-plugin-simple-import-sort** — enforces a consistent, grouped import order across all
  files.

ESLint runs locally via `npm run lint` and in CI.

---

## Version Control and Project Management

### GitHub

GitHub is the authoritative platform for version control, pull request review, and project
management. It is the single system of record for all repository changes and project state.

The decision to use GitHub for project management is documented in
[ADR-0002: GitHub for Project Management](../adrs/0002-github-for-project-management.md).

### Dependabot

Dependabot provides automated dependency management. It opens pull requests to update dependencies
when new versions are available. No manual configuration is required beyond the repository-level
Dependabot settings.

---

## CI and Automation

### GitHub Actions

GitHub Actions is the CI and automation platform for this repository. It orchestrates all automated
validation, linting, and enforcement jobs. CI is the authoritative enforcement gate for all
repository standards — local tooling execution is the contributor's responsibility, but CI is the
final authority.

Workflow definitions live in `.github/workflows/`. For details on what each job does and when it
runs, see [CI Pipeline](../process/ci-pipeline.md).

---

## Formatting

### Prettier

Prettier is the general-purpose formatter for this repository. It handles automatic formatting of
the following file types:

- Markdown.
- TypeScript and TSX (mobile application source files).
- JavaScript and JSX.
- JSON.

Prettier is configured to run on save in VS Code via `.vscode/settings.json`. Configuration lives in
`.prettierrc.json`. Files excluded from formatting are listed in `.prettierignore`. In `app/`,
formatting runs via `npm run format`.

---

## Documentation Validation

### markdownlint-cli2

`markdownlint-cli2` validates Markdown structure across all `.md` files. It enforces heading
hierarchy, block spacing, and other structural rules. Configuration lives in
`.markdownlint-cli2.yaml`.

### Vale

Vale is configured as a prose quality enforcement tool. The base configuration in `.vale.ini` skips
YAML frontmatter blocks. Vale requires style packages before it will enforce prose rules — style
setup is project-specific. No styles are currently active. Vale enforcement is inactive.

### markdown-link-check

`markdown-link-check` validates that all hyperlinks in Markdown files resolve correctly. It runs in
CI on changes to `docs/` and `README.md`, and will fail a pull request if any link is broken. This
is the primary guard against documentation link rot.

---

## Adding or Replacing Tools

Tool additions or replacements that change the scope of the approved stack require an update to this
document and a corresponding PR. If the change represents a significant architectural shift, a new
ADR should be considered. Individual configuration changes do not require an update to this
document.
