---
name: system-design-planning
description: >
  Use this skill whenever the user wants to design, architect, or plan a system, feature, service,
  pipeline, or any non-trivial piece of engineering before building it. Triggers include: "design a
  system for", "how should I architect", "plan out", "help me think through the design of", "what's
  the best way to structure", "decompose this", or any request that involves making design decisions
  with tradeoffs. ALSO trigger this proactively whenever a task is about to involve multi-component
  design, data modeling, scaling, or irreversible architectural choices — even if the user just says
  "build X" without saying "design". Do NOT jump straight to implementation on a system-level task;
  run this process first. The output is a structured design worked through in conversation; it can
  later feed an ADR or design doc but is not itself a document.
---

# System Design Planning

A disciplined process for designing systems: understand the problem fully, surface risks early,
decompose from real needs, design high-level, then dive into each part weighing alternatives,
tradeoffs, and edge cases for every decision.

The single most important rule: **clarify before designing.** Most bad designs come from solving the
wrong problem confidently. Ask questions and wait for answers before committing to an architecture.

The output of this skill lives in the conversation — a worked-through design, not a file. If the
user later wants it captured, it can feed a design doc or ADR (and in an ADR, only the durable
decision and its tradeoffs belong, not the exploration).

---

## Phase 0 — Calibrate rigor to the problem

Before anything, gauge the size of what's being designed and scale the process accordingly. Forcing
a full scaling/CAP/failure analysis onto a small feature is itself a design failure ("overbuilt:
unnecessary complexity").

- **Small / local** (a single component, a CRUD endpoint, a script, a well-bounded change): do a
  lightweight pass — clarify the few real unknowns, name the one or two decisions that matter, note
  obvious edge cases, and move on. Skip the heavy phases.
- **Medium** (a feature spanning a few components, new data model, moderate scale): run the full
  process but keep each phase tight.
- **Large / foundational** (a new service, a pipeline, anything hard to reverse or that other work
  will build on): run every phase thoroughly. These are the cases this skill exists for.

State your calibration in one line ("This is a medium-scope feature, so I'll run the full process
but keep it tight") so the user can correct you if you've misjudged.

---

## Phase 1 — Understand the problem and full context

Do not assume you understand the problem. Reconstruct it from scratch.

- **What is actually being solved?** State the problem in your own words. Identify the user, their
  context, and their workflow. Tighten the scope — what is in, what is out.
- **Question everything.** Disambiguate vague terms. Surface unstated assumptions. Do not treat the
  problem statement as complete or correct.
- **Ask clarifying questions and STOP.** Gather the open questions, ask them, and wait for answers
  before proceeding. Do not design past an unknown by assuming an answer. The questions usually fall
  into: scope boundaries, who the users are and what they expect, what success looks like, and which
  constraints are hard vs. soft.

Only continue once the problem is genuinely clear or the user tells you to proceed with stated
assumptions (in which case, make those assumptions explicit).

---

## Phase 2 — Constraints and requirements

Pin down what the system must do and what it must do it within.

- **Functional requirements:** what the system must do, in concrete terms.
- **Non-functional requirements:** the qualities the system must have. Which of these matter depends
  entirely on the domain — pick the ones that apply and ignore the rest:
  - **Scale / volume** — how much load, data, or usage, and how it grows.
  - **Performance / latency** — what's fast enough, and where speed actually matters.
  - **Reliability / availability** — tolerance for failure or downtime.
  - **Correctness / consistency** — how accurate and how fresh the output must be.
  - **Others as relevant** — security, privacy, maintainability, portability, accessibility,
    observability, extensibility. Different problems foreground different qualities; a CLI tool
    cares about ergonomics, a data pipeline about correctness, a service about availability.
- **Operational constraints:** time/deadline, resource limits, cost, team size, existing systems it
  must fit into. Identify the one or two structural questions that reshape the whole design (e.g.
  for a service: single-machine or distributed? for a tool: one-shot or long-running?).
- **Inputs and their trustworthiness:** where does the input come from, what does it look like, and
  **can it be trusted?** Do not assume perfect, complete, well-ordered input.

---

## Phase 3 — Surface high-level risks early

Before designing, name the things most likely to go wrong. Finding these now is cheaper than finding
them in the deep dive.

- Obvious failure modes and the main, predictable problems.
- Edge cases — including malicious or adversarial users.
- Input problems (these recur constantly for **any input the system trusts** — data feeds, user
  input, upstream services, files, config — check each):
  - It could be **bad or missing**.
  - It could arrive **out of order**.
  - It could be **stale** (read mid-update, or a decision made before an update propagated).
  - It could **conflict** with other input.
  - It could be **duplicated**.

These risks feed directly into the decomposition and the deep dive — keep them in view.

---

## Phase 4 — Decompose from what the user needs

Derive the system's parts from the requirements, not from a generic template.

- Start from what the user sees / needs, and work backward to what's required to deliver it.
- Break the problem into manageable, separable pieces — the core components.
- Sketch the light API surface between pieces (just enough to show responsibilities).
- Sketch the data flow — how a request or a piece of data moves through the system.

The goal is a clean component breakdown where each piece has a clear responsibility.

---

## Phase 5 — High-level design

Put the pieces together into an architecture.

- Show how the core components connect.
- Name the high-level tradeoffs the shape of the design implies (without resolving every detail
  yet).
- Keep it at the level where someone could understand the system in one diagram or one paragraph.

This is the checkpoint to confirm the overall shape is right before investing in detail. If useful,
offer a diagram here.

---

## Phase 6 — Deep dive each component

For every significant piece, go deep. This is where most of the design value is. For **each
decision** within a component, explicitly cover:

- **The decision** — what is being chosen.
- **Alternatives considered** — what else could have been done.
- **Tradeoffs** — why this option over the others, and what it costs.
- **Edge cases and failure modes** — how it behaves when things go wrong.

The per-decision loop above is universal. The specific areas you dive into depend on the domain.
Cover whichever apply:

- **Data / state models** — what the system holds, how it's shaped, and what drives the shape. (For
  a UI: the model the frontend consumes. For a store: entities, attributes, schemas.)
- **Core logic / algorithms** — go deep where the real difficulty lives. Don't hand-wave the hard
  part (e.g. how historical data is used to compute an optimal result, how conflicts are resolved,
  how the key transformation works).
- **Interfaces** — the contracts between components or with the outside world.
- **Performance levers** — wherever they live for this domain: caching, indexing, batching, async
  work / queues, partitioning or sharding, lazy evaluation, precomputation.
- **Technology choices** — concrete picks (library, datastore, framework, language feature), each
  justified by the tradeoffs above rather than by default or familiarity.

Revisit the risks from Phase 3 against each component — make sure each is handled or explicitly
accepted.

---

## Phase 7 — Bottlenecks and failures

Stress the design.

- **Where does it break?** Identify the limiting factor or bottleneck under stress.
- **What happens when things go wrong:**
  - **A dependency fails** — a component, service, or external system it relies on is down.
  - **Load spikes** — usage or data volume far beyond what's expected.
  - **Input is malformed or inconsistent** — bad, conflicting, or unexpected input arrives.

For each, state the behavior and whether the system degrades gracefully or fails hard.

---

## Phase 8 — Tradeoff summary

Make the central tensions explicit and state where the design lands on each, and why. The relevant
tensions depend on the domain; common ones include:

- **Correctness vs. availability** (or consistency vs. responsiveness)
- **Performance vs. cost**
- **Simplicity vs. flexibility / scalability**
- **Speed of delivery vs. robustness**

Plus any others specific to the problem. The point is that the design is a deliberate set of
choices, not an accident.

---

## Phase 9 — Self-review

Before presenting the design as done, audit it against three failure patterns:

- **Missed** — is any requirement or necessary component absent? Look actively for things that
  _should_ exist but don't (an escape hatch, a suppression/override, an error path, a rollback) —
  these are easy to overlook precisely because nothing in the design points at them.
- **Weak** — is any tradeoff asserted but not actually justified?
- **Overbuilt** — is there complexity that the requirements don't justify? (Re-check against the
  Phase 0 calibration. When in doubt, cut.)

Name what you find. If something is weak or overbuilt, fix it rather than shipping it with a caveat.

---

## Notes on conduct

- **Don't assume — ask.** The clarify-and-wait step in Phase 1 is the highest-leverage part of this
  process. Skipping it is the most common way the whole design goes wrong.
- **Be a thinking partner, not an order-taker.** Push back on premises that seem off. Offer
  alternatives the user didn't ask for when they're better.
- **Creativity is welcome.** Note genuinely useful features or approaches the user hasn't considered
  — but only where they serve the requirements, not as decoration.
- **Scale the output to the problem.** A small task gets a short, focused pass. Reserve the full
  nine-phase treatment for designs that warrant it.
