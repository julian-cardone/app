# PR

Open a pull request for the current branch following the repository's PR format and Definition of
Done checklist.

## Read First

Read these documents in full before taking any action. Do not proceed from memory.

- `docs/agents/pr-format.md`
- `docs/process/done-criteria.md`
- `docs/process/git-workflow.md`

## Pre-flight

Verify all of the following before opening the PR. Stop and fix any failures before continuing.

1. **Branch** — follows `issue-<id>-<slug>` naming per `docs/process/git-workflow.md`.
2. **Issue** — originating issue exists (`gh issue view <id>`).
3. **Lint** — `npm run lint:md` passes with 0 errors.
4. **Doc changes** — run `/check-doc` on every modified `.md` file.
5. **Clean tree** — `git status` shows nothing uncommitted.
6. **Done criteria** — all applicable items in `docs/process/done-criteria.md` are satisfied.

## Open the PR

Draft the title and body per `docs/agents/pr-format.md`, confirm with the user, then:

```bash
gh pr create --title "<title>" --body "<body>"
```

Do not push directly to `main`. Do not self-approve. Do not merge.
