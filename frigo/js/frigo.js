// Frigo – écran tactile du frigo connecté.
//
// Accueil : quatre vignettes ouvrent les applications (data-open="id").
// Le bouton du coin éteint l’écran (data-power) ou, dans une application, revient à l’accueil (data-home).
// Dans le frigo, un aliment ouvre son aperçu, « Plus d’infos » sa fiche.
// Un élément avec data-close ferme le dialogue qui le contient.

// Aliments du frigo, dans l’ordre d’empilement (le riz passe sous la canette). Positions en px de maquette : [gauche, haut, largeur, hauteur].
//   frigo : sur les étagères ; apercu : la grande image ; logo : le Nutri-Score dans la fiche.
//   recadrage : position de l’image dans son cadre quand elle est recadrée ; tourne : image tournée de 90°.
const ALIMENTS = [
	{
		nom: "Pâtes", titre: "Pâtes", image: "food-pates.png",
		frigo: [80, 137, 237, 132], apercu: [91, 331, 585, 326],
		peremption: "01/05/2026", prix: "7.-", quantite: "150g",
		nutriscore: "c", logo: [395, 563, 169, 93],
	},
	{
		nom: "Riz", titre: "Riz", image: "food-riz.png",
		frigo: [160, 544, 163, 163], apercu: [105, 254, 558, 558],
		peremption: "01/05/2026", prix: "3.-", quantite: "120g",
		nutriscore: "a", logo: [393, 538, 162, 159],
	},
	{
		nom: "Canette de Coca-cola", titre: "Canette de coca-cola", image: "food-coca.png",
		frigo: [310, 550, 104, 157], apercu: [205, 288, 366, 552],
		recadrage: "left: -163.43%; top: 0; width: 301.39%; height: 100%",
		peremption: "02/03/2026", prix: "1.-", quantite: "330ml",
		nutriscore: "d", logo: [380, 579, 186, 102],
	},
	{
		nom: "Yahourt Fraise", titre: "Yahourt fraise", image: "food-yaourt.png",
		frigo: [160, 790, 119, 120], apercu: [165, 322, 438, 442],
		recadrage: "left: 0; top: 0; width: 100%; height: 106.87%",
		peremption: "01/05/2026", prix: "1.-", quantite: "125g",
		nutriscore: "b", logo: [378, 583, 188, 103],
	},
	{
		nom: "Brique de lait", titre: "Brique de lait", image: "food-lait.png",
		frigo: [559, 557, 133, 140], apercu: [179, 344, 410, 431],
		recadrage: "left: -53.89%; top: -50.26%; width: 209.44%; height: 199.47%",
		peremption: "03/06/2026", prix: "2.-", quantite: "500ml",
		nutriscore: "b", logo: [389, 570, 177, 97],
	},
	{
		nom: "Portion de frites", titre: "Portion de frites", image: "food-frites.png",
		frigo: [72, 337, 147, 147], apercu: [165, 327, 446, 446],
		peremption: "01/05/2026", prix: "4.-", quantite: "60g",
		nutriscore: "d", logo: [396, 577, 170, 93],
	},
	{
		nom: "Poulet", titre: "Poulet", image: "food-poulet.png",
		frigo: [279, 119, 188, 188], apercu: [9, 136, 748, 748],
		peremption: "01/05/2026", prix: "9.-", quantite: "100g",
		nutriscore: "b", logo: [394, 562, 172, 94],
	},
	{
		nom: "Jambon", titre: "Jambon", image: "food-jambon.png",
		frigo: [18, 579, 147, 147], apercu: [80, 226, 607, 607],
		peremption: "01/05/2026", prix: "7.-", quantite: "80g",
		nutriscore: "a", logo: [396, 552, 159, 156],
	},
	{
		nom: "Brocoli", titre: "Brocoli", image: "food-brocoli.png",
		frigo: [456, 742, 185, 185], apercu: [95, 220, 579, 579],
		peremption: "01/05/2026", prix: "2.-", quantite: "30g",
		nutriscore: "a", logo: [396, 554, 153, 150],
	},
	{
		nom: "Carotte", titre: "Carotte", image: "food-carotte.png", tourne: true,
		frigo: [524, 348, 202, 202], apercu: [75, 221, 617, 617],
		peremption: "01/05/2026", prix: "2.-", quantite: "23g",
		nutriscore: "b", logo: [394, 571, 168, 92],
	},
	{
		nom: "Gâteau", titre: "Gâteau", image: "food-gateau.png",
		frigo: [321, 312, 215, 215], apercu: [48, 159, 672, 672],
		peremption: "01/05/2026", prix: "5.-", quantite: "70g",
		nutriscore: "e", logo: [394, 565, 166, 91],
	},
	{
		nom: "Pomme", titre: "Pomme", image: "food-pomme.png",
		frigo: [-10, 148, 144, 144], apercu: [0, 129, 766, 766],
		peremption: "01/05/2026", prix: "1.-", quantite: "50g",
		nutriscore: "a", logo: [394, 553, 169, 166],
	},
	{
		nom: "Cupcake", titre: "Cupcake", image: "food-cupcake.png",
		frigo: [591, 781, 203, 135], apercu: [-28, 250, 823.42, 548],
		peremption: "01/05/2026", prix: "4.-", quantite: "65g",
		nutriscore: "e", logo: [391, 589, 175, 96],
	},
];

const scene = document.querySelector(".stage"); // « stage » est déjà déclaré par shared/js/stage.js
const badge = document.querySelector(".badge");
const fridge = document.getElementById("frigo");
const preview = fridge.querySelector(".preview");
const info = fridge.querySelector(".info");

let current = null; // aliment affiché dans l’aperçu

// Place un élément selon [gauche, haut, largeur, hauteur]
function place(element, [l, t, w, h]) {
	element.style.left = `${l}px`;
	element.style.top = `${t}px`;
	element.style.width = `${w}px`;
	element.style.height = `${h}px`;
}

// Remplit une image d’aliment (recadrée ou non)
function fillImage(img, aliment) {
	img.src = `assets/${aliment.image}`;
	img.alt = aliment.nom;
	if (aliment.recadrage) img.style.cssText = aliment.recadrage;
	else img.removeAttribute("style");
}

// ---------- Étagères ----------

const foods = fridge.querySelector(".foods");

ALIMENTS.forEach((aliment, index) => {
	const button = document.createElement("button");
	button.type = "button";
	button.className = aliment.tourne ? "food food--rot" : "food";
	button.dataset.food = index;
	place(button, aliment.frigo);
	const img = document.createElement("img");
	fillImage(img, aliment);
	button.append(img);
	foods.append(button);
});

// ---------- Aperçu et fiche ----------

function openPreview(aliment) {
	current = aliment;
	preview.querySelector(".preview__title").textContent = aliment.nom;
	const frame = preview.querySelector(".preview__image");
	frame.classList.toggle("food--rot", Boolean(aliment.tourne));
	place(frame, aliment.apercu);
	fillImage(frame.querySelector("img"), aliment);
	fridge.classList.add("is-faded");
	info.hidden = true;
	preview.hidden = false;
}

function openInfo() {
	const aliment = current;
	info.querySelector(".info__title").textContent = aliment.titre;
	info.querySelector(".info__date").textContent = `Date de péremption: ${aliment.peremption}`;
	info.querySelector(".info__prix").textContent = aliment.prix;
	info.querySelector(".info__quantite").textContent = aliment.quantite;
	const logo = info.querySelector(".info__nutriscore");
	logo.src = `assets/nutriscore-${aliment.nutriscore}.png`;
	logo.alt = `Nutri-Score ${aliment.nutriscore.toUpperCase()}`;
	place(logo, aliment.logo);
	preview.hidden = true;
	info.hidden = false;
}

// Retour aux étagères
function closeFood() {
	preview.hidden = true;
	info.hidden = true;
	fridge.classList.remove("is-faded");
	current = null;
}

// ---------- Applications ----------

function openApp(id) {
	closeApps();
	document.getElementById(id).hidden = false;
	scene.dataset.app = id;
	if (id === "notes") badge.hidden = true;
}

function closeApps() {
	document.querySelectorAll(".app").forEach((app) => (app.hidden = true));
	document.querySelectorAll(".dialog").forEach((dialog) => (dialog.hidden = true));
	closeFood();
	delete scene.dataset.app;
}

function openWindow(id) {
	const target = document.getElementById(id);
	if (target.classList.contains("app")) openApp(id);
	else target.hidden = false;
}

// ---------- Clics ----------

document.addEventListener("click", (event) => {
	const target = event.target;

	const opener = target.closest("[data-open]");
	if (opener) return openWindow(opener.dataset.open);

	const food = target.closest("[data-food]");
	if (food) return openPreview(ALIMENTS[food.dataset.food]);

	if (target.closest("[data-infos]")) return openInfo();
	if (target.closest("[data-close-info]")) return openPreview(current);
	if (target.closest("[data-back]")) return closeFood();
	if (target.closest("[data-home]")) return closeApps();

	if (target.closest("[data-power]")) {
		const screen = document.getElementById("eteint");
		screen.hidden = !screen.hidden;
		return;
	}

	const closer = target.closest("[data-close]");
	if (closer) closer.closest(".dialog").hidden = true;
});

// ---------- Horloge (format 10:32AM) ----------

const clock = document.querySelector(".clock");

function tick() {
	const now = new Date();
	const hours = now.getHours();
	const minutes = String(now.getMinutes()).padStart(2, "0");
	clock.textContent = `${hours % 12 || 12}:${minutes}${hours < 12 ? "AM" : "PM"}`;
}

tick();
setInterval(tick, 10000);
