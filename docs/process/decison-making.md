---
title: Decision Making
doc_type: standard
status: draft
owners: ["@julian-cardone"]
tags: [architecture, decisions, adr, design, governance]
---

# Decision Making

This document defines when architectural documentation artifacts must be created or updated.

The goal is to ensure that decisions are documented at the appropriate level of formality.

Not all changes require the same level of documentation.

## Decision Levels

Changes fall into three levels of significance:

1. **Implementation Changes**
2. **Design Changes**
3. **Architectural Decisions**

Each level requires a different documentation artifact.

## Implementation Changes

Implementation changes modify code or documentation without changing system structure or
architectural decisions.

Examples include:

- Bug fixes
- Refactoring
- Documentation improvements
- Minor implementation details

No new architectural documentation is required.

Existing documentation should only be updated if it becomes inaccurate.

## Design Changes

Design changes introduce or modify how a feature will be implemented but do not alter core
architectural decisions.

When a change requires exploration, tradeoffs, or implementation planning, a **design document**
must be created.

Design documents are used to:

- Explore possible approaches
- Document implementation plans
- Evaluate tradeoffs before implementation

Design documents are exploratory and may evolve as the solution becomes clearer.

## Architectural Decisions

Architectural decisions introduce or modify fundamental constraints on the system.

When a change alters system structure, long-term technical direction, or core system behavior, an
**Architecture Decision Record (ADR)** must be created.

Architectural decisions typically have one or more of the following characteristics:

- The decision would be difficult to reverse later.
- The decision affects multiple components of the system.
- The decision establishes a long-term constraint on future work.
- The decision may require justification for future contributors.

Examples include:

- Introducing a new infrastructure component
- Changing system boundaries
- Selecting or replacing major technologies
- Establishing long-term architectural patterns

ADRs document the rationale behind decisions that affect future work.

## Updating Architecture Documentation

Architecture documentation describes the current structure of the system.

Architecture documents must be updated when:

- System components change
- Component relationships change
- System boundaries change
- Deployment or infrastructure structure changes

Architecture documentation reflects the **current state of the system**, not proposals or
exploration.

## ADR Modification Rules

Accepted ADRs must never be edited.

If a previous decision changes, a new ADR must be created that **supersedes** the earlier decision.

The historical record of decisions must be preserved.

## Summary

Use the following guidance when documenting changes:

| Change Type                            | Required Documentation                             |
| -------------------------------------- | -------------------------------------------------- |
| Implementation change                  | Update documentation only if it becomes inaccurate |
| Design exploration or feature planning | Create or update a design document                 |
| Architectural decision or constraint   | Draft a new ADR                                    |
| System structure changes               | Update architecture documentation                  |
