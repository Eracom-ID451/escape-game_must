// Écran d’une station (frigo, aspirateur, miroir, réveil, thermostat).
//
// Usage :
//	<body class="station--frigo">
//	<main class="stage"></main>
//	<script src="../shared/js/stage.js"></script>
//	<script src="js/station.js"></script>
//	<script>
//		mountStation(document.querySelector(".stage"), {
//			id: "frigo",
//			title: "Frigo",
//			solution: "0000",
//			success: "Bravo (H)\nVous avez débloqué\nle frigo",
//		});
//	</script>
//
// Le fond, la photo et la position de la fenêtre sont réglés dans css/style.css
// (classe station--<id>). La photo est assets/photo-<id>.png.
//
// À la validation, l’événement « station:validate » est émis sur document
// avec { id, code, correct }. Une station réussie est notée dans localStorage
// (clé « must:<id> ») et le bouton OK ramène au menu, où elle s’affiche « Connecté ».
// Le bouton × de la fenêtre ramène aussi au menu.

const DIGITS = 4;

const ARROW = `<svg class="arrow" viewBox="0 0 16 16" aria-hidden="true"><rect x="5.5" y="4" width="1" height="8"/><rect x="6.5" y="5" width="1" height="6"/><rect x="7.5" y="6.5" width="1" height="3"/><rect x="8.5" y="7.5" width="1" height="1"/></svg>`;

function titlebarHTML(title, titleId, icons) {
	return `
		<header class="titlebar">
			<h1 class="titlebar__title" id="${titleId}">${title}</h1>
			<span class="titlebar__btn titlebar__btn--min relief-button" aria-hidden="true"></span>
			<span class="titlebar__btn titlebar__btn--max relief-button" aria-hidden="true"><img src="assets/${icons}-maximize.svg" alt=""></span>
			<button type="button" class="titlebar__btn titlebar__btn--close relief-button" aria-label="Fermer"><img src="assets/${icons}-close.svg" alt=""></button>
		</header>`;
}

function digitHTML(i) {
	return `
		<div class="digit">
			<button type="button" class="digit__btn relief-arrow" data-digit="${i}" data-step="1" aria-label="Chiffre ${i + 1} plus">${ARROW.replace('class="arrow"', 'class="arrow arrow--up"')}</button>
			<output class="digit__value">0</output>
			<button type="button" class="digit__btn relief-arrow" data-digit="${i}" data-step="-1" aria-label="Chiffre ${i + 1} moins">${ARROW.replace('class="arrow"', 'class="arrow arrow--down"')}</button>
		</div>`;
}

function dialogHTML(type, title, icon, text) {
	return `
		<div class="dialog dialog--${type}" hidden>
			<section class="window window--dialog relief-window" role="alertdialog" aria-labelledby="dialog-${type}-title">
				${titlebarHTML(title, `dialog-${type}-title`, "icon-dialog")}
				<img class="dialog__icon" src="assets/${icon}" alt="">
				<p class="dialog__text">${text}</p>
				<button type="button" class="btn btn--ok">OK</button>
			</section>
		</div>`;
}

function mountStation(container, { id, title, solution = "0000", success = "Bravo" }) {
	container.innerHTML = `
		<p class="logo">M.U.S.T</p>

		<section class="window window--station relief-window" aria-labelledby="station-title">
			${titlebarHTML(title, "station-title", "icon")}
		</section>

		<div class="photo"><img src="assets/photo-${id}.png" alt=""></div>

		<form class="code" autocomplete="off">
			<h2 class="code__title">Code</h2>
			<div class="code__digits">${Array.from({ length: DIGITS }, (_, i) => digitHTML(i)).join("")}</div>
			<button type="submit" class="btn btn--validate">Valider</button>
		</form>

		${dialogHTML("success", "Résultat", "smiley.png", success)}
		${dialogHTML("error", "", "icon-error.png", "Essayez\nà nouveau")}
	`;

	const form = container.querySelector(".code");
	const values = [...container.querySelectorAll(".digit__value")];
	const successDialog = container.querySelector(".dialog--success");
	const errorDialog = container.querySelector(".dialog--error");
	const digits = new Array(DIGITS).fill(0);

	function render() {
		values.forEach((output, i) => output.textContent = digits[i]);
	}

	// Flèches : chaque chiffre tourne de 0 à 9
	form.addEventListener("click", (event) => {
		const button = event.target.closest(".digit__btn");
		if (!button) return;
		const i = Number(button.dataset.digit);
		digits[i] = (digits[i] + Number(button.dataset.step) + 10) % 10;
		form.classList.remove("is-wrong", "is-correct");
		render();
	});

	// Validation
	form.addEventListener("submit", (event) => {
		event.preventDefault();
		const code = digits.join("");
		const correct = code === String(solution);

		form.classList.add(correct ? "is-correct" : "is-wrong");
		(correct ? successDialog : errorDialog).hidden = false;

		if (correct) {
			try { localStorage.setItem(`must:${id}`, "1"); } catch (error) {}
		}
		document.dispatchEvent(new CustomEvent("station:validate", { detail: { id, code, correct } }));
	});

	function backToMenu() {
		location.href = "index.html";
	}

	function closeError() {
		errorDialog.hidden = true;
		form.classList.remove("is-wrong");
	}

	// OK et × : le dialogue d’erreur se ferme ; le dialogue de réussite
	// et la fenêtre de la station ramènent au menu principal
	errorDialog.querySelectorAll(".btn--ok, .titlebar__btn--close").forEach((button) => button.addEventListener("click", closeError));
	successDialog.querySelectorAll(".btn--ok, .titlebar__btn--close").forEach((button) => button.addEventListener("click", backToMenu));
	container.querySelector(".window--station .titlebar__btn--close").addEventListener("click", backToMenu);

	render();
}
