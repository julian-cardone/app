# Pre-Routing Classifier

This is the routing rubric the orchestrator consults before delegating any task. Its purpose is cost
control: every task goes to the cheapest model tier that can do it correctly. Skipping this step is
the main way a cheap task ends up on an expensive model.

## The tiers

| Tier  | Model  | Subagent      | Cost   |
| ----- | ------ | ------------- | ------ |
| Cheap | Haiku  | `quick-tasks` | lowest |
| Mid   | Sonnet | `executor`    | medium |
| Mid   | Sonnet | `reviewer`    | medium |
| Top   | Opus   | `planner`     | high   |

## Routing rules

Match the task to the first row that fits, top to bottom.

| If the task is...                                                     | Route to      |
| --------------------------------------------------------------------- | ------------- |
| Reading a file, searching code, listing, "does X exist", "where is Y" | `quick-tasks` |
| A status check — git status, build status, test results               | `quick-tasks` |
| Running a formatter or linter (Prettier, markdownlint, etc.)          | `quick-tasks` |
| A fully-specified mechanical edit — rename, sort imports, whitespace  | `quick-tasks` |
| Summarizing verbose tool output                                       | `quick-tasks` |
| Writing or editing code for a normal-complexity, scoped change        | `executor`    |
| Carrying out a single step from an existing plan                      | `executor`    |
| A bug fix where the cause and fix are understood                      | `executor`    |
| Drafting or updating documentation                                    | `executor`    |
| Reviewing completed work before it is finalized                       | `reviewer`    |
| Architecture or design decisions                                      | `planner`     |
| Planning a refactor or change spanning three or more files            | `planner`     |
| Any task where the right approach is genuinely not obvious            | `planner`     |

## Tie-breaker

When a task could plausibly fit two tiers, **start at the lower one.** Escalating after a clear miss
costs one extra hop. Defaulting to the higher tier costs more on every task that did not need it —
and that cost compounds silently across a whole session.

## Hard rules

- Code formatting, file reads, and status checks never touch Opus. Ever.
- A multi-file or ambiguous job is never handed whole to one expensive agent. It goes to the
  `planner` first, then each step is routed individually.
- Subagents have an explicit `model:` field — never `inherit`. `inherit` is exactly how a cheap task
  silently lands on an expensive model.
