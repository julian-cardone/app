---
title: Coding Standards
doc_type: standard
status: draft
owners: ["@julian-cardone"]
last_reviewed: 2026-04-15
related: ["docs/adrs/0004-repository-tooling-stack.md"]
tags: [standards, tooling]
---

# Coding Standards

This document will define language-specific coding conventions for this repository.

## Current Status

No application code has been introduced to this repository. The technology stack has not yet been
selected.

Coding standards will be defined when an application language and framework are chosen. At that
point, this document will be updated to cover:

- Code formatting rules and tooling
- Naming conventions
- File and module organization
- Language-specific patterns and anti-patterns
- Linting and static analysis configuration

## Guiding Principles

The following principles apply regardless of the technology stack selected:

- Prefer clarity over cleverness.
- Functions and modules should have a single, well-defined responsibility.
- Code should be readable without requiring comments to explain intent.
- Dependencies should be introduced deliberately and minimally.

For decisions about which tools and languages to adopt, refer to
[ADR-0004: Repository Tooling Stack](../adrs/0004-repository-tooling-stack.md).
