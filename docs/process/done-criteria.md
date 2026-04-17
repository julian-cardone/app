---
title: Definition of Done
doc_type: process
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-04-15
tags: [workflow, governance, process]
---

# Definition of Done

This document defines the criteria that must be satisfied before a pull request can be merged.

All work must meet the Definition of Done.

Pull request reviews must verify that the following requirements are satisfied.

## General Requirements

The following requirements apply to all pull requests.

- The pull request references the originating issue.
- The pull request description follows the required template.
- The change fulfills the intent of the issue.
- Documentation has been updated when required.
- Required reviews have been completed.
- Required status checks pass.

## Documentation Changes

Pull requests that modify or introduce documentation must satisfy the following requirements.

- The document is placed in the correct directory.
- A valid metadata header is present.
- The document follows the documentation guidelines.
- The change does not introduce duplicated information.
- Related diagrams are updated when applicable.
- Links within the document are valid.

## Architecture and Design Changes

Pull requests that modify architecture or design documentation must satisfy the following
requirements.

- Architecture documentation reflects the current system structure.
- Design documents accurately describe the intended implementation.
- Any diagrams related to the change have been updated.

## Decision Records

When a change introduces a significant architectural decision:

- An Architecture Decision Record (ADR) has been drafted.
- The ADR follows the required template.

## Completion

A pull request may be merged only after all applicable requirements in this document have been
satisfied.
