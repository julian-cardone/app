---
title: Pull Request Format
doc_type: process
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-05-15
related:
  [
    "docs/process/git-workflow.md",
    "docs/process/project-management.md",
    "docs/process/done-criteria.md",
  ]
tags: [workflow, git, process]
---

# Pull Request Format

This document defines how to structure a pull request. For the criteria that must be satisfied
before merging, see [Definition of Done](./done-criteria.md).

The repository uses squash merge. Every pull request becomes a single commit on `main`, and the pull
request title becomes the squash commit message. Individual development commits are unconstrained
and do not appear in permanent history.

Each pull request must have one primary linked issue. The issue tracks the work; the pull request
records the reviewed implementation.

---

## Title

Titles must follow the conventional commit format, enforced by `action-semantic-pull-request` in CI.

Format:

```text
<type>(<scope>): <short description>
```

Examples:

```text
docs(agents): add capabilities and constraints documents
chore(ci): fix required file paths in doc-checks workflow
fix(adrs): correct broken cross-reference in ADR-0004
```

The title is the permanent commit record. It must accurately summarize the merged change.

---

## Body Template

```markdown
## Summary

<!-- What changed and why -->

## Changes

<!-- List of specific changes made -->

## Related

Closes #<id>

## Documentation Updates

<!-- Note any documentation updates, or write "Not applicable" -->

## ADR Requirement

<!-- Note whether an ADR was created, superseded, or not required -->

## Definition of Done

<!-- Confirm the relevant done criteria were satisfied -->
```

The pull request description is the permanent record of context, reasoning, and issue references for
a change. Git history contains only the title — all additional context belongs in the description,
which remains accessible on GitHub after merge.

---

## Issue Linking

Issue references belong in the description, not in the title.

Because the repository uses a one-issue, one-pull-request workflow, each pull request must close its
primary issue using GitHub's closing keywords:

```text
Closes #42
```

This closes the issue automatically when the pull request is merged and keeps the title clean for
the commit record.

Do not use non-closing references such as `Refs #42`, `Related to #42`, or `Part of #42` for the
primary issue. Those references are only appropriate for secondary context and must not replace the
required closing reference.

## Pull Request Board Usage

Pull requests should not be added to the project board by default.

The project board tracks issues as the canonical units of work. A pull request is linked from the
issue and represents the implementation review for that issue. Adding both the issue and pull
request to the board creates duplicate tracking for the same work.
