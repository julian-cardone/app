---
name: start
description: Start a new unit of work. Creates a GitHub issue, branch, and project board entry. Use when beginning any new task — triggered by "/start <description>" or phrases like "working on new issue: <description>", "start work on <description>", "new issue: <description>".
---

# Start New Work

Sets up everything needed before writing any code or docs: issue, branch, and project board state.

## Read First

Read these documents in full before taking any action. Do not proceed from memory.

- `docs/process/project-management.md`
- `docs/process/git-workflow.md`
- `docs/process/session-worktree-management.md`

## Steps

### 1 — Confirm title and labels

Use the description from the skill argument as the proposed issue title. Show the user the
available labels:

```bash
gh label list
```

Ask the user to confirm:

- The issue title (refine if needed)
- Exactly one `type:*` label
- At least one `scope:*` label

Do not proceed until labels are confirmed.

### 2 — Create the issue

```bash
gh issue create \
  --title "<confirmed title>" \
  --label "type:<x>" \
  --label "scope:<y>" \
  --body ""
```

Note the issue number from the output URL.

### 3 — Create the branch

Derive the slug: lowercase the title, replace spaces/punctuation with hyphens, drop filler words,
keep it under ~5 words.

```bash
git checkout -b issue-<number>-<slug> main
```

### 4 — Add to project board and move to "In Progress"

Look up IDs dynamically — do not hard-code them:

```bash
# Get project node ID, item IDs, and Status field/option IDs
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
            id
            name
            options { id name }
          }
        }
      }
    }
  }
}'
```

If the issue does not appear in the item list, add it first:

```bash
gh project item-add 1 --owner @me --url <issue-url>
```

Then update Status to "In Progress":

```bash
gh api graphql -f query='
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: "<project-id>"
    itemId: "<item-id>"
    fieldId: "<status-field-id>"
    value: { singleSelectOptionId: "<in-progress-option-id>" }
  }) {
    projectV2Item { id }
  }
}'
```

### 5 — Confirm and remind about session

Print a summary:

- Issue number and URL
- Branch name
- Project board status

Then remind the user:

> Per `docs/process/session-worktree-management.md`: for sequential work (no other tasks in
> progress), check out the branch and open or reuse a named session scoped to it. For parallel
> work or agent tasks, create a worktree first.
>
> Named session example: `claude --session issue-<number>-<slug>`
