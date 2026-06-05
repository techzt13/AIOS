#!/usr/bin/env bash
set -euo pipefail

if [ "${AIOS_THEME_DISABLE:-0}" = "1" ]; then
  exit 0
fi

HOME_DIR="${HOME:-/config}"
CONF_ROOT="$HOME_DIR/.config"
AIOS_THEME_ROOT="/usr/local/share/aios-theme/xfce"
MARKER_FILE="$CONF_ROOT/aios/theme-initialized"

mkdir -p "$CONF_ROOT/aios" "$CONF_ROOT/xfce4" "$CONF_ROOT/plank/dock1/launchers"

if [ ! -f "$MARKER_FILE" ]; then
  cp -r "$AIOS_THEME_ROOT/xfce4" "$CONF_ROOT/"
  cp -r "$AIOS_THEME_ROOT/autostart" "$CONF_ROOT/"

  cat > "$CONF_ROOT/plank/dock1/settings" <<'PLANK'
[PlankDockPreferences]
CurrentWorkspaceOnly=false
HideDelay=0
HideMode=0
IconSize=54
LockItems=true
Monitor=
Offset=0
Position=3
PressureReveal=false
Theme=Transparent
UnhideDelay=0
ZoomEnabled=true
ZoomPercent=145
PLANK

  cat > "$CONF_ROOT/plank/dock1/launchers/01-thunar.dockitem" <<'EOF_ITEM'
[PlankDockItemPreferences]
Launcher=file:///usr/share/applications/thunar.desktop
EOF_ITEM

  cat > "$CONF_ROOT/plank/dock1/launchers/02-terminal.dockitem" <<'EOF_ITEM'
[PlankDockItemPreferences]
Launcher=file:///usr/share/applications/xfce4-terminal.desktop
EOF_ITEM

  cat > "$CONF_ROOT/plank/dock1/launchers/03-mousepad.dockitem" <<'EOF_ITEM'
[PlankDockItemPreferences]
Launcher=file:///usr/share/applications/mousepad.desktop
EOF_ITEM

  cat > "$CONF_ROOT/plank/dock1/launchers/04-firefox.dockitem" <<'EOF_ITEM'
[PlankDockItemPreferences]
Launcher=file:///usr/share/applications/firefox.desktop
EOF_ITEM

  cat > "$CONF_ROOT/plank/dock1/launchers/05-aios.dockitem" <<'EOF_ITEM'
[PlankDockItemPreferences]
Launcher=file:///usr/share/applications/AIOS.desktop
EOF_ITEM

  touch "$MARKER_FILE"
fi

if command -v xfconf-query >/dev/null 2>&1; then
  xfconf-query -c xsettings -p /Net/ThemeName -n -t string -s "WhiteSur-Dark" >/dev/null 2>&1 || true
  xfconf-query -c xsettings -p /Net/IconThemeName -n -t string -s "WhiteSur-dark" >/dev/null 2>&1 || true
  xfconf-query -c xsettings -p /Gtk/CursorThemeName -n -t string -s "WhiteSur-cursors" >/dev/null 2>&1 || true
  xfconf-query -c xsettings -p /Gtk/FontName -n -t string -s "Inter 11" >/dev/null 2>&1 || true

  xfconf-query -c xfwm4 -p /general/theme -n -t string -s "WhiteSur-Dark" >/dev/null 2>&1 || true
  xfconf-query -c xfwm4 -p /general/button_layout -n -t string -s "CHM|" >/dev/null 2>&1 || true

  xfconf-query -c xfce4-desktop -p /backdrop/screen0/monitor0/workspace0/last-image -n -t string -s "/usr/local/share/aios-theme/assets/aios-wallpaper.svg" >/dev/null 2>&1 || true
  xfconf-query -c xfce4-desktop -p /backdrop/screen0/monitor0/workspace0/image-style -n -t int -s 5 >/dev/null 2>&1 || true
fi

if command -v xfce4-panel >/dev/null 2>&1; then
  xfce4-panel --restart >/dev/null 2>&1 || true
fi
