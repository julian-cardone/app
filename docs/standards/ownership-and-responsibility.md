---
title: Ownership and Responsibility
doc_type: standard
status: draft
owners: ["@julian-cardone"]
tags: [ownership, responsibility, standards]
---

# Ownership and Responsibility

This document defines ownership expectations for the repository and its documentation. Its purpose
is to make decision-making, review, and maintenance responsibilities clear, even when work is
assisted by AI tools.

## Principles

Ownership exists to create accountability, not bureaucracy.

The owner of a document, workflow, or area is responsible for its accuracy, maintenance, and review
quality. AI tools may help produce or update content, but responsibility always remains with a human
owner.

## Repository Ownership

The repository owner is responsible for the overall structure, standards, and quality gates of the
project.

Repository ownership includes:

- maintaining the repository structure
- maintaining GitHub settings and automation
- approving changes to core standards
- ensuring documentation remains coherent and current

## Document Ownership

Every standards, architecture, design, ADR, runbook, or backlog document should include one or more
owners in its metadata header.

Document owners are responsible for:

- keeping the document accurate
- reviewing proposed changes for correctness
- updating the document when related decisions or workflows change
- rejecting changes that introduce drift, ambiguity, or contradictions

## Code and Automation Ownership

When application code, scripts, workflows, or automation are added, each area should have a clearly
understood owner.

Owners are responsible for:

- reviewing changes in their area
- maintaining quality and correctness
- updating related documentation when behavior changes
- ensuring automation reflects the documented workflow

## AI-Assisted Work

AI-generated content does not own itself and does not approve itself.

When AI is used to create or modify code, workflows, or documentation, the human submitting the
change is responsible for:

- reviewing the full output
- validating correctness
- checking for unintended changes
- ensuring the result follows repository standards
- updating documentation when needed

## Review Responsibility

Reviewers are responsible for validating that a change is appropriate for the repository, not just
that it “looks reasonable.”

Review responsibility includes:

- checking whether the change matches the documented workflow
- checking whether related documentation was updated
- identifying missing context, unclear ownership, or weak validation
- requesting revision when standards are not met

## Ownership Changes

Ownership should be updated when responsibility genuinely changes.

This may happen when:

- a new maintainer takes over an area
- a document changes scope significantly
- a new workflow or subsystem is introduced
- repository responsibilities are redistributed

Ownership changes should be reflected in document metadata and, where applicable, in repository
review rules such as CODEOWNERS.

## Minimum Rule

If a file, workflow, or decision matters, it must have a clearly understood human owner.
