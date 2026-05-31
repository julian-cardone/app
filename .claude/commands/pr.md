# /pr

Open a pull request for the current branch.

## Pre-flight

1. Extract `<id>` from the branch name (`issue-<id>-<slug>`). If the branch name does not match this
   format, stop immediately and report the error. Do not create an issue.
2. Run `gh issue view <id>` — confirm it exists and capture: title, assignees, labels. If the issue
   is not found, stop immediately and report the error.
3. Run `git status` — if there are uncommitted changes, run
   `git add -A && git commit -m "<type>(<scope>): <brief description>"`.
4. Run `git push`.

## Labels

Copy all `type:*` and `scope:*` labels from the issue directly onto the PR.

Also add these based on `git diff main...HEAD --name-only`:

| If diff contains         | Add label        |
| ------------------------ | ---------------- |
| `package.json`/lockfile  | `dependencies`   |
| `.github/workflows/`     | `github_actions` |
| `.js`/`.ts`/`.tsx` files | `javascript`     |

## Title

`<type>(<scope>): <short description>`

- Type: map `type:*` label → `docs` `feat` `fix` `chore` `refactor` `test` `ci`
  - `type:doc` → `docs`
  - `type:adr` → `docs`
  - `type:design` → `docs`
  - `type:tech-debt` → `refactor`
  - `type:chore` → `chore`
- Scope: map `scope:*` label → `docs` `process` `system-design` `infra`

## Create

```bash
gh pr create \
  --title "<title>" \
  --assignee "<assignee from issue, or @me if unassigned>" \
  --label "<labels>" \
  --body "<body>"
```

Do not add `--project`. Pull requests are not tracked on the project board — only issues are. Do not
self-approve. Do not merge.

## Board update

After the PR is created, move the issue to **Review** on the project board.

Query the project to get IDs:

```bash
gh api graphql -f query='
{
  viewer {
    projectV2(number: 1) {
      id
      items(first: 50) {
        nodes {
          id
          content { ... on Issue { number } }
        }
      }
      fields(first: 20) {
        nodes {
          ... on ProjectV2SingleSelectField {
            id name
            options { id name }
          }
        }
      }
    }
  }
}'
```

Extract:

- `projectId` — the project node ID
- `itemId` — the item where `content.number` matches `<id>`
- `statusFieldId` — the `id` of the field named "Status"
- `reviewOptionId` — the `id` of the option named "Review"

Then update status:

```bash
gh api graphql -f query='
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: "<projectId>"
    itemId: "<itemId>"
    fieldId: "<statusFieldId>"
    value: { singleSelectOptionId: "<reviewOptionId>" }
  }) {
    projectV2Item { id }
  }
}'
```

If the mutation returns errors, print them and stop.

## Body template

```markdown
## Summary

<!-- What changed and why -->

## Changes

<!-- List of specific changes made -->

## Related

Closes #<id>

## Documentation Updates

<!-- Note any documentation updates, or write "Not applicable" -->

## ADR Requirement

<!-- Note whether an ADR was created, superseded, or not required -->

## Definition of Done

<!-- Confirm the relevant done criteria were satisfied -->
```
