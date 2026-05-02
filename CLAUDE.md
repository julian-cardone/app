# CLAUDE.md

Documentation-first repo. No application code yet. All governance lives in `docs/`.

## Rules

- Never push to `main` directly, approve, or merge PRs — all changes require human review.
- Branch format: `issue-<id>-<slug>`
- Never edit an accepted ADR. Create a superseding one only when explicitly instructed.
- After changes to CI, tooling config, or architecture: verify related docs don't need updating.

## Reference

Load only when the task requires it.

| Task                            | Read                                                                                                     |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Agent scope / action edge cases | `docs/agents/capabilities.md`, `docs/agents/constraints.md`                                              |
| Ownership / review routing      | `docs/process/ownership.md`                                                                              |
| Creating or editing a doc       | `docs/standards/documentation.md`, `docs/process/doc-governance.md`                                      |
| Drafting an ADR                 | `docs/adrs/_template.md`, `docs/process/doc-governance.md`                                               |
| Commit message                  | `docs/process/commit-messages.md`                                                                        |
| Branching / session setup       | `docs/process/git-workflow.md`, `docs/process/session-worktree-management.md`                            |
| Creating a GitHub issue         | `docs/process/project-management.md`                                                                     |
| Opening a PR                    | `docs/process/pr-format.md`, `docs/process/done-criteria.md`                                             |
| PR includes doc changes         | Run `/check-doc` on each modified doc first                                                              |
| CI / tooling                    | `docs/process/ci-pipeline.md`, `docs/technologies/stack.md`                                              |
| Architectural context           | `docs/adrs/` in numerical order                                                                          |
| Application code                | `docs/standards/coding.md`, `docs/standards/folder-structure.md`, `docs/standards/naming-conventions.md` |
| Security-sensitive work         | `docs/standards/security.md`                                                                             |
| Tests                           | `docs/standards/testing.md`                                                                              |
