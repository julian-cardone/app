# /check-doc

Validate a documentation file before opening a PR. If an argument is provided, validate that file.
Otherwise validate all modified `.md` files in the current branch.

## Steps

1. Set `last_reviewed` to today's date on each file.
2. Check writing tone: flag and fix any first-person pronouns (`I`, `we`, `our`) and speculative
   phrasing (`likely`, `probably`, `eventually`). Rewrite flagged sentences in declarative, neutral
   tone.
3. Run `npm run lint:md` and fix all errors.
4. Run `npm run format:md`.
5. Run `npm run check:links` and report any broken links.
