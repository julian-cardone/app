---
name: process-run-log
description: >-
  Record a structured run log after completing any multi-step or proprietary process in this
  repository — worktree setup, release flows, data migrations, agent orchestration, or any workflow
  documented under docs/process/ with more than a couple of steps. Use this whenever you finish
  running a defined process, even if it went smoothly. The log captures what happened and,
  critically, where the process documentation was unclear, missing, or wrong, so the process can be
  improved over time. Trigger on completion of any documented process, or whenever the user asks to
  log, record, or capture a run.
---

# Process Run Log

This skill records what happened during a run of a defined repository process, for later human
review. Its purpose is process improvement, not status reporting. The most valuable content is
honest friction: where the run stalled, where a judgment call was required, and where the process
documentation failed to guide the work.

## When to write a log

Write a log at the end of running any process documented under `docs/process/`, or any multi-step
proprietary workflow, including when the run completed cleanly. A run that went smoothly still
produces signal — confirming which steps were frictionless is useful, and smooth runs often still
contain a small ambiguity worth recording.

Do not write a log for trivial one-step tasks. This is for defined processes only.

## Where logs go

Write logs to `.claude/process-logs/`. Create the directory if it does not exist. This location is
gitignored and local-only — logs are never committed or shared. They are working data for the
repository owner to review, not documentation.

Filename format:

```
<YYYY-MM-DD-HHMMSS>-<process-name>.md
```

Use a short hyphenated process name, e.g. `2026-06-01-143022-worktree-setup.md`.

## Log template

Fill in every required field. Do not omit the Friction or Documentation Gaps sections — if there was
genuinely none, write "None observed" explicitly rather than deleting the section.

```markdown
# Run Log — [Process Name]

- **Date:** [YYYY-MM-DD HH:MM]
- **Outcome:** [completed | partial | blocked]

## Summary

Two or three sentences describing what this run accomplished.

## Steps taken

A brief list of the actual steps performed, in order. Note any step that deviated from the
documented process and why.

## Token efficiency

Assessment of whether token usage was proportionate to the task. Note which model handled which
steps, whether each model felt right-sized for its task, and where tokens were wasted or well spent.
Be specific — "high usage on step 3 because the file was re-read three times" is useful; "tokens
felt okay" is not.

## Friction

Where the run stalled, retried, backtracked, or required a judgment call not covered by the process.
Be specific and honest. This is the primary value of the log. Write "None observed" only if the run
was genuinely frictionless.

## Documentation gaps

Specific places where the process documentation was ambiguous, missing, outdated, or wrong. Name the
document and section. This is what gets fixed. Write "None observed" if the documentation fully
covered the run.

## Token efficiency

Assess token usage relative to the complexity of this run. The goal is not to minimise tokens
absolutely, but to avoid wasting them. Be specific:

- Which model handled which tasks, and whether the model choice felt right-sized (e.g. a heavy model
  on a trivial formatting step is waste; a weak model on a reasoning-heavy step is a different kind
  of waste)
- Where the run consumed more tokens than the task warranted — repeated reads of the same files,
  redundant context re-establishment, over-long responses to simple steps, unnecessary clarification
  loops
- Where tokens were well spent and why

Write "No obvious waste observed" only if you genuinely cannot identify any inefficiency. This field
is as important as the Friction field — token efficiency is a process quality metric, not an
afterthought.

## Suggested improvements

Optional. Concrete changes to the process, its documentation, or model/task assignments that would
have made this run cheaper or smoother.

## Notes

Optional. Environment quirks, or anything else worth recording.
```

## What process improvement means here

Process improvement has two dimensions: quality and efficiency. A run that produced correct output
but wasted tokens on redundant reads, over-specified prompts, or wrong model choices is still a run
worth improving. Log both dimensions with equal weight. The questions to ask:

- Did the right model handle each step, or was there mismatch in either direction?
- Were there steps where fewer tokens would have reached the same result?
- Were there steps where the process documentation caused unnecessary back-and-forth?

## Writing the log honestly

The log is only useful if it surfaces problems. Avoid framing every run as a success. If a step in
the documented process was confusing, say so plainly and point to the exact document and heading. If
a decision had to be made because the process was silent on a case, record the decision and the gap
that forced it. A log that reports only success teaches nothing and wastes the overhead of writing
it.
