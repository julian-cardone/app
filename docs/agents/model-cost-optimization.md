---
title: Model and Cost Optimization
doc_type: standard
status: accepted
owners: ["@julian-cardone"]
last_reviewed: 2026-05-27
related: []
tags: [tooling, ai-agent]
---

# Model & Cost Optimization

A cost-intelligent multi-agent setup for Claude Code. The goal is simple: every task runs on the
cheapest model that can do it correctly, and no task silently lands on an expensive model because
routing was skipped.

## Where everything goes

All files live in `.claude/` at the repository root. Claude Code discovers `.claude/agents/`
automatically.

```text
.claude/
├── settings.json              Project settings (permissions, hooks). No default agent set.
├── agents/
│   ├── ROUTING.md             The pre-routing classifier (decision rubric)
│   ├── orchestrator.md        Opus  — routes work, does not do work
│   ├── planner.md             Opus  — architecture & planning only
│   ├── executor.md            Sonnet — implementation
│   ├── reviewer.md            Sonnet — review, read-only
│   └── quick-tasks.md         Haiku — reads, searches, status, formatting
└── commands/                  Slash command specs (/pr, /start, /check-doc, …)
```

## The model tiers

| Agent          | Model  | Role                                                           |
| -------------- | ------ | -------------------------------------------------------------- |
| `orchestrator` | Opus   | Opt-in: routes complex multi-step work when explicitly invoked |
| `planner`      | Opus   | Architecture decisions, multi-file planning                    |
| `executor`     | Sonnet | Writing/editing code, scoped implementation                    |
| `reviewer`     | Sonnet | Reviewing completed work                                       |
| `quick-tasks`  | Haiku  | File reads, searches, status checks, formatting                |

Opus is reserved for judgment — coordination and planning. Sonnet does the implementation and
review. Haiku absorbs the high-volume mechanical work that makes up most of a session. Expect 70–80%
of tasks to land on Sonnet or Haiku.

## How the pre-routing classifier works

There is no programmatic hook that intercepts a task before execution, so the classifier is
implemented as a **decision rubric** — `ROUTING.md` (at `.claude/agents/ROUTING.md`) — that two
audiences consult:

1. **The human user**, when choosing which `@agent-<name>` to invoke (or none — the default Sonnet
   session handles most work).
2. **The orchestrator**, when explicitly spawned via `@agent-orchestrator`. Its own prompt enforces
   the rubric before every delegation.

The rubric is a plain table: match the task to a row, route to the named agent.

## Why every agent pins its model explicitly

Each subagent file sets an explicit `model:` field (`opus`, `sonnet`, or `haiku`). None of them use
`inherit`.

This is deliberate and it is the highest-leverage part of the setup. A subagent with
`model: inherit` — or no `model:` field at all, since `inherit` is the default — runs on whatever
the main session is using. If the main session is on Opus, every such subagent inherits Opus. That
is exactly how a file-read or a formatting pass quietly costs Opus tokens. Pinning each agent to its
tier closes that gap.

One caveat: the `CLAUDE_CODE_SUBAGENT_MODEL` environment variable, if set, **overrides every agent's
`model:` field**. Do not set it. It would collapse the whole tiered setup back into a single model.

## Using it

The default session has no orchestrator and no special flag:

```bash
claude
```

This runs on Claude Code's normal default (Sonnet on most plans). Most work — single-file edits,
straightforward questions, scoped tasks — should stay here.

When a task warrants a different tier, invoke an agent explicitly with `@agent-<name>`:

```text
@agent-quick-tasks  read src/config.ts and report the exported names
@agent-executor     implement step 3 of the plan
@agent-reviewer     review my unstaged changes
@agent-planner      plan the refactor of the auth module
@agent-orchestrator decompose and route this multi-step refactor
```

## Default agent and slash commands

There is no default agent. `.claude/settings.json` does not set `"agent"`, so a bare `claude`
session runs on Claude Code's normal default (Sonnet). Specialized agents are opt-in via
`@agent-<name>`.

The full invocation table:

| Invocation                 | When to use                                                                  | Model               |
| -------------------------- | ---------------------------------------------------------------------------- | ------------------- |
| (default session, no flag) | Straightforward tasks, single-file edits, questions, anything clearly scoped | Sonnet              |
| `@agent-quick-tasks`       | File reads, searches, status checks, formatting                              | Haiku               |
| `@agent-executor`          | Implementation: writing code, editing files, scoped changes                  | Sonnet              |
| `@agent-reviewer`          | Reviewing completed work before finalizing or opening a PR                   | Sonnet              |
| `@agent-planner`           | Architecture decisions, planning multi-file or ambiguous work                | Opus (effort: high) |
| `@agent-orchestrator`      | Complex multi-step tasks needing decomposition and routing                   | Opus                |

**Key rule:** No task reaches Opus by default — only by explicit invocation. Start at the lowest
tier that could plausibly do the work; escalate after a miss rather than defaulting high.

### Slash commands

Slash commands (`/pr`, `/start`, `/check-doc`) are write-capable specs that live in
`.claude/commands/`. Run them inside the executor by combining `@agent-executor` with the slash
command:

```text
@agent-executor /pr
@agent-executor /start
@agent-executor /check-doc
```

This routes execution directly to Sonnet — no orchestrator overhead, no Opus turn for the routing
decision.

Do not combine slash commands with `@agent-reviewer`. The reviewer is read-only, and slash commands
map 1:1 to their write-capable spec. For reviewing a diff before opening a PR, use a free-form
prompt: `@agent-reviewer review my unstaged changes`.

## Effort and thinking levels

Model choice is the coarse cost lever. Effort is the fine one. The `effort` frontmatter field
(`low`, `medium`, `high`, `xhigh`, `max`) sets how hard a model thinks, and overrides the session
effort level for that agent.

Per-agent effort settings:

- `planner` — `effort: high` (its output constrains every downstream executor; think hard).
- `quick-tasks` — `effort: low` (mechanical, no thinking budget needed).
- `orchestrator`, `executor`, `reviewer` — no `effort` set; inherit the session default.

## Tracking whether it works

Across a session, expect roughly 70–80% of tasks to land on `quick-tasks` or `executor`. If almost
everything is reaching `planner`, the classifier is being skipped — that is the failure mode this
rubric exists to prevent. If the classifier is being skipped: as a human, re-read `ROUTING.md`
before invoking an agent. If you are using `@agent-orchestrator`, tighten its prompt as well.

## Known caveat: plan mode inheritance

Subagents may inherit plan-mode state from the parent session — once plan mode is active in the
parent, sibling agents spawned during that session can refuse edits even after plan mode is lifted.
Removing `permissionMode: plan` from `planner.md` eliminates one source of contamination (the
planner is no longer a per-session contaminant), but the residual platform behaviour is a Claude
Code-level concern outside this repo. Restart the session if subagents start declining to execute.
