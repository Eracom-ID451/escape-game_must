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
H="$A/6c7b4cdf-410a-462d-be4f-2f3e146fd4e2"   # Accueil
M="$A/1333cfc3-cc23-48de-a370-5e55aecc7656"   # Message M.U.S.T (accueil)
R="$A/fca0fd3b-ffba-4279-bab4-470a3fa66b55"   # Réglages et message M.U.S.T (aide)
F="$A/b7f5cda0-179f-42fe-aa12-5474efaa8031"   # Étagères du frigo
P="$A/ded59595-0aea-490c-9f1d-d6b0c18a823e"   # Aperçu (pâtes)
I="$A/58afb9b7-5dec-4d95-ba36-292f7590f3eb"   # Fiche (yaourt)
NA="$A/4dc156ed-9674-4d1f-ae07-140a7e2017d4"  # Fiche (pomme)
NC="$A/3b3e574e-aaaf-45d0-9888-e7a9ce024ad7"  # Fiche (pâtes)
ND="$A/6a3342ff-3eb0-466f-97ce-f5aea7933945"  # Fiche (canette)
NE="$A/44feb8e2-1694-4516-9711-00d29a4804c2"  # Fiche (cupcake)

# Accueil
get tile-frigo.png "$H/8b027.png"
get tile-notes.png "$H/67a71.png"
get tile-calendrier.png "$H/b583c.png"
get tile-parametres.png "$H/1581a.png"
get btn-power.png "$H/ccdfb.png"

# Boutons de fermeture
get btn-close.svg "$F/2fb7b.svg"
get must-close-l.svg "$M/56c12.svg"
get must-close-m.svg "$R/a4414.svg"
get info-close.svg "$I/24da4.svg"

# Réglages
get slider.svg "$R/80b94.svg"
get icon-recettes.png "$R/b40e0.png"
get icon-alertes.png "$R/ebf9e.png"
get icon-infos.png "$R/eda65.png"
get icon-aide.png "$R/b96eb.png"

# Frigo
get shelf.svg "$F/c550c.svg"
get shelf-faded.svg "$P/a77b8.svg"
get btn-back.png "$P/e47e6.png"
get food-pates.png "$P/c66a5.png"
get food-coca.png "$F/c850b.png"
get food-yaourt.png "$F/adf1f.png"
get food-lait.png "$F/77be1.png"
get food-frites.png "$F/e50f9.png"
get food-poulet.png "$F/13b0f.png"
get food-jambon.png "$F/fa053.png"
get food-brocoli.png "$F/23738.png"
get food-carotte.png "$F/c6685.png"
get food-gateau.png "$F/93ada.png"
get food-pomme.png "$F/e0ca2.png"
get food-cupcake.png "$F/96e63.png"
get food-riz.png "$F/8c4d6.png"

# Nutri-Score
get nutriscore-a.png "$NA/816b0.png"
get nutriscore-b.png "$I/27f4d.png"
get nutriscore-c.png "$NC/5cc76.png"
get nutriscore-d.png "$ND/4e539.png"
get nutriscore-e.png "$NE/410a0.png"
