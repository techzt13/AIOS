FROM lscr.io/linuxserver/webtop:ubuntu-xfce

USER root

RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    xfce4-terminal \
    thunar \
    mousepad \
    firefox \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
