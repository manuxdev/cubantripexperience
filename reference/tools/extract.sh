#!/usr/bin/env bash
# Regenerate the visual reference from the live WordPress source.
#
#   ./extract.sh            # every page in every language
#   ./extract.sh inicio     # one page, by slug
#   ./extract.sh es         # every page in one language
#   SKIP_SHOTS=1 ./extract.sh   # JSON + spec only (no browser needed)
#
# Requires: the WordPress docker stack up, Google Chrome installed.
set -euo pipefail
cd "$(dirname "$0")/.."          # -> reference/
ROOT="$(pwd)"
TOOLS="$ROOT/tools"
DB=cubantripexperience-db-1
ONLY="${1:-}"

# `$1` matches either a language ("es") or a single slug ("inicio").
rows=()
while IFS=$'\t' read -r lang slug id path title; do
  [[ "$lang" == \#* || -z "$lang" ]] && continue
  [[ -n "$ONLY" && "$slug" != "$ONLY" && "$lang" != "$ONLY" ]] && continue
  rows+=("$lang|$slug|$id|$path|$title")
done < "$TOOLS/pages.tsv"

[[ ${#rows[@]} -eq 0 ]] && { echo "no pages matched '$ONLY'"; exit 1; }

json_pages="["
for r in "${rows[@]}"; do
  IFS='|' read -r lang slug id path title <<< "$r"
  mkdir -p "$ROOT/$lang/$slug"

  # 1. Elementor layout data — the source of truth for the design
  docker exec "$DB" sh -c \
    "mariadb -uroot -p\"\$MARIADB_ROOT_PASSWORD\" -N -B --raw \
     -e 'SELECT meta_value FROM wp_postmeta WHERE post_id=$id AND meta_key=\"_elementor_data\";' wordpress" \
    > "$ROOT/$lang/$slug/elementor.json"

  # 2. Human-readable spec
  {
    echo "# $title"; echo
    echo "- **Origen:** http://localhost:8080$path"
    echo "- **Fuente:** \`_elementor_data\` (Elementor + Astra + Polylang)"
    echo "- **Capturas:** \`desktop.png\` (1440) · \`tablet.png\` (768) · \`mobile.png\` (390)"
    echo "- **Breakpoints Elementor:** tablet <1025px · mobile <768px"; echo
    echo "> Los sufijos \`_tablet\` / \`_mobile\` en \`_style_\` son overrides de ese breakpoint."; echo
    python3 "$TOOLS/spec.py" "$ROOT/$lang/$slug/elementor.json"
  } > "$ROOT/$lang/$slug/spec.md"

  json_pages+="[\"$lang/$slug\",\"$path\"],"
  echo "spec  $slug"
done
json_pages="${json_pages%,}]"

# 3. Full-page screenshots at the three Elementor breakpoints
if [[ -z "${SKIP_SHOTS:-}" ]]; then
  [[ -d "$TOOLS/node_modules" ]] || (cd "$TOOLS" && npm i --silent playwright-core)
  (cd "$TOOLS" && node shot.mjs "$json_pages" "$ROOT")
fi
