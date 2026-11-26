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

F="https://www.figma.com/api/mcp/asset/914d0ecb-b8f4-4a9f-afa3-3993288f4b60"   # Frigo
A="https://www.figma.com/api/mcp/asset/1ada545a-25b7-4be6-9d7d-0bf8f74bfcad"   # Aspirateur
M="https://www.figma.com/api/mcp/asset/14b9a267-25da-44dc-acb8-eeed45446497"   # Miroir
R="https://www.figma.com/api/mcp/asset/cf3233c4-1a1b-486e-8795-ddd7bdef27ae"   # Réveil
T="https://www.figma.com/api/mcp/asset/0a80a176-5c4d-48d7-8bc6-19305c98fa68"   # Thermostat
S="https://www.figma.com/api/mcp/asset/85ad4a68-1eda-4a50-be08-1c22cfefa21a"   # Dialogue réussite
E="https://www.figma.com/api/mcp/asset/d784f0e6-c613-4931-81f2-956ef14f54fe"   # Dialogue erreur
P="https://www.figma.com/api/mcp/asset/e1441395-c2c0-4bcb-ac7c-56bca73777d7"   # Menu principal

# Stations
get texture-glass.png "$F/58156.png"
get icon-close.svg "$F/b8996.svg"
get icon-maximize.svg "$F/e4435.svg"
get bg-frigo.png "$F/1dad5.png"
get photo-frigo.png "$F/8c53d.png"
get bg-aspirateur.png "$A/b9370.png"
get bg-miroir.png "$M/43968.png"
get bg-reveil.png "$R/d6c29.png"
get bg-thermostat.png "$T/89ed9.png"

# Dans la maquette, la photo de ces stations est leur image de fond recadrée
for id in aspirateur miroir reveil thermostat; do
	cp "bg-$id.png" "photo-$id.png"
done

# Dialogues
get smiley.png "$S/ac6aa.png"
get icon-dialog-close.svg "$S/04ebe.svg"
get icon-dialog-maximize.svg "$S/d3d12.svg"
get icon-error.png "$E/31956.png"

# Menu principal
get bg-menu.png "$P/7bf67.png"
get icon-warning.png "$P/ebf9e.png"
get icon-mini-close.svg "$P/26fc3.svg"
get icon-mini-maximize.svg "$P/c88f7.svg"
get icon-frigo.png "$P/4ad0a.png"
get icon-aspirateur.png "$P/54ae8.png"
get icon-miroir.png "$P/e79a2.png"
get icon-reveil.png "$P/c1edd.png"
get icon-thermostat.png "$P/92335.png"
get icon-capture.png "$P/0c798.png"
get icon-camera.png "$P/83d40.png"
get icon-windows.png "$P/a6166.png"
get icon-untitled.png "$P/c1a83.png"
get icon-help.png "$P/b40e0.png"
get icon-search.png "$P/02604.png"
get icon-volume.png "$P/554ff.png"
get icon-recycle.png "$P/d21d0.png"

# Plan de l’appartement et statut « Connecté »
get bg-plan.png "https://www.figma.com/api/mcp/asset/535ec2d0-5b48-49e6-bdfb-be2cf2f4064e/d3ce1.png"
get plan.png "https://www.figma.com/api/mcp/asset/dbd6d549-9a0e-488c-b43d-dcea1498786b.png"
get icon-connected.png "https://www.figma.com/api/mcp/asset/8474d1a9-33c1-496c-bc6c-313bcce2e725/03fe5.png"
