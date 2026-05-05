---
title: ADR Template
doc_type: adr
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-05-02
related: []
tags: [documentation, governance]
---

# ADR Template

Architecture Decision Records (ADRs) document significant, long-lived decisions that constrain
future work.

An ADR should be written only when a decision:

1. Is hard or costly to reverse.
2. Constrains future design or process choices.
3. Would reasonably be debated or questioned later.

ADRs are not used for preferences, temporary experiments, or implementation details.

---

## Before Writing

Read [Documentation Standards](../standards/documentation.md) for metadata requirements, writing
tone, and formatting rules. Read [Documentation Governance](../process/doc-governance.md) for
lifecycle rules, status transitions, supersession procedure, and deletion policy.

ADRs may name specific tools, vendors, or systems when doing so is necessary to make the context or
decision intelligible. ADRs must not reference repository-internal artifacts: file paths,
configuration filenames, scripts, or documentation files. The `related` field must contain only
paths to other ADRs.

ADR filenames follow the pattern `XXXX-decision-title.md` where `XXXX` is a four-digit sequence
number with leading zeros. Sequence numbers are never reused.

---

## Template

Copy the block below into a new file in `docs/adrs/`.

```markdown
---
title: "ADR-XXXX: Decision Title"
doc_type: adr
status: proposed
owners: ["@github-handle"]
last_reviewed: YYYY-MM-DD
related: []
tags: []
---

# ADR-XXXX: Decision Title

## Context

Describe the situation that led to this decision. Assume the reader has no prior context. Be
factual, neutral, and time-aware.

Include:

- The problem being solved.
- Relevant constraints (team size, scale, cost, time).
- Why this decision is needed now.
- Alternatives that were considered and why they were not chosen.

## Decision

State the decision clearly and unambiguously in declarative prose. Define the scope of applicability
— what areas, contexts, or types of work the decision constrains. Avoid implementation details.

## Consequences

### Positives

List direct benefits and capabilities enabled by this decision.

- Positive outcome

### Negatives

List trade-offs, limitations, or ongoing costs introduced by this decision.

- Negative outcome

### Out of Scope

State explicitly what related decisions are not made by this ADR.

- Excluded item

## Notes (optional)

Reserved for clarifications that emerged during review but do not change the decision itself. If a
note would alter the decision's meaning or scope, the ADR must be superseded instead.
```
