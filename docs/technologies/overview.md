---
title: Technology Overview
doc_type: technology
status: draft
owners: ["@julian-cardone"]
tags: [overview]
---

# Technology Overview

This document gives an overview of the `technology/` directory in the project's documentation. Documents found in this directory are descriptive, not prescriptive, and may change without ADRs. When conflicts arise, ADRs override these docs.

## Guiding Principles

The drivers behind the technology selection process are as follows:

- Simplicity: Avoid unnecessary complexity.
- Modularity: It should be composable and easy to swap in or out.
- Suppport for automation and AI-assisted workflows.
- Familiarity: Is there a suitable option that is already known by the team?
- Scalability: The technology should scale apprpriately with expected business growth.
- Portability: It should not require special implementation or hardware.

## Technology Categories

Technologies are grouped by responsibility. Each document in this directory represents a technical purpose, listed below:

- Application layer
- API & transport
- Data storage
- Caching & rate limiting
- Authentication & authorization
- Background processing
- Observability
- Infrastructure
- Third-party services

## Capabilities Document

The [capabilities.md](./capabilities.md) document maps technology categories to the technologies that currently support them. This document is descriptive and may evolve as technologies are evaluated or replaced.

## Technology Document Lifecycle

Technology documents should be added as new processes and layers emerge. If a document is obsolete, it should be deleted. If a document is to be updated, it should be done in-place.

## Technology Document Format

TODO: how to write these documents, the tone, etc...
