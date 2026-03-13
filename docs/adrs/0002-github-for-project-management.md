---
title: GitHub for Project Management
doc_type: adr
status: draft
owners: ["@julian-cardone"]
tags: [project-management, github]
---

# ADR-0002: GitHub for Project Management

## Context

A lightweight project management solution is required for the current use case. The chosen technology should support task management, issue statuses, and should integrate well with the current technologies. We currently have a small team, and do not require a complicated project management tool. The solution should also have low overhead costs.

GitHub was selected as a suitable option for the current use case. Jira was considered, but not chosen because it introduces additional workflow and process structure which is unnecessary given current team size and requirements.

## Decision

GitHub is the authoritative system of record for project state, including issues and status tracking.

## Consequences

### Positives

- Simple and lightweight.
- Tight integration with the GitHub ecosystem.
- Low overhead, enabling rapid iteration.
- Potential for AI and automated workflow integration.

### Negatives

- Migration may be required if project management needs outgrow GitHub’s capabilities.
- Limited support for complex planning.

### Out of Scope

- Label taxonomy.
- Project board configuration.
- Workflow rules.
- GitHub Projects configuration.
