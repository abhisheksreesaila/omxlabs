#!/usr/bin/env bash
# Rebuild the product pages' isometric diagrams from their JSON specs with the isoarch skill's build.py (never hand-drawn),
# the same way omxcode's cover does (docs/launch/iso/build.sh): dark by default (the viewer's Theme button still switches),
# the template's panel blur removed (omxqua: opaque surfaces, no glass). Each spec colours its product with hue + sat.
# Usage: iso/build.sh            (ISOARCH=<skill dir> to point at another copy of the skill)
set -euo pipefail
cd "$(dirname "$0")"
B="${ISOARCH:-$HOME/.claude/skills/isoarch}/scripts/build.py"
for spec in *.json; do
  html="${spec%.json}.html"
  python3 "$B" "$spec" "$html"
  sed -i '0,/<html lang="en">/s//<html lang="en" data-theme="dark">/' "$html"
  sed -i 's/-webkit-backdrop-filter:blur([0-9]*px);\?//g; s/backdrop-filter:blur([0-9]*px);\?//g' "$html"
done
