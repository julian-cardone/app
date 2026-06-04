---
title: Git Workflow
doc_type: process
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-06-01
related:
  ["docs/process/pr-format.md", "docs/process/project-management.md", "docs/agents/constraints.md"]
tags: [git, workflow, process]
---

# Git Workflow

This document defines the branching and merge model for the repository. It is the source of truth
for branch naming and merge strategy.

For project tracking, issue requirements, and board usage, see
[Project Management](./project-management.md). For prohibitions on direct pushes, force pushes, and
self-merging, see [Agent Constraints](../agents/constraints.md). For pull request structure, see
[Pull Request Format](./pr-format.md).

## Branching Model

The repository follows a trunk-based workflow. `main` is the default branch. All changes are made on
a non-target branch and merged via pull request.

Each non-trivial unit of work must start from a GitHub issue. The issue defines the intent, scope,
and acceptance criteria for the work. The branch implements that issue.

## One Issue, One Branch, One Pull Request

The default repository workflow is one-to-one:

```text
issue → branch → pull request → merge → done
```

Each issue must map to:

- One primary branch.
- One primary pull request.
- One merged change on `main`.

This keeps human and agentic workflows simple, reviewable, and easy to trace.

If work appears too large for one pull request, split it into multiple smaller issues before work
begins. Do not use one issue as an epic for multiple pull requests unless the process is explicitly
changed.

### Branch Naming Convention

Branches must follow this format:

```text
issue-<id>-<slug>
```

Where `<id>` is the GitHub issue number and `<slug>` is a short, hyphenated summary of the work.

Examples:

```text
issue-3-docs-guidelines
issue-12-auth-flow-design
issue-27-update-architecture-diagram
```

### Rules

- A branch must correspond to an existing issue.
- A branch must have one primary issue.
- Branch names must be lowercase, hyphen-separated.
- Slugs should be concise.
- Branches should be deleted after the pull request is merged.

## Merge Strategy

Pull requests are merged into `main` using **squash merge**. This produces a single clean commit per
issue and a direct mapping between issue and merged change.

The pull request title becomes the squash commit message. The pull request description preserves the
context, reasoning, and issue linkage.

## Enforcement

The workflow is enforced through branch protection rules, required pull request reviews, CODEOWNERS
routing, required status checks, and pull request title validation. These controls are configured in
repository settings.

## Worktree Workflow

### Pre-launch planning

Before running more than one parallel session, audit which files or directories each session will
need to read and write. If any path appears in more than one session's set, resolve the overlap
before launching — assign the file to one session only, or merge the two tasks into a single
session. Same-file and tightly coupled work must be consolidated at this stage. Resolving a scope
conflict before launch is cheaper than untangling a collision mid-session.

### Starting a session

```text
claude --worktree <type>-<short-description>
```

Use the same type prefixes as pull request titles: `feat`, `fix`, `docs`, `chore`, `refactor`.
Examples:

```text
claude --worktree feat-user-auth
claude --worktree fix-nav-overflow
claude --worktree docs-onboarding-guide
```

Claude Code creates the worktree at `.claude/worktrees/<name>/` on a branch named `worktree-<name>`.
The main working directory is untouched.

Naming rules: lowercase, hyphen-separated, a type prefix followed by a short description of two to
four words. The prefix matches the intended pull request title so the branch purpose is unambiguous
across sessions.

A session can also be given the full task in the opening prompt and run autonomously:

```text
Spin up a worktree called feat-user-auth, implement user authentication in src/auth/,
and when done notify me that the worktree is ready to merge.
```

Claude Code will complete the work and stop, leaving the merge as a deliberate human step. Do not
instruct a session to merge autonomously — that step warrants human review.

### Scope discipline

Each session is given an explicit scope at start: the directories or files it is permitted to read
and write. Scope overlap between parallel sessions is the primary source of conflicts. Scope is
stated in the launch prompt, not inferred from the repository structure.

If a session encounters build errors in files it did not edit, it must not attempt to fix them. The
correct response is to wait and retry — another session is likely mid-edit. Cascading fix attempts
across sessions are the primary cause of parallel failures.

### Merging

Each worktree is one pull request with one owner. A running session must not merge, rebase, or pull
from other worktree branches — merging is always a separate orchestration step performed after the
session completes.

Use the `/merge-worktree` slash command as the default:

```text
/merge-worktree <name> <target-branch>
```

The command reads the diff, generates a conventional-commit message, calls
`scripts/worktree-merge.sh`, and reports what was merged and cleaned up. When the commit message is
already known, call the script directly to avoid the token cost:

```text
bash scripts/worktree-merge.sh <name> <target-branch> "<commit message>"
```

The script commits any pending changes in the worktree, merges into the target, and removes the
worktree and branch on success. It will not proceed if the main working tree is dirty, and it will
not delete a branch that has not been fully merged.

When two worktrees both target the same branch, merge them sequentially:

```text
/merge-worktree feat-user-auth main
/merge-worktree feat-api-endpoints main
```

The second merge needs the first committed to reconcile both sets of changes correctly.

**Merge conflicts**

The script aborts before cleanup when a conflict occurs. Resolve the conflicted files, commit the
merge, then clean up manually:

```text
git worktree remove .claude/worktrees/<name>
git branch -d worktree-<name>
git worktree prune
```

A branch checked out by a worktree cannot be checked out elsewhere. If merging directly is
necessary, do not attempt `git checkout worktree-<name>` — it will fail with
`fatal: '<branch>' is already used by worktree`. Merge the branch without checking it out.

### Cleanup

The merge script handles cleanup automatically on a successful merge. For periodic housekeeping or
abandoned worktrees, review what is active:

```text
git worktree list
```

Before removing a branch manually, verify it has been fully merged:

```text
git log --oneline <target-branch>..worktree-<name>
```

If no commits are shown, the branch can be safely removed.

### Token discipline

Keep each session scoped to one task. End and replace sessions rather than extending them
indefinitely. A scoped session that finishes cleanly costs far fewer tokens than a long-running
session that accumulates context drift.
