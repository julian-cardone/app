---
title: Document Formatting and Linting
doc_type: standard
status: draft
owners: ["@julian-cardone"]
tags: [documentation, formatting, linting, standards]
---

# Document Formatting and Linting

This document defines the repository standard for Markdown formatting and linting.

## Purpose

The repository uses automated formatting and linting to keep documentation consistent, readable, and
easy to review.

This standard exists to:

- reduce formatting noise in pull requests
- keep Markdown structure consistent across the repository
- make documentation easier to maintain over time
- support reliable local validation and CI validation

## Scope

This standard currently applies only to Markdown files (`.md`).

Additional file types may be added later through separate tooling configuration.

## Tooling

Markdown quality is enforced through two complementary tools:

- **Prettier** formats Markdown files automatically in the editor
- **markdownlint-cli2** validates Markdown rules locally and in CI

These tools serve different purposes.

### Formatter responsibility

Prettier is responsible for automatic formatting tasks such as:

- wrapping prose
- normalizing spacing
- applying consistent Markdown layout where supported

Prettier should run automatically on save for Markdown files.

### Linter responsibility

`markdownlint-cli2` is responsible for validating Markdown quality rules such as:

- heading structure
- spacing around blocks
- line length policy
- other Markdown formatting and consistency rules

The linter acts as the enforcement layer in local validation and CI.

## Rule Philosophy

Formatting and linting should work together rather than compete.

The repository follows these principles:

- formatter and linter settings should align where practical
- lint rules should be explicitly configured rather than left implicit
- local authoring friction should remain low
- CI should enforce the final repository standard

The goal is not perfect overlap between tools. The goal is a practical workflow in which:

- the formatter handles most mechanical changes automatically
- the linter catches violations that should not be merged

## Current Markdown Policy

Markdown files are formatted and validated using the repository configuration files.

The current policy is:

- prose should wrap to the configured line length
- line length should not be enforced for code blocks
- line length should not be enforced for tables
- line length should not be enforced for headings

These exceptions exist to preserve readability and avoid unnecessary formatting friction.

## Local Editor Behavior

Markdown files should format automatically on save through the repository VS Code settings.

The repository-local VS Code configuration is stored in:

```text
.vscode/settings.json
```
