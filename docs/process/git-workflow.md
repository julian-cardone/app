---
title: Git Workflow
doc_type: process
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-05-01
related: []
tags: [git, workflow, process]
---

# Git Workflow

This document defines the branching and merge model for the repository.

The workflow is designed to:

- Enforce traceability between issues, branches, and pull requests.
- Ensure all work is reviewed before merging.
- Maintain a clean and understandable commit history.
- Support AI-assisted development through predictable conventions.

## Branching Model

The repository follows a trunk-based workflow.

- `main` is the default branch.
- All changes must be made in a non-target branch.
- Direct pushes to main are not permitted.
- All changes must be merged via pull request.

### Branch Naming Convention

Branches must follow this format:

`issue-<id>-<slug>`

Where:

- `<id>` is the GitHub issue number.
- `<slug>` is a short, hyphenated summary of the work.

#### Examples

`issue-3-docs-guidelines`

`issue-12-auth-flow-design`

`issue-27-update-architecture-diagram`

### Rules

- A branch must correspond to an existing issue.
- Branch names must be lowercase.
- Words must be separated by hyphens.
- Avoid unnecessary verbosity in slugs.

## Merge Strategy

Pull requests must be merged into `main` using **squash merge**.

This ensures:

- A single clean commit per issue.
- Clear mapping between issue and merged change.
- Reduced history noise from iterative commits.

## Enforcement

This workflow is enforced through:

- Branch protection rules.
- Required pull request reviews.
- CODEOWNERS for protected paths.
- Required status checks

These controls are configured in repository settings and are mandatory.
