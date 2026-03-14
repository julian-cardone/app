---
title: AI Workflow
doc_type: standard
status: draft
owners: ["@julian-cardone"]
tags: [ai, workflow, governance]
---

# AI Workflow

This document defines how AI tools participate in the repository's development workflow.

AI contributors assist with development tasks but operate within the same governance framework as
human contributors.

All AI-generated changes must follow the repository standards and development workflow.

## Role of AI Contributors

AI tools may assist with:

- generating or modifying code
- updating architecture or design documentation
- drafting Architecture Decision Records (ADRs)
- refactoring existing code or documentation
- summarizing repository information
- proposing improvements through pull requests

AI tools act as development assistants.  
They do not bypass repository governance or approval processes.

## Workflow Integration

AI-generated work follows the same workflow as human contributions.

1. Work begins with a GitHub issue.
2. A branch is created that references the issue.
3. Changes are proposed through a pull request.
4. Repository checks and reviews occur.
5. Changes may be merged only after approval.

The authoritative workflow definitions are described in the repository standards.

## Documentation Responsibilities

When AI-generated changes affect:

- architecture
- design
- system behavior
- workflows
- operational processes

the relevant documentation must be updated in the same pull request.

Documentation must follow the documentation standards and include required metadata.

## Architecture Decisions

AI may assist in drafting Architecture Decision Records (ADRs).

Accepted ADRs must never be modified.

If a previous architectural decision changes, a new ADR must supersede the earlier one.

The decision-making process is defined in the repository standards.

## Restricted Areas

AI contributors must not modify the following directories:

- `.github/`
- `docs/standards/`
- `docs/runbooks/`
- `docs/technologies/`

These areas define repository governance, operational procedures, and documentation standards.

Changes to these directories must be authored directly by a human contributor.

## Allowed Contribution Areas

AI contributors may propose modifications to other repository areas, including:

- source code
- architecture documentation
- design documentation
- ADR drafts
- backlog documents

All proposed changes remain subject to pull request review and repository checks.

## Review and Approval

AI-generated changes require the same review process as any other contribution.

Pull requests must satisfy the Definition of Done before merging.

Human approval is always required for merging changes.

AI tools must not merge pull requests automatically.

## Principles

AI participation in the repository is guided by the following principles:

- AI assists development but does not replace human oversight.
- Repository standards define the authoritative workflow.
- Documentation must remain synchronized with implementation.
- Governance rules must remain protected.
