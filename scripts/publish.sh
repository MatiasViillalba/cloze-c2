#!/usr/bin/env bash
#
# Publishes the project to GitHub in one command.
#
# Builds the commit history if it is not there yet, points the repository at
# your GitHub remote and pushes everything in a single operation. Git sends the
# whole history in one transfer: there is no per-commit push.
#
# Before running this, create an EMPTY repository at https://github.com/new
# (no README, no .gitignore, no licence).
#
# Usage: ./scripts/publish.sh <remote-url> [branch]
#   ./scripts/publish.sh https://github.com/MatiasViillalba/cloze-c2.git

set -euo pipefail

REMOTE_URL="${1:-}"
BRANCH="${2:-main}"
NAME="${GIT_AUTHOR_NAME:-MatiasViillalba}"
EMAIL="${GIT_AUTHOR_EMAIL:-mativillalbba@gmail.com}"

if [ -z "$REMOTE_URL" ]; then
  echo "Usage: $0 <remote-url> [branch]" >&2
  echo "Example: $0 https://github.com/MatiasViillalba/cloze-c2.git" >&2
  exit 1
fi

cd "$(dirname "$0")/.."

command -v git >/dev/null 2>&1 || { echo "git is not installed." >&2; exit 1; }

# --- 1. History -------------------------------------------------------------
if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
  echo "No commits yet - building the project history first."
  ./scripts/seed-history.sh "$NAME" "$EMAIL" "$BRANCH"
fi

COMMITS=$(git rev-list --count HEAD)
echo
echo "Repository has $COMMITS commits ready to publish."

# --- 2. Branch --------------------------------------------------------------
CURRENT=$(git rev-parse --abbrev-ref HEAD)
[ "$CURRENT" = "$BRANCH" ] || git branch -M "$BRANCH"

# --- 3. Remote --------------------------------------------------------------
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REMOTE_URL"
  echo "Remote 'origin' updated to $REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
  echo "Remote 'origin' set to $REMOTE_URL"
fi

# --- 4. Push everything at once ---------------------------------------------
echo
echo "Pushing all $COMMITS commits in one go..."
echo

if ! git push -u origin "$BRANCH"; then
  echo
  echo "The push was rejected."
  echo "The usual cause is that the GitHub repository is not empty (it was created"
  echo "with a README or a licence). Either delete and recreate it empty, or run:"
  echo "  git push --force -u origin $BRANCH"
  exit 1
fi

git push origin --tags >/dev/null 2>&1 || true

# --- 5. What to do next -----------------------------------------------------
WEB_URL="${REMOTE_URL%.git}"
cat <<EOF

Published.

Next, turn on GitHub Pages so you can install the app on your iPhone:
  1. Open  $WEB_URL/settings/pages
  2. Source: "Deploy from a branch"
  3. Branch: $BRANCH, folder: / (root), then Save
  4. Wait about a minute, then open the URL Pages gives you IN SAFARI
  5. Share button -> Add to Home Screen

EOF
