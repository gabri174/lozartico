#!/bin/sh
set -eu

# ServerByt/365i Git deployment guard.
# The repository itself is the web root, so every Deploy must first
# synchronize the checkout with origin/main before serving the files.

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

git fetch --prune origin main
git checkout -f main
git reset --hard origin/main
git clean -fd

echo "Lozartico deployed commit: $(git rev-parse HEAD)"
