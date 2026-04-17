---
title: CI Pipeline
doc_type: process
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-04-15
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

The primary CI workflow. Runs on all pull requests targeting `main` and on direct pushes to `main`.
Calls `doc-checks.yml` as a reusable workflow.

### `lint-markdown.yml`

Runs `markdownlint-cli2` against all Markdown files in the repository. Enforces structural rules
defined in `.markdownlint-cli2.yaml`, including heading hierarchy, block spacing, and line length.

Triggers on pull requests and pushes to `main` when Markdown files are changed.

### `doc-checks.yml`

A reusable workflow that performs documentation-specific validation. Contains three jobs.

#### validate-doc-structure

Scans all Markdown files under `docs/`.

For each file, validates that:

- The file is not empty.
- The file begins with a YAML frontmatter delimiter (`---`).
- A closing frontmatter delimiter appears within the first 20 lines.
- The following required metadata fields are present: `title`, `doc_type`, `status`, `owners`,
  `tags`.

#### validate-adr-sequence

Checks that ADR files in `docs/adrs/` follow a strictly increasing numeric sequence. Files must be
named `XXXX-*.md` where `XXXX` is a zero-padded number. Gaps are not permitted.

#### validate-standard-doc-names

Checks that key documentation files exist at their expected paths. Fails if any required file is
missing.

---

## Running Checks Locally

Before opening a pull request, run the following commands:

```bash
npm run lint:md    # markdownlint-cli2 — same config as CI
npm run format:md  # Prettier — formats all Markdown files
```

---

## What Must Pass Before Merge

All required status checks must pass before a pull request can be merged. Checks are enforced
through branch protection rules on `main`.

For the full list of merge requirements, see [Definition of Done](./done-criteria.md).
