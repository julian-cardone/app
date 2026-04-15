---
name: new-adr
description: Create a correctly numbered and formatted Architecture Decision Record in docs/adrs/
disable-model-invocation: true
---

# New Architecture Decision Record

Use this skill to create a new ADR. If `$ARGUMENTS` is provided, use it as the ADR title.

## Step 1 — Get the next number

List files in `docs/adrs/` matching `[0-9][0-9][0-9][0-9]-*.md`. Find the highest number and
increment by 1. Zero-pad to 4 digits (e.g., after `0004` comes `0005`).

## Step 2 — Create the file

Filename: `docs/adrs/XXXX-short-title-slug.md` (lowercase, hyphens, no special characters)

## Step 3 — Frontmatter

```yaml
---
title: "ADR-XXXX: <Short Decision Title>"
doc_type: adr
status: proposed
owners: ["@julian-cardone"]
last_reviewed: <today YYYY-MM-DD>
related: []
tags: []
---
```

`related` must only contain paths to other ADRs. Never link to docs, configs, or code — those drift
and would force superseding an otherwise valid ADR.

## Step 4 — Body structure

```markdown
# ADR-XXXX: <Short Decision Title>

## Context

<What situation, constraint, or need prompted this decision? What alternatives were considered and
explicitly rejected, and why?>

## Decision

<What was decided? State it directly and clearly.>

## Consequences

### Positives

- <What does this enable or improve?>

### Negatives

- <What does this cost, constrain, or risk?>

### Out of Scope

- <What does this ADR explicitly not address?>
```

## ADR Rules

- Impersonal, durable tone — no "we decided", no "currently", no "going forward"
- Do not reference specific file paths, config values, or implementation details
- Only record significant, hard-to-reverse decisions — not preferences or experiments
- Status starts as `proposed`; moves to `accepted` after human review and merge
- Never edit an accepted ADR — create a new one to supersede it, and update `related`
