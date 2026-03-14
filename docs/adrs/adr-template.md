---
title: ADR Template
doc_type: adr
status: draft
owners: ["@julian-cardone"]
tags: [standards]
---

# ADR Template

Architecture Decision Records (ADRs) document **significant, long-lived decisions** that constrain
future work.

An ADR should be written only when a decision:

1. Is hard or costly to reverse.
2. Constrains future design or process choices.
3. Would reasonably be debated or questioned later.

ADRs are not used for preferences, temporary experiments, or implementation details. ADRs should be
written in an impersonal, durable tone. Avoid first-person language (e.g., "we"), speculative
phrasing (e.g., "likely", "probably", "in the future"), and expressions of opinion. ADRs should
describe decisions as objective constraints based on context at the time, not as personal or
time-bound judgments.

Below is the template and guidelines for creating an ADR.

---

# ADR-XXXX: { Decision Title }

## Context

Describe the situation that led to this decision.

Include:

- The problem being solved.
- Relevant constraints (team size, scale, cost, time).
- Why this decision is needed now.
- Reasonable alternatives that were considered and why they were not chosen.

Assume the reader has no prior context.  
Be factual, neutral, and time-aware. Avoid advocacy or speculative language.

## Decision

State the decision clearly and unambiguously.

The decision should:

- Be written in declarative language.
- Describe the constraint being introduced.
- Define the scope of applicability.
- Avoid implementation details.

This section should be concise and mechanically clear.

## Consequences

### Positives

List the direct benefits and capabilities enabled by this decision.

Focus on concrete outcomes and effects that follow from the decision.

- Positive outcome

### Negatives

List the trade-offs, limitations, or ongoing costs introduced by this decision.

Be honest and concise.

- Negative outcome

### Out of Scope

Explicitly state what related decisions are _not_ made by this ADR.

Use this section to prevent ambiguity, scope creep, or accidental assumptions.

- Excluded item

## Notes (Optional)

Include clarifications, references, or follow-up considerations that provide additional context but
do not change the decision itself.
