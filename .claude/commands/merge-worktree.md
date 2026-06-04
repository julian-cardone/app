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
4. If the script exits non-zero due to a merge conflict, **STOP IMMEDIATELY**. Do not attempt to
   resolve the conflict, edit any files, or run any further git commands. Report the conflict to the
   user with the exact output from the script, then output these manual resolution steps verbatim
   and wait:

   ```
   MERGE CONFLICT — manual resolution required.

   1. Resolve the conflicted files in your editor.
   2. Stage the resolved files: git add <files>
   3. Complete the merge: git merge --continue
   4. Clean up the worktree:
      git worktree remove .claude/worktrees/$1
      git branch -d worktree-$1
      git worktree prune
   ```

   Do not proceed or offer further assistance until the user reports the conflict is resolved.

5. Report exactly what was committed, merged, and removed.
