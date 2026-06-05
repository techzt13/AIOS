# AIOS desktop theme (XFCE, macOS-inspired)

AIOS ships a **macOS-inspired** desktop on top of XFCE. It is not macOS and is not affiliated with Apple.

## Applied defaults

At container boot, AIOS applies:

- WhiteSur GTK + xfwm4 theme (window controls on the left)
- WhiteSur icon theme
- WhiteSur cursor theme
- Inter font (open-source substitute for proprietary SF)
- AIOS abstract gradient wallpaper
- A top XFCE panel (menu/app area + status area)
- A bottom-center Plank dock (with magnification) pinned to:
  - Thunar (Files)
  - xfce4-terminal (Terminal)
  - Mousepad (Text Editor)
  - Firefox
  - AIOS Control Layer (`http://localhost:8080`, fallback `http://aios:8080`)

## Upstream theme sources and licenses

- WhiteSur GTK theme: <https://github.com/vinceliuice/WhiteSur-gtk-theme> (GPL-3.0)
- WhiteSur icon theme: <https://github.com/vinceliuice/WhiteSur-icon-theme> (GPL-3.0)
- WhiteSur cursors: <https://github.com/vinceliuice/WhiteSur-cursors> (GPL-3.0)
- Inter font package: Ubuntu `fonts-inter` (SIL Open Font License)
- AIOS wallpaper: `desktop/assets/aios-wallpaper.svg` (created for this project, CC0-1.0)

## Customizing or disabling

- Runtime override: set `AIOS_THEME_DISABLE=1` in the desktop container environment to skip automatic theme application.
- User customization: edit files under `~/.config/xfce4/` and `~/.config/plank/` inside the desktop container.
- Re-apply defaults: delete `~/.config/aios/theme-initialized` and restart the desktop session.
