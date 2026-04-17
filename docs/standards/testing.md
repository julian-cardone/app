---
title: Testing Standards
doc_type: standard
status: draft
owners: ["@julian-cardone"]
last_reviewed: 2026-04-15
related: ["docs/adrs/0004-repository-tooling-stack.md"]
tags: [testing, standards]
---

# Testing Standards

This document defines testing expectations and conventions for this repository.

## Current Status

No application code has been introduced to this repository. No technology stack has been selected.
No application-specific testing standards apply.

## Guiding Principles

The following principles apply regardless of the technology stack selected:

- Test behavior, not implementation.
- Prefer integration tests over mocks for external system boundaries.
- Tests should be fast enough to run on every change.
- A failing test must point to a clear, actionable problem.
- Tests are part of the codebase and must be maintained to the same standard as production code.
