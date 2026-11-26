// Écran « Énigme bonus ».
//
// Usage :
//	<script src="js/enigme-bonus.js"></script>
//	<script>mountEnigmeBonus(document.querySelector(".stage"), { solution: "abcdef" })</script>
//
// Le contenu du conteneur est remplacé par l’écran.
// À la validation, l’événement « enigme:validate » est émis sur document
// avec { code, correct }.

const ROWS = [
	["q", "w", "e", "r", "t", "z", "u", "i", "o", "p"],
	["a", "s", "d", "f", "g", "h", "j", "k", "l"],
	["ArrowLeft", "y", "x", "c", "v", "b", "n", "m", "ArrowRight"],
];

const CODE_LENGTH = 6;

const ARROW = `<svg class="arrow" width="43" height="43" viewBox="0 0 43 43" aria-hidden="true"><rect x="10.12" y="2.53" width="5.06" height="40.47"/><rect x="15.18" y="7.59" width="5.06" height="30.35"/><rect x="20.24" y="15.18" width="5.06" height="15.18"/><rect x="25.29" y="20.24" width="5.06" height="5.06"/></svg>`;

function keyHTML(key) {
	if (key === "ArrowLeft") return `<button type="button" class="key key--wide key--prev" data-key="${key}" aria-label="Case précédente">${ARROW}</button>`;
	if (key === "ArrowRight") return `<button type="button" class="key key--wide key--next" data-key="${key}" aria-label="Case suivante">${ARROW}</button>`;
	return `<button type="button" class="key" data-key="${key}">${key}</button>`;
}

function cellsHTML() {
	let html = "";
	for (let i = 0; i < CODE_LENGTH; i++) {
		html += `<button type="button" class="cell" aria-label="Lettre ${i + 1}"></button>`;
	}
	return html;
}

const TEMPLATE = `
	<p class="logo">M.U.S.T</p>

	<section class="window window--main" aria-labelledby="enigme-title">
		<header class="titlebar">
			<h1 class="titlebar__title" id="enigme-title">Enigme bonus</h1>
			<span class="titlebar__btn titlebar__btn--min" aria-hidden="true"><span class="icon-min"></span></span>
			<span class="titlebar__btn titlebar__btn--max" aria-hidden="true"><img class="icon-max" src="assets/icon-maximize.svg" alt=""></span>
			<span class="titlebar__btn titlebar__btn--close" aria-hidden="true"><img class="icon-close" src="assets/icon-close.svg" alt=""></span>
		</header>

		<div class="photo">
			<img src="assets/background.png" alt="">
		</div>

		<form class="code" autocomplete="off">
			<h2 class="code__title">Code en lettres</h2>
			<div class="code__cells">${cellsHTML()}</div>
			<p class="code__hint">Un indice a été caché dans les pop-ups (de réussite)</p>
			<button type="submit" class="btn btn--validate">Valider</button>
		</form>
	</section>

	<section class="window window--keyboard" aria-label="Clavier">
		${ROWS.map((row, i) => `<div class="keyboard__row keyboard__row--${i + 1}">${row.map(keyHTML).join("")}</div>`).join("")}
	</section>
`;


function mountEnigmeBonus(container, { solution = "" } = {}) {
	container.innerHTML = TEMPLATE;

	const form = container.querySelector(".code");
	const cells = [...container.querySelectorAll(".cell")];
	const keyboard = container.querySelector(".window--keyboard");
	solution = solution.toLowerCase();

	let current = 0;

	function select(index) {
		current = Math.max(0, Math.min(cells.length - 1, index));
		cells.forEach((cell, i) => cell.classList.toggle("is-active", i === current));
	}

	function clearFeedback() {
		form.classList.remove("is-wrong", "is-correct");
	}

	function type(letter) {
		clearFeedback();
		cells[current].textContent = letter;
		select(current + 1);
	}

	function erase() {
		clearFeedback();
		if (cells[current].textContent === "") select(current - 1);
		cells[current].textContent = "";
	}

	function handleKey(key) {
		if (/^[a-z]$/.test(key)) type(key);
		else if (key === "ArrowLeft") select(current - 1);
		else if (key === "ArrowRight") select(current + 1);
		else if (key === "Backspace") erase();
		else if (key === "Enter") form.requestSubmit();
	}

	select(0);

	// Clavier à l’écran
	keyboard.addEventListener("click", (event) => {
		const button = event.target.closest(".key");
		if (button) handleKey(button.dataset.key);
	});

	// Clavier physique
	document.addEventListener("keydown", (event) => {
		if (event.metaKey || event.ctrlKey || event.altKey) return;
		const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
		const button = keyboard.querySelector(`[data-key="${key}"]`);
		if (button) {
			button.classList.add("is-pressed");
			setTimeout(() => button.classList.remove("is-pressed"), 120);
		}
		if (key === "Enter" || key === " ") event.preventDefault();
		handleKey(key);
	});

	// Choisir une case en la touchant
	cells.forEach((cell, i) => cell.addEventListener("click", () => select(i)));

	// Validation
	form.addEventListener("submit", (event) => {
		event.preventDefault();
		const code = cells.map((cell) => cell.textContent).join("");
		if (code.length < cells.length) return;

		const correct = code === solution;
		form.classList.add(correct ? "is-correct" : "is-wrong");
		document.dispatchEvent(new CustomEvent("enigme:validate", { detail: { code, correct } }));
	});
}
