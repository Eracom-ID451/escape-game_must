// Miroir – ouverture et fermeture des fenêtres du bureau.
//
// Un élément avec data-open="id" ouvre la fenêtre #id au premier plan.
// Un élément avec data-close ferme la fenêtre (ou le dialogue) qui le contient.
// Internet affiche son écran de chargement, puis « Accès interdit ».

const INTERNET_DELAY = 2500; // ms

let zIndex = 10;

function openWindow(id) {
	const target = document.getElementById(id);
	if (!target) return;
	target.hidden = false;
	target.style.zIndex = ++zIndex;

	if (id === "internet") {
		setTimeout(() => {
			if (!target.hidden) openWindow("erreur");
		}, INTERNET_DELAY);
	}
}

function closeWindow(element) {
	element.closest(".app, .dialog").hidden = true;
}

document.addEventListener("click", (event) => {
	const opener = event.target.closest("[data-open]");
	if (opener) return openWindow(opener.dataset.open);

	const closer = event.target.closest("[data-close]");
	if (closer) closeWindow(closer);
});

// Horloge du bureau
const clock = document.querySelector(".desk-clock");

function tick() {
	const now = new Date();
	clock.textContent = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
}

tick();
setInterval(tick, 10000);

// Le message d’introduction est au premier plan au démarrage
openWindow("intro");
