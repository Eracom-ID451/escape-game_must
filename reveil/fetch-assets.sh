#!/bin/sh
# Télécharge les images exportées depuis Figma (liens valables jusqu’au 3 décembre 2026).
# Les chiffres à sept segments ne sont pas des images : js/reveil.js les dessine.
set -e
cd "$(dirname "$0")"
mkdir -p assets
cd assets

get() {
	curl -fsSL -o "$1" "$2"
	echo "$1"
}

A="https://www.figma.com/api/mcp/asset"
R="$A/18dc1a51-e4cb-415c-8c5b-4e97307973be"   # Radio

# Icône du bouton clavier (radio et température)
get calculator.png "$R/b3f12.png"
