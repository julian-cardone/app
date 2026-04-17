---
title: Session and Worktree Management
doc_type: process
status: draft
owners: ["@julian-cardone"]
last_reviewed: 2026-04-15
related:
  ["docs/process/git-workflow.md", "docs/agents/capabilities.md", "docs/agents/constraints.md"]
tags: [workflow, git, process, ai-agent, tooling]
---

# Session and Worktree Management

This document defines the decision procedure for selecting session type, worktree usage, and
starting mode when beginning any unit of work. Following this procedure consistently reduces context
bleed between tasks and ensures agent work is always isolated.

---

## Decision Procedure

Evaluate the following criteria in order to determine the correct setup.

### Quick Questions and Exploration

When work is a question, investigation, or spike with no intended repository change:

- No worktree is needed.
- No new session is required.
- Use plan mode.

### Human-Initiated Tasks

When a human contributor initiates a task that will result in repository changes:

#### Sequential Work

When no other work is in progress on this repository:

1. Check out a branch following the naming convention in [Git Workflow](./git-workflow.md).
2. Open or reuse a named session scoped to that branch.
3. Begin in plan mode. Switch to `acceptEdits` only after the plan is approved.

#### Parallel Work

When other work is already in progress concurrently:

1. Create a worktree for the new branch.
2. Open a new named session scoped to that worktree.
3. Begin in plan mode. Switch to `acceptEdits` only after the plan is approved.

### Agent Tasks

Agent tasks require all three of the following regardless of whether other work is in progress:

1. A worktree — isolation is non-negotiable for agent tasks.
2. A new named session scoped to that worktree.
3. Plan mode at start; switch to `acceptEdits` only after the human approves the plan.

---

## Rationale

ADR-0003 establishes that all AI-assisted changes must pass through a controlled review workflow.
Worktree isolation enforces that constraint at the filesystem level — an agent operating in a
worktree cannot accidentally affect the working tree of a concurrent task. Plan mode as the default
entry point ensures a human reviews intent before any file is modified, which is consistent with the
principle that agents do not take irreversible actions without confirmation.

---

## Relationship to Other Documents

Branch naming and merge strategy are defined in [Git Workflow](./git-workflow.md). Permitted git
operations, including worktree creation, are listed in
[Agent Capabilities](../agents/capabilities.md). Constraints on irreversible actions are defined in
[Agent Constraints](../agents/constraints.md).
