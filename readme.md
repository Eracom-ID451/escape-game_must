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

Parcours du prototype Figma :

- `controle/index.html` : accueil (« Hello. ») ; le bouton « Appareils » ouvre le menu, le bouton « M.U.S.T » de la barre des tâches y ramène
- `controle/menu.html` : menu principal ; chaque fenêtre ouvre l’écran de code de sa station, et affiche « Connecté » avec sa lettre (H, I, E, C, N) une fois la station réussie
- `controle/<station>.html` : saisie du code (Réveil 1448, Frigo 7231, Aspirateur 4530, Miroir 1725, Thermostat 2042, codes du prototype Figma) ; le × ramène au menu
- `controle/final.html` : « Terminé ! », affiché après la cinquième station réussie
- `controle/plan.html` : plan de l’appartement (bouton du menu)
- `controle/chien.html` et `controle/bonus.html` : Marley et l’énigme bonus (icônes chien et livre de la barre des tâches), code « marley », puis `chien-reussite.html`

Les cinq écrans de code partagent `controle/js/station.js` ; le titre, le code et le message de réussite se règlent dans chaque page :

```js
mountStation(document.querySelector(".stage"), {
	id: "frigo",
	title: "Frigo",
	solution: "7231",
	success: "Bravo (H)\nVous avez débloqué\nle frigo",
});
```

- À la validation, l’événement `station:validate` est émis sur `document` avec `{ id, code, correct }`.
- Une station réussie est notée dans `localStorage` (clé `must:<id>`). Remise à zéro : `controle/menu.html?reset`, ou relancer Chrome en navigation privée (voir plus bas).

## Miroir

Un seul écran : le bureau. Un élément `data-open="id"` ouvre la fenêtre `#id`, un élément `data-close` ferme la fenêtre qui le contient (`miroir/js/miroir.js`). Le message d’introduction s’affiche au démarrage ; les applications sans écran dans la maquette affichent « Accès interdit ».

## Mode kiosque (Chrome, macOS)

```sh
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --kiosk --incognito --user-data-dir=/tmp/kiosk --noerrdialogs --disable-pinch --overscroll-history-navigation=0 "URL"
```

- `URL` : la page de la station, par exemple `file:///Users/adrien/gitRepos/escape-game_must/miroir/index.html`, ou son adresse GitHub Pages.
- `--user-data-dir` ouvre une instance séparée : sans lui, si Chrome est déjà ouvert, la commande ouvre seulement un onglet normal.
- `--noerrdialogs --disable-pinch --overscroll-history-navigation=0` : pas de fenêtres d’erreur, pas de zoom au pincement ni de retour arrière au balayage (écrans tactiles).
- `--incognito` : rien n’est gardé d’un lancement à l’autre. Quitter et relancer Chrome remet donc toutes les stations à zéro (seul contrôle garde un état, les stations réussies).
- Quitter : Cmd+Q.
