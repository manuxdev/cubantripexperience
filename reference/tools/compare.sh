#!/usr/bin/env bash
# Capture the SAME page from the Astro dev server, side by side with the reference.
#
#   ./compare.sh inicio /            # Astro route "/" vs reference/es/inicio
#   LANG_DIR=en ./compare.sh home /  # ... vs reference/en/home
#   ORIGIN=http://localhost:4321 ./compare.sh servicios /servicios
#
# Writes astro-desktop.png / astro-tablet.png / astro-mobile.png next to the
# reference captures, pixel-diffs them, and prints a PASS/FAIL verdict.
# Exit code is non-zero when any breakpoint fails, so it works as a gate.
#
# Tolerances default to 2%; override per run:
#   HEIGHT_TOLERANCE=0.01 PIXEL_TOLERANCE=0.05 ./compare.sh inicio /es/
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$(pwd)"; TOOLS="$ROOT/tools"
SLUG="${1:?usage: compare.sh <slug> <astro-path>}"
APATH="${2:?usage: compare.sh <slug> <astro-path>}"
# Language folder under reference/. Defaults to `es`, so every Spanish
# invocation keeps working unchanged.
LANG_DIR="${LANG_DIR:-es}"
ORIGIN="${ORIGIN:-http://localhost:3000}"

[[ -d "$TOOLS/node_modules" ]] || (cd "$TOOLS" && npm i --silent playwright-core pixelmatch pngjs)
tmp="$(mktemp -d)"
(cd "$TOOLS" && node shot.mjs "[[\"$SLUG\",\"$APATH\"]]" "$tmp" "$ORIGIN")
for v in desktop tablet mobile; do
  cp "$tmp/$SLUG/$v.png" "$ROOT/$LANG_DIR/$SLUG/astro-$v.png"
done
rm -rf "$tmp"
echo "→ reference/$LANG_DIR/$SLUG/astro-{desktop,tablet,mobile}.png"
echo
(cd "$TOOLS" && node diff.mjs "$ROOT/$LANG_DIR/$SLUG")
