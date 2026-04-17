# AI Contributor Instructions

This repository uses an AI-assisted development workflow. The authoritative rules for all AI
contributors are in `CLAUDE.md` and `docs/standards/`. This file contains Copilot-specific guidance
only.

## AI Tool Roles

**GitHub Copilot** — lightweight in-editor assistance: drafting documentation, suggesting small
edits, applying conventions.

**Claude Code** — broader agentic tasks: repository exploration, multi-file edits, structural
changes.

**Copilot Code Review** — automated pull request feedback. Does not replace human review.

## Workflow Constraints

All changes must:

- originate from a GitHub issue
- be submitted through a pull request
- pass CI checks
- receive human review

AI tools must not approve or merge pull requests.

## Review Gate

All AI-generated changes require human review via pull request before merging. AI tools must not
push directly to `main`, approve pull requests, or merge pull requests.
