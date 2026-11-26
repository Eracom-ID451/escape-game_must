# Escape Game – M.U.S.T

Eracom ID451

## Structure

HTML, CSS et JavaScript sans dépendance. Ouvrir `index.html` dans un navigateur.

L’écran est une scène de 1920 × 1080 (taille des maquettes Figma) mise à l’échelle de la fenêtre par `js/stage.js`. La solution se règle dans `index.html`.

## Énigme bonus

`js/enigme-bonus.js` fournit `mountEnigmeBonus(conteneur, { solution })`, qui remplace le contenu du conteneur par l’écran.

- À la validation, l’événement `enigme:validate` est émis sur `document` avec `{ code, correct }`.
- Clavier physique : lettres, flèches gauche/droite, Retour arrière, Entrée.

Police : [Recursive](https://www.recursive.design) (SIL OFL), auto-hébergée dans `fonts/`.

## Images

Les images exportées de Figma se téléchargent avec `./fetch-assets.sh` (liens valables jusqu’au 3 décembre 2026).
