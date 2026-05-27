# Model & Cost Optimization

A cost-intelligent multi-agent setup for Claude Code. The goal is simple: every task runs on the
cheapest model that can do it correctly, and no task silently lands on an expensive model because
routing was skipped.

## Where everything goes

All files live in `.claude/` at the repository root. Claude Code discovers `.claude/agents/`
automatically.

```text
.claude/
├── settings.json              Project settings; sets the orchestrator as default agent
├── MODEL-COST-SETUP.md        This file
└── agents/
    ├── ROUTING.md             The pre-routing classifier (decision rubric)
    ├── orchestrator.md        Opus  — routes work, does not do work
    ├── planner.md             Opus  — architecture & planning only
    ├── executor.md            Sonnet — implementation
    ├── reviewer.md            Sonnet — review, read-only
    └── quick-tasks.md         Haiku — reads, searches, status, formatting
```

## The model tiers

| Agent          | Model  | Role                                            |
| -------------- | ------ | ----------------------------------------------- |
| `orchestrator` | Opus   | Classifies and routes every task                |
| `planner`      | Opus   | Architecture decisions, multi-file planning     |
| `executor`     | Sonnet | Writing/editing code, scoped implementation     |
| `reviewer`     | Sonnet | Reviewing completed work                        |
| `quick-tasks`  | Haiku  | File reads, searches, status checks, formatting |

Opus is reserved for judgment — coordination and planning. Sonnet does the implementation and
review. Haiku absorbs the high-volume mechanical work that makes up most of a session. Expect 70–80%
of tasks to land on Sonnet or Haiku.

## How the pre-routing classifier works

There is no programmatic hook that intercepts a task before execution, so the classifier is
implemented as a **decision rubric** — [ROUTING.md](./agents/ROUTING.md) — that the orchestrator is
instructed to consult before every delegation. The orchestrator's own prompt enforces it. The rubric
is a plain table: match the task to a row, route to the named agent.

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

Run the orchestrator as your main session agent:

```bash
claude --agent orchestrator
```

`settings.json` also sets `"agent": "orchestrator"`, so any session started in this project uses it
by default. The orchestrator then classifies each task and delegates to a worker.

You can also invoke a worker directly when you already know the tier:

```text
@agent-quick-tasks  read src/config.ts and report the exported names
@agent-executor     implement step 3 of the plan
@agent-planner      plan the refactor of the auth module
```

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
rubric exists to prevent. In the event that the classifier is being skipped, re-read `ROUTING.md`
and tighten the orchestrator prompt.

## Known caveat: plan mode inheritance

Subagents may inherit plan-mode state from the parent session — once plan mode is active in the
parent, sibling agents spawned during that session can refuse edits even after plan mode is lifted.
Removing `permissionMode: plan` from `planner.md` eliminates one source of contamination (the
planner is no longer a per-session contaminant), but the residual platform behaviour is a Claude
Code-level concern outside this repo. Restart the session if subagents start declining to execute.
