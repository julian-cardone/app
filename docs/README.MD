# Documentation Overview

This directory contains all the documentation for the project. It is organized for discoverability, maintainability, and scalability, with intentional segmentation to discourage redundancy.

This document explains how the documentation is structured. This document is meant to orient, not explain specifics.

## Documentation Structure

Documentation is grouped into the following categories:

### Architecture Decision Records

Records significant, long-lived decisions that constrain future work.

- Captures _context_, _decision_, and _consequences_.
- Explains why a decision was made and discusses considered alternatives.
- Serves as historical record: never deleted, only _deprecated_ or _superseded_.

Use this directory to understand _why_ the system and processes are the way they are.

### Architecture

Describes the current structure of the system at a high level.

- Focuses on _what exists_ and _how major components relate_.
- Authoritative.
- Does not capture decision rationale.
- Represents _current state_ - No future designs are here.

Use this directory to understand the current shape of the system.

### Backlog

Captures ideas, experiments, and known issues that are not yet formalized.

- Not authoritative.
- Deleted when no longer relevant.
- Serves as a scratchpad for future work.

Use this directory to record ideas without committing to them.

### Design

Explores how features or changes may be implemented.

- Not authoritative.
- Often short-lived.
- This is where future design plans live.

Use this directory for _thinking and exploration_, not binding decisions.

### Runbooks

Documents operational and procedural knowledge.

- How to perform tasks.
- How to troubleshoot issues.
- How to execute recurring processes.
- Authoritative.

Use this directory when performing or maintaining operational work.

### Standards

Defines rules, conventions, and expectations contributors are expected to follow.

- Includes _coding standards_, _workflows_, and _documentation guidelines_.
- Updated in-place as practices evolve.
- Authoritative.

Use this directory to understand _how work should be done_.

### Technologies

Lists languages, frameworks, tools, and third-party services used by the project.

- Descriptive, not architectural: Explains _what_ is used, not _how it is wired_.
- Authoritative.

Use this directory to understand the project's technical landscape.

## How to Add Documentation

Before creating a new document:

1. Identify the intent of the information (decision, rule, explanation, exploration).
2. Choose the appropriate directory based on that intent.
3. Follow the documentation metadata standards defined in [standards/documentation-guidelines.md](./standards/documentation-guidelines.md).

**IMPORTANT:**
**Avoid duplicating information across multiple documents.**
If information already exists, reference it instead of restating it.

## Authority and Precedence

When documentation appears to conflict, use the following precedence:

1. Architecture Decision Records (ADRs).
2. Standards.
3. Architecture documentation.
4. Runbooks.

Design and backlog documents are non-authoritative and should not be treated as sources of truth.
