---
title: Documentation Maintenance
doc_type: standard
status: draft
owners: ["@julian-cardone"]
tags: [documentation, maintenance, governance]
---

# Documentation Maintenance

This document defines how documentation must be maintained to ensure accuracy and consistency.

Documentation must remain aligned with the current state of the system and project processes.

## Source of Truth

Documentation must reflect the current state of the system.

When a change alters architecture, system behavior, workflows, or operational processes, the
relevant documentation must be updated in the same pull request.

Outdated documentation must not remain in the repository.

If documentation no longer reflects reality, it must be updated or removed.

## Avoiding Duplication

Information must not be duplicated across multiple documents.

Each concept should have a single authoritative location.

If related information exists in another document, it should not be restated. The existing document
should remain the source of truth.

## Updating Diagrams

When architecture or design documentation changes, any related diagrams must be updated to match the
new system structure.

Diagrams must reflect the current system and must not contradict written documentation.

## Documentation Ownership

Standards define the operating rules of the repository and must remain stable.

Standards documentation must only be modified through explicit human approval.

AI agents must not create, modify, or delete documents within the `standards/` directory.

## Responsibility

Contributors are responsible for ensuring that documentation remains accurate when changes are
introduced.

Pull request reviews must verify that documentation updates have been made when required.
