---
title: Project Management
doc_type: process
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-05-15
related: ["docs/process/git-workflow.md", "docs/process/pr-format.md"]
tags: [workflow, governance, process]
---

# Project Management

This document defines how work is initiated, categorized, tracked, and completed within the
repository.

Issues are the canonical units of work. Pull requests are the reviewed implementation records for
those issues. The project board tracks issues, not pull requests.

## Issues Are Required

An issue must exist before:

- Creating a branch.
- Opening a pull request.
- Drafting an Architecture Decision Record.
- Making non-trivial documentation changes.
- Starting agentic work that changes repository contents.

Each issue represents a single unit of work.

Each issue must map to:

- One primary branch.
- One primary pull request.

Issues serve as the canonical record of intent, scope, acceptance criteria, and status.

Small typo fixes or trivial housekeeping may be grouped into an existing issue when appropriate, but
non-trivial work must not bypass the issue workflow.

## One-to-One Work Model

The default project model is:

```text
one issue → one branch → one pull request
```

This keeps project tracking simple and prevents duplicate state across issues, branches, pull
requests, and the project board.

If a planned issue becomes too large to review comfortably, split it into smaller issues before
implementation continues. Do not treat a single issue as an epic containing multiple pull requests
unless the workflow is explicitly revised.

## Required Labels

Each issue must include:

- Exactly one `type:*` label.
- At least one `scope:*` label.

### Type

Describes the nature of the work.

Examples:

- `type:doc` — writing or changing documentation
- `type:adr` — the work will produce an Architecture Decision Record
- `type:design` — systems design work before implementation
- `type:feature` — user-facing or system-facing functionality
- `type:bug` — defect correction
- `type:chore` — setup, tooling, housekeeping, configuration
- `type:refactor` — structure change without intended behavior change
- `type:tech-debt` — cleanup, simplification, or paydown

### Scope

Describes the area impacted.

Examples:

- `scope:docs` — documentation system itself
- `scope:frontend` — frontend application code
- `scope:backend` — backend application code
- `scope:infra` — CI, tooling, hosting, deployment, or cloud infrastructure
- `scope:process` — standards, workflow, governance
- `scope:architecture` — architecture and system boundaries
- `scope:ai` — AI agents, model integrations, prompts, tools, or automation

Labels must not be omitted.

## Project Board

The project board is an issue-level planning and status board.

Only issues should be added to the project board by default. Pull requests should not be added as
separate board items because they duplicate the issue they implement.

A pull request is linked from its issue and moves the issue through the review and completion
states.

## Project Board States

Work progresses through the following states:

1. **Backlog** – Identified but not yet scoped or prioritized.
2. **Ready** – Scoped, labeled, and ready to be worked on.
3. **In Progress** – A branch exists or active work has started.
4. **Blocked** – Work cannot proceed due to a decision, dependency, or external constraint.
5. **Review** – The pull request has been opened and is awaiting approval and merge.
6. **Done** – The pull request has been merged into `main` and the issue is closed.

State transitions must reflect reality.

An issue must not be moved to **Done** until its corresponding pull request is merged.

## Commands

### `/start`

Run `/start <description>` at the beginning of every unit of work before touching any files.

The command should automate project setup by:

1. Creating the issue.
2. Applying required labels.
3. Adding the issue to the project board.
4. Creating the branch from the issue.
5. Moving the issue to **In Progress**.

The command should not create a pull request until implementation work has been completed.

## Workflow

The standard workflow is:

1. Create an issue.
2. Apply required labels.
3. Add the issue to the project board.
4. Move the issue to **Ready** when it is scoped.
5. Create a branch linked to the issue.
6. Move the issue to **In Progress**.
7. Make changes on the branch.
8. Open a pull request that uses `Closes #<id>` for the issue.
9. Move the issue to **Review**.
10. Review and merge the pull request.
11. Confirm the issue is closed and moved to **Done**.

Branch naming, pull request requirements, and merge strategy are defined separately.

## Closure Rules

Issues should be closed through pull request merge using GitHub's automatic closing mechanism:

```text
Closes #<id>
```

Issues must not be manually closed unless the work is explicitly abandoned, replaced, or no longer
needed.

Manual closure must include justification in a comment.
