---
title: AI Permissions and Gates
doc_type: standard
status: draft
owners: ["@julian-cardone"]
tags: [ai, governance, permissions]
---

# AI Permissions and Gates

This document defines the technical controls that constrain AI-assisted contributions within the
repository.

These controls ensure that repository governance, workflow rules, and operational procedures cannot
be modified unintentionally.

AI tools operate within the same pull request workflow as human contributors. Enforcement mechanisms
ensure that repository standards are respected.

## Contribution Model

AI-generated changes must be proposed through pull requests.

AI tools must not:

- push directly to protected branches
- merge pull requests automatically
- bypass repository checks or approval requirements

All changes must pass the same review and validation processes as human contributions.

## Restricted Areas

The following directories define repository governance and operational standards.

They must not be modified by AI contributors.

- `.github/`
- `docs/standards/`
- `docs/runbooks/`
- `docs/technologies/`

Changes to these locations require direct human authorship.

## Protected Mechanisms

The repository enforces governance through the following mechanisms.

### Branch Protection

The `main` branch is protected.

Protection rules require:

- pull requests for all changes
- review before merging
- repository checks to pass before merge

Direct pushes to the protected branch are not permitted.

### CODEOWNERS

The repository defines CODEOWNERS for protected paths.

CODEOWNERS ensure that:

- changes to governance files require explicit review
- repository standards cannot be modified without approval

### Continuous Integration Checks

Automated checks run when pull requests are opened or updated.

These checks validate repository requirements such as:

- documentation metadata compliance
- repository consistency rules

Pull requests cannot be merged if required checks fail.

### Pull Request Review

All contributions must be reviewed before merging.

Automated review tools may provide feedback, but human approval remains required for merge.

## Governance Protection

The combination of branch protection, CODEOWNERS, and automated checks forms the governance boundary
of the repository.

These mechanisms ensure that:

- repository standards remain authoritative
- documentation integrity is maintained
- architectural decisions remain traceable
- AI-generated changes cannot bypass review

## Relationship to Other Standards

This document defines enforcement mechanisms only.

The behavioral expectations for AI contributors are defined in:

- `ai-workflow.md`

Development workflow and review procedures are defined in other repository standards.
