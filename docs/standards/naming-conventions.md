---
title: Naming Conventions
doc_type: standard
status: draft
owners: ["@julian-cardone"]
last_reviewed: 2026-04-15
related: ["docs/standards/coding.md", "docs/standards/folder-structure.md"]
tags: [standards]
---

# Naming Conventions

This document defines naming conventions for files, directories, variables, functions, and other
identifiers in this repository and any application code it contains.

## Current Status

Language-specific naming conventions (camelCase, snake_case, PascalCase) depend on the technology
stack. No technology stack has been selected. No language-specific conventions apply.

## Universal Principles

The following principles apply regardless of technology stack.

### Be descriptive

Names should communicate intent. A name that requires a comment to explain it is not descriptive
enough. Prefer longer, clear names over short, ambiguous ones.

### Avoid abbreviations

Abbreviations save keystrokes but cost readability. Use full words unless the abbreviation is
universally understood in context (e.g., `id`, `url`, `html`).

### Be consistent

Follow the naming patterns already in use. Do not introduce a new convention for a single file or
function. If the right pattern does not exist, establish it here and apply it consistently.

### Name things for what they are, not what they do

A variable holding a user record should be named `user`, not `fetchedUser` or `userResult`. A
function that validates an email should be named `validateEmail`, not `checkTheEmail`.

### Avoid negation in names

Prefer positive names (`isEnabled`, `hasAccess`) over negations (`isNotDisabled`, `lacksAccess`).
Negated booleans create confusion when combined with conditional logic.

## Documentation and File Naming

- Documentation files use lowercase, hyphen-separated names (e.g., `folder-structure.md`)
- ADR files follow the pattern `XXXX-short-title.md` (e.g., `0004-repository-tooling-stack.md`)
- Directory names use lowercase, hyphen-separated words

## Application Conventions

No application-specific naming conventions apply.
