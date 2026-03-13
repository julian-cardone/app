# Documentation Overview

This directory contains all the documentation for the project. It is structured for discoverability, maintainability, and scalability, with intentional segmentation to discourage redundancy.

This document explains how the documentation is organized. This document is meant to orient, not explain implementation specifics.

## Start Here (Human or Machine)

Before proposing changes, writing code, or creating design artifacts:

1. Read this document.
2. Review relevant Standards.
3. Review relevant Architecture Decision Records (ADRs).
4. Confirm whether the work requires:
   - A Design document
   - An ADR
   - A Backlog entry

**IMPORTANT:** Do not introduce new structure, technologies, or conventions without verifying against existing documentation.

If uncertain, pause and consult with a senior person.

## Documentation Structure

Documentation is grouped into the following categories:

### Architecture Decision Records (`adrs/`)

Records significant, long-lived decisions that constrain future work.

- Captures _context_, _decision_, and _consequences_.
- Explains why a decision was made and discusses considered alternatives.
- Serves as historical record: never deleted, only _deprecated_ or _superseded_.

Use this directory to understand _why_ the system and processes are the way they are.

### Architecture (`architecture/`)

Describes the current structure of the system at a high level.

- Focuses on _what exists_ and _how major components relate_.
- Authoritative.
- Does not capture decision rationale.
- Represents _current state_ - No future designs are here.

Use this directory to understand the current shape of the system.

### Backlog (`backlog/`)

Captures ideas, experiments, and known issues that are not yet formalized.

- Not authoritative.
- Deleted when no longer relevant.
- Serves as a scratchpad for future work.

Use this directory to record ideas without committing to them.

### Design (`design/`)

Explores how features or changes may be implemented.

- Not authoritative.
- Often short-lived.
- This is where future design plans live.

Use this directory for _thinking and exploration_, not binding decisions.

### Runbooks (`runbooks/`)

Documents operational and procedural knowledge.

- How to perform tasks.
- How to troubleshoot issues.
- How to execute recurring processes.
- Authoritative.

Use this directory when performing or maintaining operational work.

### Standards (`standards/`)

Defines rules, conventions, and expectations contributors are expected to follow.

- Includes _coding standards_, _workflows_, and _documentation guidelines_.
- Updated in-place as practices evolve.
- Authoritative.

Use this directory to understand _how work should be done_.

### Technologies (`technologies/`)

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

## Single Source of Truth Rule

Do not duplicate information across documents.
If information exists elsewhere:

- Reference it.
- Do not restate it.

Redundancy creates drift. Drift creates confusion.
