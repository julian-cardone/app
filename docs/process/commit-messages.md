---
title: Commit Messages
doc_type: process
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-04-30
related: ["docs/agents/pr-format.md"]
tags: [git, workflow, process]
---

# Commit Messages

This repository uses squash merge. Every pull request merges to `main` as a single commit.

The squash commit message is the pull request title. Its required format is defined in
[PR Format](../agents/pr-format.md) and enforced by CI.

Individual development commits are unconstrained. They do not appear in permanent history and are
not enforced.

---

## PR Description

The pull request description serves as the permanent record of context, reasoning, and issue
references for a change. Git history contains the PR title only — all additional context belongs in
the PR description, which remains accessible on GitHub after merge.

---

## Issue Linking

Issue references belong in the pull request description, not in the title or individual commits.

Use GitHub's closing keywords in the PR body:

```text
Closes #42
```

This closes the issue automatically when the pull request merges and keeps the PR title clean for
the commit record. Issue linking is required for all pull requests.
