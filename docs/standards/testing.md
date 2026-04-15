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

This document will define testing expectations and conventions for this repository.

## Current Status

No application code has been introduced to this repository. The technology stack has not yet been
selected.

Testing standards will be defined when an application language and framework are chosen. At that
point, this document will be updated to cover:

- Testing framework selection and configuration
- Test structure and organization
- Coverage expectations
- What to test and what not to test
- CI integration for test execution

## Guiding Principles

The following principles apply regardless of the technology stack selected:

- Test behavior, not implementation.
- Prefer integration tests over mocks for external system boundaries.
- Tests should be fast enough to run on every change.
- A failing test must point to a clear, actionable problem.
- Tests are part of the codebase and must be maintained to the same standard as production code.
