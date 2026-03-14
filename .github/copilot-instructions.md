# AI Contributor Instructions

This repository uses a structured documentation system and AI-assisted workflow. AI tools may assist
with development, but all changes remain the responsibility of the human contributor submitting
them.

## Repository Orientation

Most work in this repository currently occurs in the `docs/` directory and supporting repository
configuration.

AI contributors should prioritize:

- improving existing documentation
- maintaining repository structure
- following documented standards

Before generating changes, review relevant standards in:

docs/standards/

These documents define repository workflow, documentation conventions, and contribution
expectations.

## Documentation Structure

Documentation files must follow the metadata format defined in:

docs/standards/documentation-guidelines.md

Each document must contain frontmatter metadata similar to:

- title:
- doc_type:
- status:
- owners:
- tags:

AI contributors should not remove required metadata fields.

## AI Tool Roles

The repository uses multiple AI tools with different responsibilities.

### GitHub Copilot

Used for lightweight in-editor assistance such as:

- drafting documentation
- suggesting small edits
- applying repository conventions

### Claude Code

Used for broader agentic tasks including:

- repository exploration
- multi-file edits
- larger structural changes

### Copilot Code Review

Provides automated pull request feedback.

AI feedback does not replace human review.

## Contribution Expectations

AI-assisted contributions should:

- follow repository standards
- make small, intentional changes
- avoid unnecessary duplication
- preserve existing document structure

If a change affects architecture, workflow, or system behavior, related documentation should be
updated.

## Architecture Decisions

Significant architectural or workflow changes must follow the ADR process defined in:

docs/adrs/

Accepted ADRs should not be edited.  
New decisions should be recorded in a new ADR.

## Restricted Areas

The following directories define repository governance and operational procedures.

AI contributors must not modify these areas unless explicitly instructed by a human contributor:

- .github/
- docs/standards/
- docs/runbooks/
- docs/technologies/

Changes to these locations should generally be authored or explicitly approved by a human
contributor.

## Workflow Constraints

All changes must:

- originate from a GitHub issue
- be submitted through a pull request
- pass CI checks
- receive human review

AI tools must not approve or merge pull requests.

## Technology Assumptions

The application technology stack has not yet been selected.

AI contributors should avoid introducing assumptions about specific languages, frameworks, or
infrastructure unless explicitly requested.
