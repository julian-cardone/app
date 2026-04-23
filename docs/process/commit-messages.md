---
title: Commit Messages
doc_type: process
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-04-20
tags: [git, workflow, process]
---

# Commit Messages

This repository uses squash merge. Every pull request merges to `main` as a single commit.

The squash commit message is the pull request title. Its required format is defined in
[Pull Request Format](../agents/pr-format.md) and enforced by CI.

Individual development commits are unconstrained. They do not appear in the permanent history and
are not enforced.

## Issue Linking

Issue references belong in the pull request description, not in commit messages or the pull request
title.

Use GitHub's closing keywords in the PR body:

`Closes #42`

This closes the issue automatically when the pull request merges and keeps the PR title clean for
the commit record.
