---
title: Technologies
doc_type: technology
status: draft
owners: ["@julian-cardone"]
tags: [technology, stack, tooling]
---

# Technologies

This directory documents the technologies used within the repository and their roles in the
development workflow.

Technology documents describe:

- the purpose of each tool or platform
- how the tool integrates with the development process
- operational considerations relevant to contributors

Technology documents are descriptive.

Repository rules, constraints, and workflow requirements are defined separately in the standards
under `docs/standards`.

## Technology Categories

Technologies are grouped according to their role in the development system.

---

# Platform

Platforms that host the repository and provide collaboration infrastructure.

## GitHub

GitHub provides the primary collaboration platform for the repository.

Responsibilities include:

- source control hosting
- issue tracking
- pull request workflows
- project boards
- repository governance features such as branch protection and CODEOWNERS

GitHub acts as the central coordination system for development activity.

---

# Development Assistance

Tools that assist contributors during development.

## GitHub Copilot

GitHub Copilot provides inline assistance within the editor environment.

Typical uses include:

- code suggestions
- boilerplate generation
- small refactors
- drafting documentation

Copilot is intended for lightweight assistance during normal development.

## Claude Code

Claude Code provides agentic assistance for broader development tasks.

Typical responsibilities include:

- repository exploration
- multi-file edits
- documentation updates
- refactoring assistance
- architectural or design draft generation

Claude Code is used when tasks require coordinated changes across multiple files or deeper
repository understanding.

---

# Automated Review

Tools that provide automated feedback during pull request review.

## GitHub Copilot Code Review

Copilot Code Review analyzes pull requests and provides automated feedback related to:

- code quality
- potential errors
- maintainability concerns
- suggested improvements

Automated feedback supplements human review but does not replace it.

---

# Automation and Continuous Integration

Systems that execute automated workflows in response to repository events.

## GitHub Actions

GitHub Actions provides the automation and continuous integration platform for the repository.

Typical responsibilities include:

- executing CI workflows
- validating documentation structure
- running repository validation checks
- enforcing repository quality gates

Automation ensures repository consistency and helps detect issues early.

---

# Repository Validation Tools

Tools used within CI workflows to validate documentation and configuration files.

## markdownlint-cli2

`markdownlint-cli2` enforces Markdown formatting consistency across repository documentation.

It helps maintain readability and ensures documentation follows established conventions.

## yamllint

`yamllint` validates YAML files and helps ensure configuration files such as GitHub workflows remain
syntactically correct and consistent.

## Custom Validation Scripts

Custom validation scripts are used to enforce repository-specific rules that general linting tools
cannot fully capture.

These checks may validate:

- documentation metadata structure
- ADR numbering conventions
- required repository documentation
- documentation organization rules

These scripts are executed through CI workflows.
