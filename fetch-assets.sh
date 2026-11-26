#!/bin/sh
# Télécharge les images exportées depuis Figma (liens valables jusqu’au 3 décembre 2026).
set -e
cd "$(dirname "$0")/assets"
P="https://www.figma.com/api/mcp/asset/60697ef6-738c-4129-8c69-49fd92d449d0"
curl -fL -o background.png "$P/d2a2f.png"
curl -fL -o icon-close.svg "$P/b8996.svg"
curl -fL -o icon-maximize.svg "$P/e4435.svg"
