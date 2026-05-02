# /pr

Open a pull request for the current branch.

## Pre-flight

1. Extract `<id>` from the branch name (`issue-<id>-<slug>`). If the branch name does not match
   this format, stop immediately and report the error. Do not create an issue.
2. Run `gh issue view <id>` — confirm it exists and capture: title, assignees, labels. If the issue
   is not found, stop immediately and report the error.
3. Run `git status` — if there are uncommitted changes, run
   `git add -A && git commit -m "<type>(<scope>): <brief description>"`.
4. Run `git push`.

## Labels

Copy all `type:*` and `scope:*` labels from the issue directly onto the PR.

Also add these based on `git diff --name-only`:

| If diff contains        | Add label        |
| ----------------------- | ---------------- |
| `package.json`/lockfile | `dependencies`   |
| `.github/workflows/`    | `github_actions` |
| `.js`/`.ts` files       | `javascript`     |

## Title

`<type>(<scope>): <short description>`

- Type: map `type:*` label → `docs` `feat` `fix` `chore` `refactor` `test` `ci`
- Scope: map `scope:*` label → `docs` `process` `system-design` `infra`

## Create

```bash
gh pr create \
  --title "<title>" \
  --assignee "<assignee from issue, or @me if unassigned>" \
  --label "<labels>" \
  --project "app" \
  --body "<body>"
```

Use the body template below. Do not self-approve. Do not merge.

## Body template

```markdown
## Summary

## Changes

## Related

Closes #<id>
```
