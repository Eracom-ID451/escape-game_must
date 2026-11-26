// Aspirateur – menu de l’application et fenêtres.
//
// Un bouton du menu avec data-panel="id" affiche le panneau #id (les autres sont cachés).
// Un élément avec data-open="id" ouvre l’écran ou le dialogue #id au premier plan.
// Un élément avec data-close ferme l’écran (ou le dialogue) qui le contient.

let zIndex = 10;

function showPanel(id) {
	document.querySelectorAll(".panel").forEach((panel) => {
		panel.hidden = panel.id !== id;
	});
	document.querySelectorAll(".menu__btn[data-panel]").forEach((button) => {
		button.classList.toggle("is-active", button.dataset.panel === id);
	});
}

function openWindow(id) {
	const target = document.getElementById(id);
	if (!target) return;
	target.hidden = false;
	target.style.zIndex = ++zIndex;
}

function closeWindow(element) {
	element.closest(".screen, .dialog").hidden = true;
}

document.addEventListener("click", (event) => {
	const tab = event.target.closest("[data-panel]");
	if (tab) return showPanel(tab.dataset.panel);

	const opener = event.target.closest("[data-open]");
	if (opener) return openWindow(opener.dataset.open);

	const closer = event.target.closest("[data-close]");
	if (closer) closeWindow(closer);
});

// Au démarrage : panneau Statut, et le message d’aide au premier plan
showPanel("statut");
openWindow("aide");
