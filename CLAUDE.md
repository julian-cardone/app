# CLAUDE.md

Monorepo. Application code lives in `app/`. All governance lives in `docs/`.

## Repo structure

| Path                 | Purpose                                                |
| -------------------- | ------------------------------------------------------ |
| `app/`               | React Native / Expo mobile app (the product)           |
| `docs/adrs/`         | Architecture decision records                          |
| `docs/agents/`       | Agent capabilities, constraints, and cost optimization |
| `docs/process/`      | Git workflow, PR format, CI pipeline, dependency management, governance |
| `docs/standards/`    | Coding and documentation standards                     |
| `docs/technologies/` | Approved stack and tooling                             |
| `.claude/skills/`    | Agent skills for this repo                             |

## Rules

- Never push to `main`, approve, or merge PRs.
- Never edit an accepted ADR — create a superseding one instead.
- When any file changes, update everything that depends on it in the same PR — related docs, skills,
  and commands.
- Load reference docs on demand — do not read all of `docs/` upfront.
- When writing app code, work inside `app/`. Do not create application files at the repo root.

## Reference

Load only when the task requires it.

| Task                                                          | Read                                         | Skill                                              |
| ------------------------------------------------------------- | -------------------------------------------- | -------------------------------------------------- |
| What agents are permitted to do                               | `docs/agents/capabilities.md`                |                                                    |
| What agents must not do                                       | `docs/agents/constraints.md`                 |                                                    |
| Who owns what and what that means for review                  | `docs/process/ownership.md`                  |                                                    |
| Creating issues, applying labels, project board states        | `docs/process/project-management.md`         |                                                    |
| Branch naming, merge strategy, enforcement                    | `docs/process/git-workflow.md`               |                                                    |
| Metadata format, writing tone, formatting rules               | `docs/standards/documentation.md`            |                                                    |
| When to create, update, or delete docs; lifecycle transitions | `docs/process/doc-governance.md`             |                                                    |
| Writing or superseding an ADR                                 | `docs/adrs/_template.md`                     |                                                    |
| PR title format, body template, issue linking                 | `docs/process/pr-format.md`                  |                                                    |
| Merge criteria and reviewer checklist                         | `docs/process/done-criteria.md`              |                                                    |
| Workflow definitions and what each CI job checks              | `docs/process/ci-pipeline.md`                |                                                    |
| Dependency update policy, Dependabot process, Expo compat     | `docs/process/dependency-management.md`      |                                                    |
| Approved tools, their purpose, and rationale                  | `docs/technologies/stack.md`                 |                                                    |
| How tasks are routed across model tiers (cost control)        | `docs/agents/model-cost-optimization.md`     |                                                    |
| Why decisions were made and what they constrain               | `docs/adrs/` in numerical order              |                                                    |
| Web component styling conventions                             | `docs/standards/web-css.md`                  | `.claude/skills/web-css/SKILL.md`                  |
| Web flex layout, overflow, and scroll ownership               | `docs/standards/web-layout.md`               | `.claude/skills/web-layout/SKILL.md`               |
| Mobile component styling (StyleSheet, tokens, variants)       | `docs/standards/mobile-styles.md`            | `.claude/skills/mobile-styles/SKILL.md`            |
| Mobile flex layout, shrinking, scroll, safe areas             | `docs/standards/mobile-layout.md`            | `.claude/skills/mobile-layout/SKILL.md`            |
| Component architecture, state ownership, abstraction rules    | `docs/standards/frontend-philosophy.md`      | `.claude/skills/frontend-philosophy/SKILL.md`      |
| Web folder structure, module boundaries, public surfaces      | `docs/standards/web-project-structure.md`    | `.claude/skills/web-project-structure/SKILL.md`    |
| Mobile folder structure, navigation, screens, assets          | `docs/standards/mobile-project-structure.md` | `.claude/skills/mobile-project-structure/SKILL.md` |
| Placecard UI/UX spec and screen design decisions              | `docs/product/placecard_uiux.md`             |                                                    |
| Placecard system design and V1 scope                          | `docs/product/placecard_decomp.md`           |                                                    |
