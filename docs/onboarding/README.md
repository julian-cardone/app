---
title: Onboarding
doc_type: onboarding
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-06-02
related:
  [
    "docs/standards/documentation.md",
    "docs/process/git-workflow.md",
    "docs/process/project-management.md",
    "docs/technologies/stack.md",
  ]
tags: [onboarding, process]
---

# Onboarding

This document orients new contributors to the repository. Read it before making any changes.

---

## Start Here

1. Read the root `README.md` for a project overview.
2. Read this document in full.
3. Refer the required documents listed in `CLAUDE.md` as needed.

---

## Environment Setup

### 1. Install NVM

NVM (Node Version Manager) lets you switch Node versions per project.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

Then restart your terminal (or run `source ~/.zshrc` / `source ~/.bashrc`) so the `nvm`
command is available. Full install docs: <https://github.com/nvm-sh/nvm>.

### 2. Set Node 22

This repo requires **Node.js 22 LTS**. An `.nvmrc` file is checked in, so NVM picks the right
version automatically.

```bash
nvm install 22        # download Node 22 if not already present
nvm use 22            # activate it in this shell
nvm alias default 22  # make it the default for new shells
node -v               # should print v22.x.x
```

### 3. Install dependencies

The repo has two separate `package.json` files — one at the root (doc tooling) and one in
`app/` (the mobile app). Install both:

```bash
npm install        # root — markdownlint, prettier for docs
cd app
npm install        # Expo app and all mobile dependencies
```

### 4. IDE setup (VS Code)

Recommended extensions are listed in `.vscode/extensions.json`. To install them, open the
Extensions panel (`Cmd+Shift+X`), search `@recommended`, and click **Install All**.

`.vscode/settings.json` is checked in and pre-configures format-on-save and ESLint auto-fix.
No manual settings changes are needed.

---

## Running the App

The app uses Expo's managed workflow — no manual native project setup is required.

```bash
cd app
npm start         # start the Expo dev server
npm run ios       # launch iOS simulator
npm run android   # launch Android emulator
```

---

## Verify Your Setup

Before opening your first PR, confirm all three checks pass from `app/`:

```bash
npm run typecheck     # TypeScript — must report zero errors
npm run lint          # ESLint
npm run format:check  # Prettier
```

CI enforces all three on every PR, so catching failures locally saves time.

---

## Workflow

The end-to-end workflow is defined in [Project Management](../process/project-management.md). Branch
naming is defined in [Git Workflow](../process/git-workflow.md). Pull request structure is defined
in [Pull Request Format](../process/pr-format.md).
