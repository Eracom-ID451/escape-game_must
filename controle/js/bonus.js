// Écran « Énigme bonus » (reprise de la v0).
//
// Usage :
//	<script src="js/bonus.js"></script>
//	<script>mountEnigmeBonus(document.querySelector(".stage"), { solution: "marley" })</script>
//
// Le contenu du conteneur est remplacé par l’écran.
// Bon code : l’écran « Chien réussite ». Mauvais code : les cases passent au rouge puis se vident.
// L’événement « enigme:validate » est émis sur document avec { code, correct }.

const ROWS = [
	["q", "w", "e", "r", "t", "z", "u", "i", "o", "p"],
	["a", "s", "d", "f", "g", "h", "j", "k", "l"],
	["Backspace", "y", "x", "c", "v", "b", "n", "m", "Enter"],
];

const CODE_LENGTH = 6;

const ARROW = `<svg class="arrow arrow--left" viewBox="0 0 16 16" aria-hidden="true"><rect x="5.5" y="4" width="1" height="8"/><rect x="6.5" y="5" width="1" height="6"/><rect x="7.5" y="6.5" width="1" height="3"/><rect x="8.5" y="7.5" width="1" height="1"/></svg>`;

function keyHTML(key) {
	if (key === "Backspace") return `<button type="button" class="key key--wide" data-key="${key}" aria-label="Effacer">${ARROW}</button>`;
	if (key === "Enter") return `<button type="button" class="key key--wide" data-key="${key}">enter</button>`;
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

	<section class="window bonus relief-window" aria-labelledby="enigme-title">
		<header class="titlebar">
			<h1 class="titlebar__title" id="enigme-title">Enigme bonus</h1>
			<span class="titlebar__btn titlebar__btn--min relief-button" aria-hidden="true"></span>
			<span class="titlebar__btn titlebar__btn--max relief-button" aria-hidden="true"><img src="assets/icon-maximize.svg" alt=""></span>
			<a class="titlebar__btn titlebar__btn--close relief-button" href="menu.html" aria-label="Fermer"><img src="assets/icon-close.svg" alt=""></a>
		</header>

		<div class="bonus__photo">
			<img src="assets/bg-chien.png" alt="">
		</div>

		<form class="code" autocomplete="off">
			<h2 class="code__title">Code en lettres</h2>
			<div class="code__cells">${cellsHTML()}</div>
			<p class="code__hint">Un indice a été caché dans les pop-ups (de réussite)</p>
			<button type="submit" class="btn btn--validate">Valider</button>
		</form>
	</section>

	<section class="window keyboard relief-window" aria-label="Clavier">
		${ROWS.map((row, i) => `<div class="keyboard__row keyboard__row--${i + 1}">${row.map(keyHTML).join("")}</div>`).join("")}
	</section>
`;


function mountEnigmeBonus(container, { solution = "" } = {}) {
	container.innerHTML = TEMPLATE;

	const form = container.querySelector(".code");
	const cells = [...container.querySelectorAll(".cell")];
	const keyboard = container.querySelector(".keyboard");
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

		if (correct) {
			setTimeout(() => location.href = "chien-reussite.html", 600);
		} else {
			setTimeout(() => {
				cells.forEach((cell) => cell.textContent = "");
				clearFeedback();
				select(0);
			}, 900);
		}
	});
}
