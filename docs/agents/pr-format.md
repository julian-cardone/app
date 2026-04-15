---
title: Pull Request Format
doc_type: agent
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-04-15
related:
  [
    "docs/process/git-workflow.md",
    "docs/process/commit-messages.md",
    "docs/process/done-criteria.md",
  ]
tags: [ai-agent, workflow, governance, git]
---

# Pull Request Format

This document defines the required format for pull requests in this repository. All pull requests —
human and AI-generated — must follow this format.

## Title

Pull request titles must follow the conventional commit format, as enforced by
`action-semantic-pull-request` in CI.

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

The title is used as the squash commit message when merged. It must accurately summarize the change.

## Required Fields

Every pull request must include:

- A reference to the originating issue (e.g., `Closes #12` or `Relates to #12`)
- A short description of what changed and why
- A description of how the change was tested or verified

## Body Template

```markdown
## Summary

<!-- What changed and why -->

## Changes

<!-- List of specific changes made -->

## Verification

<!-- How this was tested or verified (e.g., CI passes, linting ran, manual check) -->

## Related

<!-- Issue reference: Closes #<id> -->
```

## Rules

- Pull requests must reference an existing issue.
- Pull request descriptions must not be left blank.
- All required CI status checks must pass before requesting review.
- Pull requests must not be self-approved — human review is required for all changes.
