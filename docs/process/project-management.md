---
title: Project Management
doc_type: process
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-04-25
tags: [workflow, governance, process]
---

# Project Management

This document defines how work is initiated, categorized, and completed within the repository.

All work must originate from a GitHub issue.

## Issues Are Required

An issue must exist before:

- Creating a branch.
- Opening a pull request.
- Drafting an Architecture Decision Record.
- Making non-trivial documentation changes.

Each issue represents a single unit of work.

Each issue must map to a single primary branch.

Issues serve as the canonical record of intent.

## Required Labels

Each issue must include:

- Exactly one `type:*` label.
- At least one `scope:*` label.

### Type

Describes the nature of the work.

Examples:

- `type:doc`
- `type:design`
- `type:adr`
- `type:chore`
- `type:tech-debt`

### Scope

Describes the area impacted.

Examples:

- `scope:docs`
- `scope:infra`
- `scope:process`
- `scope:system-design`

Labels must not be omitted.

## Project Board States

Work progresses through the following states:

1. **Backlog** – Identified but not started.
2. **Ready** – Ready to be worked on.
3. **In Progress** – Actively being worked on.
4. **Blocked** – Work cannot proceed due to an external dependency.
5. **Review** – A pull request has been opened and is awaiting approval and merge.
6. **Done** – Merged into `main`.

State transitions must reflect reality.

An issue must not be moved to **Done** until its corresponding pull request is merged.

## Quick Start

Use `/start <description>` to automate steps 1–4 of the workflow below. The skill creates the
issue, confirms labels, creates the branch, and moves the issue to **In Progress**.

## Workflow

The standard workflow is:

1. Create issue.
2. Apply required labels.
3. Add issue to the project workboard.
4. Create branch linked to issue.
5. Open pull request.
6. Review and merge.
7. The issue is automatically closed when the pull request is merged.

Branch naming, pull request requirements, and merge strategy are defined separately.

## Closure Rules

Issues must be closed through pull request merge using GitHub’s automatic closing mechanism.

Issues must not be manually closed unless the work is explicitly abandoned.

Manual closure must include justification in a comment.
