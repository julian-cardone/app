# Copilot Instructions

This is the Placecard repository. Placecard is a friendship-first mobile app (iOS and Android) that
matches NYC young professionals through shared real-world plans — restaurant reservations, concert
tickets, and event invites. Every match is tied to a verified, dated plan. Users specify Platonic or
Romantic intent upfront. The initial launch is scoped to New York City.

`docs/` is the source of truth. Structure, frontmatter, formatting, and prose quality are enforced
by CI — do not repeat those rules in suggestions or reviews.

---

## Writing Style

Use declarative, neutral, impersonal prose. Avoid first-person language (`I`, `we`, `our`),
speculative phrasing (`likely`, `probably`), and opinionated language. Write for durability — as if
the document will be read years from now without the context of the current task.

---

## Content Rules

Do not duplicate information across documents. If a concept is defined in one doc, link to it rather
than restating it.

When a PR changes behavior, process, or architecture, the relevant docs must be updated in the same
PR. Flag any PR that modifies behavior without a corresponding doc update.

Never edit an accepted ADR. A new ADR must be created to supersede it.

Do not make architectural decisions in documentation without an ADR and explicit human approval.

---

## Review Focus

CI handles structure, frontmatter, formatting, and prose style. Focus reviews on what CI cannot
catch:

- Information duplicated from another document that should be a link instead
- Behavior, process, or architecture changes without a corresponding doc update in the same PR
- Edits to accepted ADRs (flag immediately — these must be rejected via new ADR)
- Statements that contradict another document in the repository
- Speculative or opinionated content that slipped past Vale
