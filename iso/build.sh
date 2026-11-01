#!/usr/bin/env bash
# Rebuild the product pages' isometric diagrams from their JSON specs with the isoarch skill's build.py (never hand-drawn),
# then chrome.py gives every one the same fixed look inside our dark omxqua pages: only the drawing, its hover/click/select
# and the flow bar with Play; dark, ink, omxqua night tokens, each product's own accent. The specs colour the blocks (hue + sat).
# Usage: iso/build.sh            (ISOARCH=<skill dir> to point at another copy of the skill)
set -euo pipefail
cd "$(dirname "$0")"
B="${ISOARCH:-$HOME/.claude/skills/isoarch}/scripts/build.py"
accent() { case "$1" in omxplorer*) echo "#3ccf6e";; omxcore*) echo "#4aa8ff";; omxconsole*) echo "#ff9f40";; omxqua*) echo "#c084fc";; omxcode*) echo "#ff5d6c";; *) echo "#ededef";; esac; }
for spec in *.json; do
  html="${spec%.json}.html"
  python3 "$B" "$spec" "$html"
  python3 chrome.py "$html" --accent "$(accent "$spec")" --fonts ../assets/omxqua/src/fonts.css
done
