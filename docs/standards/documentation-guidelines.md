---
title: Documentation Guidelines
doc_type: standard
status: draft
owners: ["@julian-cardone"]
tags: [documentation, standards]
---

# Documentation Guidelines

This document explains the standards for creating documentation.

## Documentation Metadata File Headers

Each document should have a file header containing metadata. Attaching metadata to a file will help with machine-assisted workflows, allowing for searchability, parsing, and indexing.

### Canonical Metadata Header Template

Place this header at the top of every document:

```markdown
---
title: <Human-readable document title>
doc_type: <adr | architecture | design | standard | runbook | backlog | technology>
status: <draft | accepted | deprecated | superseded>
owners: ["@github-handle"]
tags: [<keyword>, <keyword>]
---
```

### Metadata Guide

#### `title` (required)

A short, descriptive, human-readable name.

_Rules_

- Use Title Case.
- Match the H1.

_Why it Exists_

- Primary Display Name for Humans.
- Index key for search and AI tooling.

#### `doc_type` (required)

The semantic category of the document.

_Allowed Values_

`adr` | `architecture` | `design` | `standard` | `runbook` | `backlog` | `technology`

_Why it Exists_

- Allow machines to reason about intent.
- Prevents mixing decisions, rules, and exploration.
- Enables type-aware search and automation.

#### `status` (required)

The lifecycle state of the document.

_Recommended Values_

- `draft` – still evolving.
- `accepted` – authoritative.
- `deprecated` – no longer valid, kept for history.
- `superseded` – replaced by another doc.

_Why it Exists_

- Prevents stale docs from being treated as truth.
- Critical for AI-assisted reasoning later.

#### `owners` (required)

People responsible for accuracy, not authorship.

_Rules_

- GitHub handles only.
- Can be a single person or a small list.

_Why it Exists_

- Answers “who should fix this if it’s wrong?”.
- Enables automated ownership checks later.

#### `tags` (optional but encouraged)

Lightweight keywords for cross-cutting concerns.

_Rules_

- Lowercase.
- Short.
- No spaces (use hyphens if needed).
- 6 tags max to avoid over-classification.

_Examples_

- `documentation`
- `workflow`
- `testing`
- `ai-readiness`
- `security`

_Why it Exists_

- Improves discovery without rigid taxonomy.
- Helps AI cluster related docs.
- Cheap to maintain if kept small.

### Metadata Usage Guidelines

- All documents must include a metadata header.
- Required fields must not be omitted.
- Optional fields should only be included when meaningful.
- Metadata should be updated only when the document meaning changes.

## Creating vs Updating Documentation

- Update an existing document when the change refines or extends the same concept.
- Create a new document when the change introduces a new concept, decision, or responsibility.
- Avoid duplicating information across multiple documents.

## Document Lifecycle and Deletion

Documentation should be kept accurate and useful. Outdated documentation should not be hoarded.

- Architecture Decision Records (ADRs) must never be deleted. If an ADR is no longer valid, its status should be updated to `deprecated` or `superseded`.
- Standards and architecture documents should generally be updated in place rather than deprecated or deleted.
- Runbooks may be deleted if the operational process they describe no longer exists.
- Backlog documents should be deleted when ideas or experiments are no longer relevant.

When in doubt, prefer deleting documentation that no longer reflects reality rather than keeping outdated information.
