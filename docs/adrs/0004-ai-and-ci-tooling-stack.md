---
title: AI and CI Tooling Stack
doc_type: adr
status: draft
owners: ["@julian-cardone"]
tags: [adr, ai, ci, workflow]
---

# ADR-0004: AI and CI Tooling Stack

## Context

The repository is being established with a documentation-first workflow prior to the introduction of
application code.

Development activity currently focuses on documentation, repository governance, and workflow
definition within:

- `docs/`
- `.github/`
- repository configuration files

An AI-assisted development workflow and continuous integration system are required to support this
process.

The tooling must support:

- documentation authoring and maintenance
- in-editor development assistance
- larger agentic development tasks
- automated pull request review feedback
- automated repository validation through CI
- minimal operational complexity while the application stack remains undecided

Several alternative approaches were considered.

Using a single AI development tool would simplify the toolchain but would reduce flexibility between
lightweight editor assistance and broader agentic workflows.

Deferring CI tooling decisions until application code exists would leave documentation and
repository standards without automated validation.

Introducing multiple automated review tools or AI agents at this stage would increase workflow
complexity before repository conventions are established.

A small set of complementary tools was therefore required.

## Decision

The repository development workflow is constrained to the following tooling stack.

### AI-assisted development

- GitHub Copilot is used for in-editor development assistance.
- Claude Code is used for agentic repository interaction and multi-file development tasks.
- GitHub Copilot Code Review is used for automated pull request feedback.

### Continuous integration and automation

- GitHub Actions is used as the repository CI and automation platform.

### Repository validation

- Markdown formatting is validated using `markdownlint-cli2`.
- YAML configuration files are validated using `yamllint`.
- Repository-specific rules are enforced through custom validation scripts executed in CI.

These tools form the baseline automation and AI-assisted workflow for the repository.

## Consequences

### Positives

- AI-assisted development capabilities are available from the beginning of the project.
- Documentation quality and repository structure can be validated automatically.
- Responsibilities between AI tools and automation systems remain clearly separated.
- The CI platform can be extended later when the application technology stack is introduced.
- Repository workflows remain mostly technology-agnostic during early development.

### Negatives

- The workflow introduces several independent tools rather than a single integrated platform.
- Automated AI review may produce suggestions that require human judgment.
- Repository-specific validation rules must be maintained alongside the CI configuration.

### Out of Scope

This ADR does not define:

- the application technology stack
- language-specific linting, testing, or build tooling
- deployment infrastructure or runtime platforms
- detailed workflow rules for pull requests or branching
- documentation standards or repository governance policies
