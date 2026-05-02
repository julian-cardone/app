# /start

Set up a new unit of work: issue, branch, and project board state.

## 1 — Derive title and labels

Argument may be a short phrase or a long description of intent. Derive:

- A concise issue title (Title Case, under ~8 words)
- The most appropriate `type:*` and `scope:*` labels from the lists below

**Type labels** (pick exactly one):

- `type:doc` — writing or changing documentation
- `type:adr` — the work will produce an Architecture Decision Record (explicit decision required)
- `type:design` — systems design work (pre-code)
- `type:tech-debt` — cleanup, refactors, paydown
- `type:chore` — setup, tooling, housekeeping, configuration

**Scope labels** (pick at least one):

- `scope:process` — standards, workflow, governance
- `scope:docs` — documentation system itself
- `scope:system-design` — architecture and design work
- `scope:infra` — CI, tooling, hosting

## 2 — Create the issue

```bash
gh issue create \
  --title "<title>" \
  --label "type:<x>" \
  --label "scope:<y>" \
  --body ""
```

Note the issue number from the output URL.

## 3 — Create the branch

Slug: lowercase title, hyphens only, no special characters, drop filler words, ~5 words max.

Format: `issue-<number>-<slug>`

```bash
git checkout -b issue-<number>-<slug> main
```

## 4 — Add to project board and set "In Progress"

```bash
gh project item-add 1 --owner @me --url <issue-url>
```

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

## 5 — Print summary

- Issue number and URL
- Branch name
- Project board status
- Next step: `claude --session issue-<number>-<slug>`
