---
name: new-doc
description: Create a new documentation file with correct frontmatter, placed in the right directory
---

# New Documentation File

Use this skill when creating any new document under `docs/`.

## Step 1 — Choose the right directory

| doc_type       | Directory                             |
| -------------- | ------------------------------------- |
| `adr`          | `docs/adrs/` — use `/new-adr` instead |
| `architecture` | `docs/architecture/`                  |
| `agent`        | `docs/agents/`                        |
| `process`      | `docs/process/`                       |
| `standard`     | `docs/standards/`                     |
| `technology`   | `docs/technologies/`                  |
| `onboarding`   | `docs/onboarding/`                    |

If unsure which type fits, the directory names are self-describing. Use the table above.

## Step 2 — Use this frontmatter template

```yaml
---
title: <Human-readable title in Title Case>
doc_type: <value from table above>
status: draft
owners: ["@julian-cardone"]
last_reviewed: <today YYYY-MM-DD>
related: []
tags: []
---
```

New documents start as `draft`. Do not set `status: accepted` without explicit instruction.

## Step 3 — Validate

Run `/check-doc` before submitting.
