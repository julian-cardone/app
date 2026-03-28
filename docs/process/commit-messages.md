---
title: Commit Messages
doc_type: standard
status: draft
owners: ["@julian-cardone"]
tags: [git, commits, workflow]
---

# Commit Messages

This document defines the rules for writing commit messages.

Commit messages must be clear, concise, and traceable to an issue.

This standard governs individual commits only. Pull request requirements are defined separately.

## Format

Each commit message must:

- Use the imperative mood.
- Start with a capital letter.
- Avoid trailing punctuation.
- Be concise and descriptive.

### Imperative Mood

Write commit messages as commands.

Correct:

`Add authentication flow diagram`

Incorrect:

`Added authentication flow diagram`

`Adding authentication flow diagram`

`Adds authentication flow diagram`

The message should describe what the commit does when applied.

## Issue Referencing

Commits may reference the associated GitHub issue using:

`(#<id>)`

Example:

`Define documentation guidelines (#3)`

Commits must not use closing keywords (e.g., `Closes #<id>`).  
Issue closure must occur at the pull request level.

## Scope

- Each commit should represent a single logical change.
- Avoid bundling unrelated changes into one commit.
- Use multiple commits when changes are conceptually distinct.

## Squash Merge Policy

Pull requests are merged using squash merge.

The final merged commit message must accurately summarize the change and retain issue traceability.

This standard ensures:

- Clean project history.
- Clear mapping between issues and changes.
- Consistent formatting for human and AI readability.
