---
title: Onboarding
doc_type: onboarding
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-04-20
related:
  ["docs/standards/documentation.md", "docs/process/git-workflow.md", "docs/technologies/stack.md"]
tags: [onboarding, process]
---

# Onboarding

This document orients new contributors to the repository. Read it before making any changes.

---

## Start Here

1. Read the root `README.md` for a project overview.
2. Read this document in full.
3. Read the required documents listed in `CLAUDE.md`.

---

## Repository Structure

| Directory            | Purpose                                                   |
| -------------------- | --------------------------------------------------------- |
| `docs/adrs/`         | Architectural decisions — why things are the way they are |
| `docs/architecture/` | Current system structure — what exists                    |
| `docs/standards/`    | Rules all contributors must follow                        |
| `docs/process/`      | Workflows and operational procedures                      |
| `docs/agents/`       | AI agent capabilities and constraints                     |
| `docs/technologies/` | Tools in use and why                                      |
| `docs/onboarding/`   | This directory                                            |

---

## Required Reading

Before contributing, read the following documents in order:

1. `docs/agents/capabilities.md` — what AI agents can do
2. `docs/agents/constraints.md` — what AI agents must not do
3. `docs/standards/documentation.md` — how all documents must be written
4. `docs/process/git-workflow.md` — branching and PR conventions
5. `docs/process/done-criteria.md` — what a completed task looks like
6. `docs/technologies/stack.md` — what tools are in use

---

## Local Tooling Setup

Check [package.json](../../package.json) under "engines" for the minimum required Node.js version.

```bash
npm install
npm run lint:md    # markdownlint — optional; CI enforces this on every PR
npm run format:md  # Prettier — formats all Markdown files
```

---

## Workflow Summary

1. Find or create a GitHub issue for the work.
2. Apply required labels (`type:*` and `scope:*`).
3. Create a branch: `issue-<id>-<slug>`.
4. Make changes and commit.
5. Open a pull request referencing the issue.
6. Ensure all CI checks pass.
7. Request human review.
8. The issue closes automatically when the PR is merged.
