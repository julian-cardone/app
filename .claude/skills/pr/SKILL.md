# PR

Open a pull request for the current branch following the repository's PR format and
Definition of Done checklist.

## Instructions

Read `docs/agents/pr-format.md` and `docs/process/done-criteria.md` before proceeding. Apply
those rules exactly.

## Pre-flight Checklist

Before opening the PR, verify all of the following. Stop and fix any failures before continuing.

1. **Branch** — confirm the current branch follows `issue-<id>-<slug>` naming.
2. **Issue** — confirm the originating GitHub issue exists (`gh issue view <id>`).
3. **Lint** — run `npm run lint:md`. All errors must be resolved.
4. **Doc changes** — if any `.md` files were modified, run `/check-doc` on each one.
5. **Worktree / uncommitted changes** — run `git status`. Working tree must be clean.
6. **Done criteria** — verify the applicable requirements in `docs/process/done-criteria.md`:
   - General: issue referenced, description follows template, change fulfills issue intent,
     docs updated where required.
   - If docs changed: correct directory, valid metadata, no duplication, valid links.
   - If architecture changed: ADR drafted, diagrams updated.

## PR Title

Format: `<type>(<scope>): <short description>`

Valid types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`

Examples:

- `docs(process): add session and worktree management guide`
- `chore(ci): fix required file paths in doc-checks workflow`

The title becomes the squash commit message — make it accurate.

## PR Body

Use this template exactly:

```markdown
## Summary

<!-- What changed and why -->

## Changes

<!-- List of specific changes made -->

## Verification

<!-- How this was tested or verified (e.g., CI passes, linting ran, /check-doc passed) -->

## Related

<!-- Closes #<id> or Relates to #<id> -->
```

## Opening the PR

Once all pre-flight checks pass and title/body are confirmed by the user:

```bash
gh pr create --title "<title>" --body "<body>"
```

Do not push directly to `main`. Do not self-approve. Do not merge.
