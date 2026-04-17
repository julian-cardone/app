---
title: "ADR-0004: AI and CI Tooling Stack"
doc_type: adr
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-04-15
related: ["docs/adrs/0003-ai-assisted-development.md"]
tags: [ai-agent, ci-cd, tooling]
---

# ADR-0004: AI and CI Tooling Stack

## Context

The repository is established with a documentation-first workflow prior to the introduction of
application code. The AI-assisted development workflow adopted in ADR-0003 requires a concrete
tooling stack to be effective. Tooling decisions made at this stage establish the baseline for all
future development activity and are costly to replace once workflows and conventions are built
around them.

The tooling must support in-editor development assistance, broader agentic development tasks,
automated pull request feedback, document formatting, documentation quality validation, and
automated CI enforcement. Operational complexity must remain proportionate to the current stage of
the project.

Using a single AI development tool was considered and rejected because no single tool adequately
covers both lightweight in-editor assistance and broader agentic multi-file workflows.

Deferring CI and validation tooling until application code exists was considered and rejected
because documentation and repository standards require automated enforcement from the start.

Introducing a more expansive toolset at this stage was considered and rejected because it would
increase workflow complexity before repository conventions are established.

## Decision

The repository adopts the following tooling stack to support the AI-assisted development workflow.

GitHub Copilot provides in-editor development assistance and automated pull request feedback. Claude
Code is used for agentic repository interaction and multi-file development tasks. Copilot
`@workspace` and Claude Code together serve as the approved pattern for codebase Q&A and document
retrieval. GitHub Actions serves as the CI and automation platform. Dependabot provides automated
dependency management. Pull request titles are validated against a conventional commit format using
a dedicated GitHub Action, enforced at the CI level rather than locally.

Prettier is used for automated document formatting. markdownlint-cli2 and Vale enforce documentation
structure and prose quality respectively. markdown-link-check validates hyperlink integrity across
all documents.

Individual tool configurations and version selections are implementation details and do not require
ADR-level decisions to change.

## Consequences

### Positives

- AI-assisted development capabilities are available from the start of the project.
- Documentation formatting and quality are enforced automatically rather than by convention.
- CI serves as the authoritative enforcement gate, reducing friction during local development.
- The stack is intentionally minimal and can be extended when an application technology is
  introduced.
- Separating in-editor assistance from agentic tooling keeps responsibilities between tools clear.

### Negatives

- The workflow depends on several independent tools rather than a single integrated platform.
- Contributors must run validation locally before opening pull requests, which requires discipline.
- Automated pull request feedback may produce suggestions that require human judgment to evaluate.

### Out of Scope

- This ADR does not define the application technology stack or language-specific tooling.
- This ADR does not define deployment infrastructure or runtime platforms.
- This ADR does not define branching strategy, pull request procedures, or git workflow rules.
- This ADR does not define documentation standards or repository governance policies.
- This ADR does not define the specific constraints or permissions governing AI tool usage.
