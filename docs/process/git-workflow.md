---
title: Git Workflow
doc_type: process
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-05-15
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
