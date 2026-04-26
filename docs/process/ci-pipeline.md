---
title: CI Pipeline
doc_type: process
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-04-26
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

The primary CI workflow. Runs on all pull requests targeting `main`. Calls `lint-markdown.yml`,
`doc-checks.yml`, and `pr-title.yml` as reusable workflows. Cancels in-progress runs for the same
branch when a new commit is pushed.

### `lint-markdown.yml`

Runs `markdownlint-cli2` against all Markdown files in the repository. Enforces structural rules
defined in `.markdownlint-cli2.yaml`, including heading hierarchy, block spacing, and line length.

Triggers on pull requests when Markdown files are changed, and when called from `ci.yml`.

### `pr-title.yml`

Validates that pull request titles follow the conventional commit format using
`action-semantic-pull-request`. Runs on every pull request event (opened, synchronized, reopened,
edited).

The PR title is used as the squash commit message on merge. Format requirements are defined in
[Pull Request Format](../agents/pr-format.md).

### `doc-checks.yml`

A reusable workflow that performs documentation-specific validation. Contains five jobs.

#### validate-doc-structure

Scans all Markdown files under `docs/`. For each file, validates that:

- The file is not empty.
- The file begins with a YAML frontmatter delimiter (`---`).
- A closing frontmatter delimiter appears within the first 20 lines.
- All required metadata fields are present: `title`, `doc_type`, `status`, `owners`,
  `last_reviewed`, `tags`.
- `doc_type` is one of the approved values and matches the subfolder the file lives in.
- `status` is one of the approved values.
- `owners` contains at least one GitHub handle (`@handle` format).
- `last_reviewed` is a valid date in `YYYY-MM-DD` format.
- `tags` contains only values from the approved vocabulary and no more than six tags.
- `title` matches the document's H1 heading exactly.
- For ADR files: the `related` field references only other ADRs (`docs/adrs/` paths).

#### validate-adr-sequence

Checks that ADR files in `docs/adrs/` follow a strictly increasing numeric sequence. Files must be
named `XXXX-*.md` where `XXXX` is a zero-padded number. Gaps are not permitted.

#### validate-required-docs

Checks that all required documentation files exist at their expected paths. Fails if any required
file is missing.

#### vale

Runs Vale prose linting against all files under `docs/` to enforce tone, word choice, and style
rules defined in `.vale.ini`.

#### link-check

Validates that all hyperlinks in `docs/` and `README.md` resolve correctly.

---

## Running Checks Locally

These commands can be run locally for early feedback. CI is the enforcement gate — local execution
is optional.

```bash
npm run lint:md    # markdownlint-cli2 — same config as CI
npm run format:md  # Prettier — formats all Markdown files
vale docs/         # Vale prose linter — same config as CI
```

---

## What Must Pass Before Merge

All required status checks must pass before a pull request can be merged. Checks are enforced
through branch protection rules on `main`.

For the full list of merge requirements, see [Definition of Done](./done-criteria.md).
