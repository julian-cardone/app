---
title: ADR Template
doc_type: adr
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-03-29
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

ADRs must be written in an impersonal, durable tone. Avoid first-person language (`we`, `I`),
speculative phrasing (`likely`, `probably`, `in the future`), and expressions of opinion. Describe
decisions as objective constraints based on context at the time.

ADRs must not reference specific files, configurations, documentation, or any implementation
artifact. These references drift and would require superseding an otherwise valid ADR. ADRs may
reference other ADRs in the `related` field, as ADRs are equally timeless.

Status transition rules and deletion policy are defined in the documentation governance process
document.

---

## Template

Copy the block below into a new file named `XXXX-decision-title.md` in `docs/adrs/`. Optional fields
(`related`, `tags`) must remain in the frontmatter with empty values rather than being removed.

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

State the decision clearly and unambiguously in declarative prose. Describe the constraint being
introduced and define its scope of applicability. Avoid implementation details.

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

Clarifications or follow-up considerations that provide additional context but do not change the
decision itself.
```
