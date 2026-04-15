---
title: "ADR-0001: Documentation Structure"
doc_type: adr
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-04-15
related: []
tags: [documentation, standards]
---

# ADR-0001: Documentation Structure

## Context

Documentation structure decisions made early in a project tend to calcify and are costly to reverse
later. Poorly structured documentation fragments over time, becoming difficult to maintain and
inaccessible to automated tooling.

This repository is designed to support AI-assisted workflows from the start. For that to work,
documentation must be machine-readable, consistently structured, and versioned alongside code.

Two alternatives were considered and rejected.

External tools such as Google Docs, Notion, and SharePoint were rejected because they introduce
weaker versioning, limited machine accessibility, and poor integration with automated pipelines.

A wiki was rejected because it is not versioned with the repository, cannot be linted or validated
in CI, and is harder to reference from code or tooling.

## Decision

All documentation is located in the repository under the `docs/` directory. Markdown is the required
format for all documents. No external documentation tools are used as a primary source of truth.

## Consequences

### Positives

- Documentation is versioned alongside code and subject to the same review process.
- Markdown is human-readable and machine-readable without additional tooling.
- Structured text-based documentation supports AI-assisted workflows including search,
  summarization, and automation.
- Linting and validation can be applied to documentation in CI.

### Negatives

- Documentation quality requires ongoing contributor discipline to maintain.
- Markdown has limited native support for rich formatting such as diagrams or complex tables.

### Out of Scope

- This ADR does not define the internal structure of the `docs/` directory or its subdirectories.
- This ADR does not define documentation formatting standards or metadata requirements.
- This ADR does not define how AI workflows or automation are implemented against the documentation.
