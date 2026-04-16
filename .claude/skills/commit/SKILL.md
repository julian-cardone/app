# Commit

Stage and commit the current changes following the repository's commit message standard.

## Instructions

Read `docs/process/commit-messages.md` before proceeding. Apply those rules exactly.

1. Run `git status` to identify what has changed.
2. Run `git diff` (staged and unstaged) to understand the content of the changes.
3. Draft a commit message that:
   - Uses the imperative mood (e.g., "Add", "Fix", "Update" — not "Added", "Adding", "Adds").
   - Starts with a capital letter.
   - Has no trailing punctuation.
   - Is concise and descriptive of what the commit does when applied.
   - Optionally appends `(#<issue-id>)` if the work is linked to a GitHub issue. Do not use
     closing keywords like `Closes #<id>` — that belongs in the pull request, not the commit.
4. Show the draft message to the user and confirm before committing.
5. Stage only the relevant files — do not use `git add -A` blindly. List the files being staged.
6. Commit using the confirmed message.
7. Run `git status` to confirm the working tree is clean.
