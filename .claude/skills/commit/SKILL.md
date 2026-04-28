# Commit

Checkpoint current changes. Local commits are squashed on merge. Default message is "wip" unless an
argument is provided.

## Steps

1. Stage and commit:
   ```bash
   git add -A
   git commit -m "$ARGUMENTS" || git commit -m "wip"
   ```
2. Confirm clean working tree:
   ```bash
   git status
   ```
