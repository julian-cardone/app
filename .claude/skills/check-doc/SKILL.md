---
name: check-doc
description:
  Validate a documentation file before submitting changes. Run before every PR that includes doc
  changes.
---

# Check Doc

Run before submitting any documentation change. If `$ARGUMENTS` is provided, validate that specific
file. Otherwise validate all modified docs in the current branch.

## Checklist

1. Update `last_reviewed` to today's date.
2. Confirm frontmatter is healthy — see `docs/standards/documentation.md`.
3. Confirm writing standards are met — see `docs/standards/documentation.md`.
4. Confirm no information is duplicated — see `docs/process/doc-governance.md`.
5. Verify all file paths referenced in the document exist.
6. Run `npm run lint:md` and fix all errors.
