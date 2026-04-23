# Commit

Stage and commit the current changes following the repository's commit message standard.

## Read First

Read these documents in full before taking any action. Do not proceed from memory.

- `docs/process/commit-messages.md`

## Steps

1. Run `git status` and `git diff` to understand what has changed.
2. Draft a commit message per `docs/process/commit-messages.md`. Show it to the user and confirm.
3. Stage only the relevant files — list them explicitly, do not use `git add -A` blindly.
4. Commit using the confirmed message.
5. Run `git status` to confirm the working tree is clean.
