#!/usr/bin/env bash
# Prove a shared-code change did not regress a page that has no WordPress
# reference of its own (the English pages). Compares the build against ITSELF,
# before and after.
#
#   ./baseline.sh contact-us /contact-us    # 1st run, BEFORE the change: records baseline
#   ...make the shared change (tailwind.config.cjs, Layout, header...)
#   ./baseline.sh contact-us /contact-us    # 2nd run, AFTER: captures and diffs
#
#   ./baseline.sh --reset contact-us        # drop a stale baseline
#
# Order matters and the script cannot check it for you: a baseline recorded
# AFTER the change proves nothing. Record it first.
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$(pwd)"; TOOLS="$ROOT/tools"
ORIGIN="${ORIGIN:-http://localhost:3000}"

if [[ "${1:-}" == "--reset" ]]; then
  rm -rf "$ROOT/baseline/${2:?usage: baseline.sh --reset <slug>}"
  echo "baseline dropped for ${2}"
  exit 0
fi

SLUG="${1:?usage: baseline.sh <slug> <path>   |   baseline.sh --reset <slug>}"
APATH="${2:?usage: baseline.sh <slug> <path>}"
DIR="$ROOT/baseline/$SLUG"

[[ -d "$TOOLS/node_modules" ]] || (cd "$TOOLS" && npm i --silent playwright-core pixelmatch pngjs)

capture() {  # capture <dest-dir> <prefix>
  local tmp; tmp="$(mktemp -d)"
  (cd "$TOOLS" && node shot.mjs "[[\"$SLUG\",\"$APATH\"]]" "$tmp" "$ORIGIN") >/dev/null
  mkdir -p "$1"
  for v in desktop tablet mobile; do cp "$tmp/$SLUG/$v.png" "$1/$2$v.png"; done
  rm -rf "$tmp"
}

if [[ ! -f "$DIR/desktop.png" ]]; then
  capture "$DIR" ""
  echo "baseline recorded: reference/baseline/$SLUG/"
  echo "Make the shared change, then run this again to check for regression."
  exit 0
fi

capture "$DIR" "astro-"
echo "comparing $SLUG against its pre-change baseline"
echo
(cd "$TOOLS" && node diff.mjs "$DIR")
