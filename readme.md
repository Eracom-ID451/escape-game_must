# Escape Game – M.U.S.T

Eracom ID451

HTML, CSS et JavaScript sans dépendance. Un dossier par station ; ouvrir son `index.html` dans un navigateur.

- `controle/` : contrôle (menu principal et saisie des codes des stations), 1920 × 1080
- `miroir/` : bureau du miroir (mail, météo, maps, calendrier…), 1024 × 768
- `shared/` : police Recursive, styles « Windows 95 » communs (`css/win95.css`) et mise à l’échelle de la scène (`js/stage.js`)

Le thermostat est dans son propre dépôt : <https://eracom-id451.github.io/temp-ctrl/>

Chaque écran est une scène aux dimensions de la maquette Figma, mise à l’échelle de la fenêtre par `shared/js/stage.js`.

## Images

Les images exportées de Figma se téléchargent par station, avec le script du dossier (liens valables jusqu’au 3 décembre 2026) :

```sh
./controle/fetch-assets.sh
./miroir/fetch-assets.sh
```

Police : [Recursive](https://www.recursive.design) (SIL OFL), auto-hébergée dans `shared/fonts/`.

## Contrôle

Les cinq écrans de code partagent `controle/js/station.js`. Le titre, le code et le message de réussite se règlent dans chaque page :

```js
mountStation(document.querySelector(".stage"), {
	id: "frigo",
	title: "Frigo",
	solution: "0000",
	success: "Bravo (H)\nVous avez débloqué\nle frigo",
});
```

- À la validation, l’événement `station:validate` est émis sur `document` avec `{ id, code, correct }`.
- Une station réussie est notée dans `localStorage` (clé `must:<id>`) ; le bouton OK du dialogue ramène au menu.

## Miroir

Un seul écran : le bureau. Un élément `data-open="id"` ouvre la fenêtre `#id`, un élément `data-close` ferme la fenêtre qui le contient (`miroir/js/miroir.js`). Le message d’introduction s’affiche au démarrage ; les applications sans écran dans la maquette affichent « Accès interdit ».
