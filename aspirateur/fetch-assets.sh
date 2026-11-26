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
S="$A/25affa74-7168-4c9b-a592-2029a3f959cb"   # Statut
E="$A/fa07531e-1857-495d-9a8f-b2cd6d8a21ed"   # Information système + Erreur

# Application
get help.png "$S/b96eb.png"
get divider.svg "$S/35063.svg"
get battery.png "$S/ac4cc.png"
get bin.png "$S/3b286.png"

# Plan de l’appartement (export du groupe, image 2×)
get map.png "$A/887c092d-5c34-4cc0-a70a-a145c0f84126.png"

# Boutons des barres de titre, par taille de fenêtre
get btn-xs-close.svg "$S/0d500.svg"
get btn-xs-maximize.svg "$S/7a5b6.svg"
get btn-s-close.svg "$E/9fec9.svg"
get btn-s-maximize.svg "$E/1d3df.svg"

# Dialogue d’erreur
get icon-error.png "$E/31956.png"
