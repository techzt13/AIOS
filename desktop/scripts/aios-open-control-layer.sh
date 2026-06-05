#!/usr/bin/env bash
set -euo pipefail
xdg-open http://localhost:8080 >/dev/null 2>&1 || xdg-open http://aios:8080 >/dev/null 2>&1 || true
