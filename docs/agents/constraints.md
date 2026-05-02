---
title: Agent Constraints
doc_type: agent
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-04-15
related: ["docs/agents/capabilities.md", "docs/process/ownership.md", "docs/process/git-workflow.md"]
tags: [ai-agent, governance, tooling]
---

# Agent Constraints

This document defines what AI agents must not do in this repository. Read this alongside
[Agent Capabilities](./capabilities.md), which defines what agents are permitted to do.

## Git Constraints

Agents must not:

- Push directly to `main`
- Approve or merge pull requests
- Use `--no-verify` or any mechanism to bypass git hooks or CI checks
- Force push to any branch
- Delete branches without explicit instruction

## Documentation Constraints

Agents must not:

- Introduce tags outside the approved vocabulary defined in
  [Documentation Standards](../standards/documentation.md)
- Duplicate information that already exists in another document
- Delete or deprecate documents without explicit instruction
- Modify accepted ADRs — new decisions require a new ADR
- Change document status without explicit instruction

## Scope Constraints

Agents must not:

- Make architectural decisions unilaterally — these require an ADR and human review
- Assume an application technology stack has been selected unless explicitly informed
- Introduce dependencies, languages, or frameworks without explicit instruction
- Take irreversible actions without explicit confirmation from a human contributor
- Act on ambiguous instructions — when intent is unclear, stop and ask for clarification

## Review Constraints

Agents must not approve or merge their own pull requests. All AI-generated changes require human
review before merging.
