---
description: Commit, merge, and clean up a worktree branch
argument-hint: [worktree-name] [target-branch]
allowed-tools: Bash(git:*), Bash(bash scripts/worktree-merge.sh:*)
model: claude-haiku-4-5-20251001
---

Merge the worktree `$1` into branch `$2`, then clean it up.

Steps:

1. Inspect pending changes:
   - `git -C .claude/worktrees/$1 status --porcelain`
   - `git -C .claude/worktrees/$1 diff HEAD`
2. If there are uncommitted changes, write a conventional-commit message (`feat:`, `fix:`, `docs:`,
   `chore:`, `refactor:`) summarizing them.
3. Run the merge script:
   - With changes: `bash scripts/worktree-merge.sh $1 $2 "<commit message>"`
   - No changes: `bash scripts/worktree-merge.sh $1 $2`
4. If the script exits reporting a merge conflict, do not force anything. Resolve the conflicted
   files, commit the merge, then run the cleanup manually:
   - `git worktree remove .claude/worktrees/$1`
   - `git branch -d worktree-$1`
   - `git worktree prune`
5. Report exactly what was committed, merged, and removed.
