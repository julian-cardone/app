# CLAUDE.md

This file is the primary instruction file for Claude Code. Read this file in full before taking any
action in this repository.

---

## What This Repository Is

This repository follows a documentation-first approach. Standards, processes, and tooling
conventions are defined in `docs/` and govern all development activity. All contributions — human or
AI-generated — must conform to these conventions.

---

## Required Reading

Read the following documents before starting any task:

1. `docs/agents/capabilities.md` — what you are permitted to do
2. `docs/agents/constraints.md` — what you are not permitted to do
3. `docs/agents/ownership.md` — who owns what and what that means for modifications
4. `docs/agents/pr-format.md` — how to structure pull requests
5. `docs/standards/documentation.md` — how all documents must be written and structured
6. `docs/process/doc-governance.md` — when to create, update, or delete documents
7. `docs/process/git-workflow.md` — branching, PR, and commit rules
8. `docs/process/ci-pipeline.md` — what CI enforces and what must pass before merging
9. `docs/process/done-criteria.md` — what constitutes a completed task
10. `docs/technologies/stack.md` — what tools are in use and why

For architectural context, read `docs/adrs/` in numerical order.

---

## Protected Paths

The following must not be modified without explicit human instruction:

- `docs/standards/` — documentation and coding standards
- `docs/agents/` — agent capabilities and constraints
- `docs/adrs/` — architectural decision records
- `.github/` — CI workflows, branch protection, and GitHub configuration
- `.github/CODEOWNERS` — review routing and ownership rules
- `.vale.ini` and `.vale/styles/` — prose linting rules and style definitions
- `.markdownlint-cli2.yaml` — Markdown structure linting rules
- `.prettierrc.json` — formatting rules
- `CLAUDE.md` — this file

If a task requires changes to any of the above, stop and request clarification before proceeding.
