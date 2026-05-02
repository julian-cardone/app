---
title: CI Pipeline
doc_type: process
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-05-01
related:
  [
    "docs/technologies/stack.md",
    "docs/standards/documentation.md",
    "docs/process/git-workflow.md",
    "docs/process/done-criteria.md",
  ]
tags: [ci-cd, workflow, tooling, governance]
---

# CI Pipeline

This document describes the automated CI pipeline for this repository. It defines what each workflow
checks, when it runs, and what must pass before a pull request can be merged.

CI is the authoritative enforcement gate for repository standards. Local tooling execution is the
contributor's responsibility, but CI is the final authority.

---

## Workflows

### `ci.yml`

The primary CI workflow. Runs on all pull requests targeting `main`. Skips all checks for Dependabot
PRs via a `guard` job that gates the remaining jobs on `github.actor != 'dependabot[bot]'`. Calls
`markdown-checks.yml`, `validate-docs.yml`, and `pr-title.yml` as reusable workflows. Cancels
in-progress runs for the same branch when a new commit is pushed.

### `markdown-checks.yml`

A reusable workflow scoped to all Markdown files in the repository. Contains two jobs.

#### markdownlint

Runs `markdownlint-cli2` against all Markdown files. Enforces structural rules defined in
`.markdownlint-cli2.yaml`, including heading hierarchy, block spacing, and line length.

#### link-check

Validates that all hyperlinks in Markdown files across the repository resolve correctly.

### `pr-title.yml`

Validates that pull request titles follow the conventional commit format using
`action-semantic-pull-request`. Runs on every pull request event (opened, synchronized, reopened,
edited).

The PR title is used as the squash commit message on merge. Format requirements are defined in
[Pull Request Format](./pr-format.md).

### `validate-docs.yml`

A reusable workflow scoped to documentation files under `docs/`. Contains two jobs.

#### validate-doc-frontmatter

Validates frontmatter schema and content for all documents using a real YAML parser
(`scripts/validate-docs-frontmatter.mjs`). For each file, validates that:

- All required metadata fields are present: `title`, `doc_type`, `status`, `owners`,
  `last_reviewed`, `related`, `tags`.
- `doc_type` is one of the approved values and matches the subfolder the file lives in.
- `status` is one of the approved values.
- `owners` contains at least one GitHub handle (`@handle` format).
- `last_reviewed` is a valid date in `YYYY-MM-DD` format.
- `title` matches the document's H1 heading exactly.

#### vale

Runs Vale prose linting against all files under `docs/` to enforce tone, word choice, and style
rules defined in `.vale.ini`.

---

## Running Checks Locally

These commands can be run locally for early feedback. CI is the enforcement gate — local execution
is optional.

```bash
npm run format:md  # Prettier — formats all Markdown files
npm run lint:md    # markdownlint-cli2 — same config as CI
vale docs/         # Vale prose linter — same config as CI
```

---

## What Must Pass Before Merge

All required status checks must pass before a pull request can be merged. Checks are enforced
through branch protection rules on `main`.

For the full list of merge requirements, see [Definition of Done](./done-criteria.md).
