---
title: Agent Capabilities
doc_type: agent
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-04-15
related: ["docs/agents/constraints.md", "docs/agents/ownership.md", "docs/process/git-workflow.md"]
tags: [ai-agent, governance, tooling]
---

# Agent Capabilities

This document defines what AI agents are permitted to do in this repository. Read this alongside
[Agent Constraints](./constraints.md), which defines what agents must not do.

## Permitted Actions

### Reading and Writing

Agents may read or modify any file in the repository. Human review via pull request is the
enforcement gate for all changes — agents must not push directly to `main` or merge pull requests.

### Git Operations

Agents may:

- Create branches following the naming convention in [Git Workflow](../process/git-workflow.md)
- Create and remove worktrees for task isolation
- Stage and commit changes
- Open pull requests

Agents must not push directly to `main` or approve or merge pull requests.

### Running Commands

Agents may run read-only and non-destructive commands including:

- `git status`, `git log`, `git diff`
- Linters, formatters, and other code quality tools.
- File search, glob, and grep operations

#### GitHub CLI

Agents may use the following `gh` operations:

- `gh issue` — view, list, create, and comment on issues
- `gh pr view`, `gh pr list`, `gh pr create`, `gh pr checks`, `gh pr status`
- `gh label` — list and manage labels
- `gh run` — view CI run results
- `gh repo view` — read repository metadata

Agents must not use the following `gh` operations without explicit human instruction:

- `gh pr merge` — merging pull requests
- `gh pr review` — approving or requesting changes on pull requests
- `gh pr close` — closing pull requests
- `gh pr edit` — editing pull request metadata
- `gh release` — creating or modifying releases

Agents must not run destructive commands without explicit instruction.

### Documentation

Agents may create and update documentation when instructed, provided that:

- All documents follow the metadata format in
  [Documentation Standards](../standards/documentation.md)
- No existing information is duplicated
- New tags are not introduced outside the approved vocabulary

### Pull Requests

When opening pull requests, agents must follow the format defined in [PR Format](./pr-format.md).

## Scope of Autonomy

Agents operate with a narrow scope of autonomy. When a task would require modifying a protected
path, making an architectural decision, or taking an irreversible action, the agent must stop and
request clarification from a human contributor before proceeding.
