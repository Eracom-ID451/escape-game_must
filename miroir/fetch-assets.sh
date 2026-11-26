#!/bin/sh
# Télécharge les images exportées depuis Figma (liens valables jusqu’au 3 décembre 2026).
set -e
cd "$(dirname "$0")"
mkdir -p assets
cd assets

get() {
	curl -fsSL -o "$1" "$2"
	echo "$1"
}

A="https://www.figma.com/api/mcp/asset"
D="$A/1a83be68-d7d7-424e-b229-cda694e71b35"   # Bureau
I="$A/91919a50-28e2-49cf-a801-72f1ab40fba8"   # Message M.U.S.T
E="$A/f31809d6-eff8-4d6e-9d51-5cc949e15177"   # Accès interdit
M="$A/99581ada-75b7-4768-98f0-d92a6116c383"   # Maps
W="$A/971c7da2-6e16-469c-9b49-a0c4d0fcdd86"   # Météo
N="$A/4f082e37-12c3-4d9c-8a80-265d047ca3eb"   # Internet

# Bureau
get desktop.svg "$D/e9476.svg"
get icon-media.png "$D/d97f7.png"
get icon-maps.png "$D/00e38.png"
get icon-settings.png "$D/6ca7f.png"
get icon-weather.png "$D/79b18.png"
get icon-mail.png "$D/265e5.png"
get icon-camera.png "$D/76439.png"
get icon-calendar.png "$D/6a7c7.png"
get icon-music.png "$D/6b6c9.png"
get icon-slideshow.png "$D/2d5e4.png"
get icon-cards.png "$D/043e3.png"
get icon-internet.png "$D/f6823.png"
get icon-msn.png "$D/1e8c4.png"

# Boutons des barres de titre, par taille de fenêtre
get btn-xl-close.svg "$I/b7c24.svg"
get btn-xl-maximize.svg "$I/1dbcd.svg"
get btn-l-close.svg "$M/d6d03.svg"
get btn-l-maximize.svg "$M/d6293.svg"
get btn-m-close.svg "$W/a6873.svg"
get btn-m-maximize.svg "$W/51cfd.svg"
get btn-s-close.svg "$E/72f0a.svg"
get btn-s-maximize.svg "$E/71c53.svg"

# Applications et dialogues
get map.png "$M/329c2.png"
get cards.png "$A/0b6aa1fe-3fa3-4485-a8b7-7ccfab596bc6.png"
get internet-frame.svg "$N/13383.svg"
get cursor-wait.png "$N/7f306.png"
get icon-error.png "$E/31956.png"
