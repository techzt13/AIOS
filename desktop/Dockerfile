FROM lscr.io/linuxserver/webtop:ubuntu-xfce

USER root

ENV DEBIAN_FRONTEND=noninteractive \
    WHITE_SUR_GTK_REPO=https://github.com/vinceliuice/WhiteSur-gtk-theme.git \
    WHITE_SUR_ICON_REPO=https://github.com/vinceliuice/WhiteSur-icon-theme.git \
    WHITE_SUR_CURSOR_REPO=https://github.com/vinceliuice/WhiteSur-cursors.git

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
    firefox \
    mousepad \
    network-manager-gnome \
    plank \
    python3 \
    thunar \
    xfce4-pulseaudio-plugin \
    xfce4-terminal \
    xfce4-whiskermenu-plugin \
    fonts-inter \
  && rm -rf /var/lib/apt/lists/*

RUN set -eux; \
  tmpdir="$(mktemp -d)"; \
  git clone --depth 1 "$WHITE_SUR_GTK_REPO" "$tmpdir/WhiteSur-gtk-theme"; \
  "$tmpdir/WhiteSur-gtk-theme/install.sh" -d /usr/share/themes -l -N stable; \
  git clone --depth 1 "$WHITE_SUR_ICON_REPO" "$tmpdir/WhiteSur-icon-theme"; \
  "$tmpdir/WhiteSur-icon-theme/install.sh" -d /usr/share/icons -b; \
  git clone --depth 1 "$WHITE_SUR_CURSOR_REPO" "$tmpdir/WhiteSur-cursors"; \
  "$tmpdir/WhiteSur-cursors/install.sh" -d /usr/share/icons; \
  rm -rf "$tmpdir"

COPY desktop/assets/aios-wallpaper.svg /usr/local/share/aios-theme/assets/aios-wallpaper.svg
COPY desktop/scripts/aios-open-control-layer.sh /usr/local/bin/aios-open-control-layer
COPY desktop/scripts/apply-theme.sh /usr/local/bin/aios-apply-theme
COPY desktop/AIOS.desktop /usr/share/applications/AIOS.desktop
COPY desktop/xfce/ /usr/local/share/aios-theme/xfce/

RUN chmod +x /usr/local/bin/aios-open-control-layer /usr/local/bin/aios-apply-theme \
  && install -d -m 0755 /etc/xdg/autostart \
  && cp /usr/local/share/aios-theme/xfce/autostart/aios-theme.desktop /etc/xdg/autostart/aios-theme.desktop \
  && cp /usr/local/share/aios-theme/xfce/autostart/plank.desktop /etc/xdg/autostart/plank.desktop \
  && apt-get clean
