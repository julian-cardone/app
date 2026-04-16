---
title: Folder Structure
doc_type: standard
status: draft
owners: ["@julian-cardone"]
last_reviewed: 2026-04-15
related: ["docs/standards/coding.md", "docs/adrs/0004-repository-tooling-stack.md"]
tags: [standards, architecture]
---

# Folder Structure

This document defines the philosophy and conventions for organizing files and directories in this
repository and any application code it contains.

## Current Status

No application code has been introduced. No application-specific folder conventions apply. No
technology stack has been selected.

## Universal Principles

The following principles apply regardless of technology stack.

### Organize by feature, not by type

Group code by what it does, not what it is. A feature's handler, model, tests, and utilities should
live together — not split across `handlers/`, `models/`, `tests/`, `utils/`.

Exceptions apply for cross-cutting infrastructure (logging, config, auth) that is genuinely shared
across features.

### Separate concerns at the directory level

Each directory should have a single, clear responsibility. Avoid directories that mix business
logic, infrastructure, and configuration. If a directory is hard to name, it may be doing too much.

### Keep depth proportionate to complexity

Avoid deep nesting for small codebases. Flat structures are easier to navigate. Add hierarchy only
when it reduces confusion, not as a preemptive organizational gesture.

### Be consistent

Follow the established structure of the existing codebase. Do not introduce new structural patterns
without documenting the rationale.

## Reserved Directories

The following top-level directories are reserved and must not be repurposed:

- `docs/` — project documentation (governed by this repository's standards)
- `.github/` — CI workflows and GitHub configuration
- `.claude/` — Claude Code configuration

## Application Structure

No application-specific folder conventions apply.
