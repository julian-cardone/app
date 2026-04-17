# CLAUDE.md

Documentation-first repo. All governance lives in `docs/`. No application code exists yet.

---

## Core Rules

- All changes go through a pull request and require human approval before merging. Never push
  directly to `main`, approve, or merge pull requests.
- Branches: `issue-<id>-<slug>` (e.g., `issue-12-add-auth-design`).
- Verify: `npm run lint:md` (hook runs this automatically after edits).
- All docs are writable. New ADRs in `docs/adrs/` only when explicitly instructed; never edit an
  accepted ADR — create a new one to supersede it.
- After changes to CI workflows, tooling config, branching/PR conventions, or architecture: check
  whether any related docs need updating.

---

## Compaction

When compacting, preserve: current branch name, list of modified files, and lint status.

---

## Reference Docs

Read these only when the task calls for it — do not load all of them upfront.

| When                                        | Read                                                                                                     |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| GitHub CLI scope or agent action edge cases | `docs/agents/capabilities.md`, `docs/agents/constraints.md`                                              |
| Ownership or review routing                 | `docs/agents/ownership.md`                                                                               |
| Creating or editing a doc                   | `docs/standards/documentation.md`, `docs/process/doc-governance.md`                                      |
| Drafting a new ADR                          | `docs/adrs/_template.md`, `docs/process/doc-governance.md`                                               |
| Writing a commit message                    | `docs/process/commit-messages.md`                                                                        |
| Starting work / branching                   | `docs/process/git-workflow.md`                                                                           |
| Starting work / session and worktree setup  | `docs/process/session-worktree-management.md`                                                            |
| Creating a GitHub issue                     | `docs/process/project-management.md`                                                                     |
| Opening a PR                                | `docs/agents/pr-format.md`, `docs/process/done-criteria.md`                                              |
| PR includes doc changes                     | run `/check-doc` on each modified doc first                                                              |
| CI or tooling questions                     | `docs/process/ci-pipeline.md`, `docs/technologies/stack.md`                                              |
| Architectural context                       | `docs/adrs/` in numerical order                                                                          |
| Writing application code                    | `docs/standards/coding.md`, `docs/standards/folder-structure.md`, `docs/standards/naming-conventions.md` |
| Security-sensitive work                     | `docs/standards/security.md`                                                                             |
| Writing tests                               | `docs/standards/testing.md`                                                                              |
