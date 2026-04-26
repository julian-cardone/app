---
title: "ADR-0002: GitHub for Project Management"
doc_type: adr
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-04-26
related: []
tags: [process, tooling]
---

# ADR-0002: GitHub for Project Management

## Context

A project management solution is required to support task tracking and issue status management. The
current team is small and the project is early stage. The chosen solution must integrate with the
existing GitHub-based development workflow and must not introduce disproportionate overhead for the
current scale.

Jira was considered and rejected. It introduces workflow and process structure that exceeds current
requirements, adds a separate system to maintain, and has higher administrative overhead relative to
the value it provides at this scale.

## Decision

GitHub is the authoritative system of record for project state, including issues, task tracking, and
status management.

## Consequences

### Positives

- Lightweight and proportionate to current team size and project complexity.
- Natively integrated with the existing GitHub development workflow.
- Low administrative overhead.

### Negatives

- GitHub's project management capabilities may become insufficient if team size or project
  complexity grows significantly.
- Limited support for complex planning structures such as dependency tracking or resource
  allocation.

### Out of Scope

- Label taxonomy and issue categorization conventions are not defined by this ADR.
- Project board configuration and workflow automation rules are not defined by this ADR.
- GitHub Projects setup and structure are not defined by this ADR.
