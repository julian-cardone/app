---
title: Pull Requests
doc_type: standard
status: draft
owners: ["@julian-cardone"]
tags: [git, pull-requests, workflow, review]
---

# Pull Requests

This document defines the requirements for submitting and reviewing pull requests.

All changes to the repository must be merged through a pull request.

## Required Description Structure

Every pull request must include the following sections in the description.

### Summary

A short explanation of the change and its purpose.

The summary should explain:

- What changed
- Why the change was made

### Issue Link

The pull request must reference the issue that initiated the work.

Use:

`Closes #<id>`

This ensures the issue is automatically closed when the pull request is merged.

### Changes

A concise description of the main modifications introduced by the pull request.

Focus on what was implemented rather than repeating the issue description.

### Documentation Updates

The pull request must confirm whether documentation was updated.

If the change affects architecture, design, system behavior, workflows, or operational processes, the relevant documentation must be updated in the same pull request.

### Decision Records

If the change introduces or alters a significant architectural decision, the appropriate Architecture Decision Record (ADR) process must be followed.

## Pull Request Scope

A pull request should represent a single coherent change.

Large or unrelated modifications should be split into multiple pull requests.

This improves review quality and reduces risk during merging.

## Review Requirements

A pull request must be reviewed before merging.

Reviewers must confirm that the pull request satisfies the Definition of Done.

## Approval and Merge

Pull requests may be merged only after:

- Required reviews are completed
- Required status checks pass

Repository protection rules enforce these requirements.
