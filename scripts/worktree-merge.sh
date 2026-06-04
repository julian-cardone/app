#!/usr/bin/env bash
# Merge a Claude Code worktree branch into a target branch and clean up.
# Usage: scripts/worktree-merge.sh <name> <target-branch> [commit-message]
#
# The deterministic git mechanics live here so they run with no token cost
# and no improvisation. Judgment steps (commit message, conflict resolution)
# are handled by the caller — see .claude/commands/merge-worktree.md.
set -euo pipefail

NAME="${1:?Usage: worktree-merge.sh <name> <target-branch> [commit-message]}"
TARGET="${2:?Usage: worktree-merge.sh <name> <target-branch> [commit-message]}"
MSG="${3:-}"

WT=".claude/worktrees/${NAME}"
BRANCH="worktree-${NAME}"

if [ ! -d "$WT" ]; then
  echo "error: worktree not found at $WT" >&2
  exit 1
fi

# Refuse to proceed if the main working tree is dirty — switching branches
# under uncommitted changes leads to a confusing state.
if [ -n "$(git status --porcelain)" ]; then
  echo "error: main working tree has uncommitted changes. Commit or stash them first." >&2
  exit 1
fi

# 1. Commit pending changes inside the worktree, if any.
if [ -n "$(git -C "$WT" status --porcelain)" ]; then
  if [ -z "$MSG" ]; then
    echo "error: uncommitted changes in $WT but no commit message given." >&2
    echo "       re-run with a message as the third argument." >&2
    exit 1
  fi
  git -C "$WT" add -A
  git -C "$WT" commit -m "$MSG"
  echo "committed changes on $BRANCH"
else
  echo "no uncommitted changes in $WT"
fi

# 2. Merge into the target branch. A merge conflict aborts the script here
#    (set -e), so cleanup below is skipped and nothing is removed while in a
#    conflicted state.
git checkout "$TARGET"
git merge "$BRANCH"

# 3. Clean up — only reached on a clean merge.
git worktree remove "$WT"
git branch -d "$BRANCH"        # -d refuses to delete an unmerged branch (safe guard)
git worktree prune

echo "done: merged $BRANCH into $TARGET and removed the worktree"
