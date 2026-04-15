---
title: "ADR-0003: AI-Assisted Development Workflow"
doc_type: adr
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-03-29
related: []
tags: [ai-agent, workflow, governance]
---

# ADR-0003: AI-Assisted Development Workflow

## Context

AI-assisted tools can support development tasks including code generation, documentation drafting,
and review. Without a defined approach, AI contributions introduce risks including inconsistent
changes, undocumented architectural drift, and unintended modifications to governance artifacts.

Three alternative approaches were considered and rejected.

Fully manual development without AI assistance was rejected because it does not leverage available
tooling that can accelerate development without compromising quality.

Unrestricted AI contributions without governance constraints were rejected because they risk
repository inconsistency and loss of traceability.

AI contributions without human review were rejected because they remove human oversight from
architectural and documentation changes.

## Decision

The repository adopts a controlled AI-assisted development workflow. AI tools may assist with
development tasks, and all AI-generated changes are subject to the same review process as human
contributions. Human review remains the final authority over all repository changes.

## Consequences

### Positives

- AI-assisted development is enabled without compromising repository governance.
- All changes remain traceable through the standard review process regardless of origin.
- Human oversight is preserved for all repository changes.

### Negatives

- AI contributions may require additional review effort to verify correctness and alignment with
  standards.
- Contributors must understand repository standards to use AI tools effectively within constraints.

### Out of Scope

- This ADR does not define which AI tools are approved for use.
- This ADR does not define the specific constraints or permissions governing AI contributors.
- This ADR does not define CI configuration or automation workflows.
