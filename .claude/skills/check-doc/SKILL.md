---
name: check-doc
description:
  Validate a documentation file before submitting changes. Run before every PR that includes doc
  changes.
---

# Check Doc

Run before submitting any documentation change. If `$ARGUMENTS` is provided, validate that specific
file. Otherwise validate all modified docs in the current branch.

## Instructions

Read each source document listed below before applying its rules. Do not paraphrase or apply rules
from memory.

## Checklist

1. Set `last_reviewed` to today's date.
2. Validate frontmatter against the rules in `docs/standards/documentation.md`. Apply those rules
   exactly — do not infer or supplement them.
3. Validate writing standards against the rules in `docs/standards/documentation.md`. Apply those
   rules exactly.
4. Validate that no information is duplicated per the rules in `docs/process/doc-governance.md`.
5. Verify every relative file path referenced in the document body and `related` field exists on
   disk.
6. Run `npm run lint:md` and fix all errors.
