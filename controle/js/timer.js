// Compte à rebours de la partie (20 minutes), commun aux pages du contrôle.
//
// - index.html : le bouton « Appareils » lance le compte à rebours (timerStart).
// - menu.html : affichage à sept segments en bas à gauche (mountTimer).
// - Pages du jeu : timerWatch() envoie sur gameover.html quand le temps est écoulé.
// - final.html : timerStop() fige le temps restant (la partie est gagnée).
// - index.html?reset ou menu.html?reset : timerReset() remet tout à zéro.
//
// Le temps est gardé dans localStorage : must:start (heure de départ, en ms)
// et must:done (temps restant au moment de la victoire, en ms).

const TIMER_DURATION = 20 * 60 * 1000;

// Couleur selon le temps restant (à ajuster ici)
const TIMER_YELLOW = 10 * 60 * 1000; // vert jusqu’à 10:00, puis jaune
const TIMER_RED = 2 * 60 * 1000; // jaune jusqu’à 2:00, puis rouge
const TIMER_BLINK = 1 * 60 * 1000; // rouge clignotant pendant la dernière minute

function timerRead(key) {
	try {
		const value = localStorage.getItem(key);
		return value === null ? null : Number(value);
	} catch (error) {
		return null;
	}
}

function timerWrite(key, value) {
	try {
		if (value === null) localStorage.removeItem(key);
		else localStorage.setItem(key, String(value));
	} catch (error) {}
}

// Lance le compte à rebours, sauf s’il tourne déjà
function timerStart() {
	if (timerRead("must:start") === null) timerWrite("must:start", Date.now());
}

function timerReset() {
	timerWrite("must:start", null);
	timerWrite("must:done", null);
}

// Partie gagnée : le temps restant est figé
function timerStop() {
	if (timerRead("must:start") !== null && timerRead("must:done") === null) {
		timerWrite("must:done", Math.max(0, timerRemaining()));
	}
}

// Temps restant en ms (20:00 tant que la partie n’a pas commencé)
function timerRemaining() {
	const done = timerRead("must:done");
	if (done !== null) return done;
	const start = timerRead("must:start");
	if (start === null) return TIMER_DURATION;
	return TIMER_DURATION - (Date.now() - start);
}

function timerExpired() {
	return timerRead("must:start") !== null && timerRead("must:done") === null && timerRemaining() <= 0;
}

// Temps écoulé : écran GAME OVER
function timerWatch() {
	function check() {
		if (timerExpired()) location.href = "gameover.html";
	}
	check();
	setInterval(check, 1000);
}

// ---------- Affichage à sept segments ----------

const TIMER_SVG = "http://www.w3.org/2000/svg";

// Segments allumés pour chaque chiffre (a en haut, puis dans le sens horaire, g au milieu)
const TIMER_SEGMENTS = {
	"0": "abcdef", "1": "bc", "2": "abdeg", "3": "abcdg", "4": "bcfg",
	"5": "acdfg", "6": "acdefg", "7": "abc", "8": "abcdefg", "9": "abcdfg",
};

// Polygones des segments pour un chiffre de largeur w et de hauteur h (comme le réveil)
function timerSegmentShapes(w, h) {
	const t = w * 0.227;
	const d = Math.max(0.6, w * 0.022);
	const m = h / 2;
	const k = t / 2;

	const shapes = {
		a: [[d, 0], [w - d, 0], [w - t - d, t], [t + d, t]],
		f: [[0, d], [t, t + d], [t, m - k - 2 * d], [k, m - 2 * d], [0, m - k - 2 * d]],
		g: [[k + 2 * d, m], [t + 2 * d, m - k], [w - t - 2 * d, m - k], [w - k - 2 * d, m], [w - t - 2 * d, m + k], [t + 2 * d, m + k]],
	};
	shapes.b = shapes.f.map(([x, y]) => [w - x, y]);
	shapes.e = shapes.f.map(([x, y]) => [x, h - y]);
	shapes.c = shapes.b.map(([x, y]) => [x, h - y]);
	shapes.d = shapes.a.map(([x, y]) => [x, h - y]);
	return shapes;
}

function timerDigit(w, h) {
	const svg = document.createElementNS(TIMER_SVG, "svg");
	svg.setAttribute("class", "timer__digit");
	svg.setAttribute("width", w);
	svg.setAttribute("height", h);
	svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
	for (const [segment, points] of Object.entries(timerSegmentShapes(w, h))) {
		const polygon = document.createElementNS(TIMER_SVG, "polygon");
		polygon.setAttribute("points", points.map((p) => p.map((n) => n.toFixed(2)).join(",")).join(" "));
		polygon.dataset.segment = segment;
		svg.append(polygon);
	}
	return svg;
}

function timerSetDigit(svg, value) {
	const lit = TIMER_SEGMENTS[value] ?? "";
	for (const polygon of svg.querySelectorAll("polygon")) {
		polygon.classList.toggle("on", lit.includes(polygon.dataset.segment));
	}
}

// Construit l’affichage MM:SS dans container et le met à jour
function mountTimer(container) {
	const w = 56;
	const h = 100;
	const digits = [timerDigit(w, h), timerDigit(w, h), timerDigit(w, h), timerDigit(w, h)];
	const colon = document.createElement("span");
	colon.className = "timer__colon";
	colon.innerHTML = "<span></span><span></span>";
	container.append(digits[0], digits[1], colon, digits[2], digits[3]);

	function update() {
		const remaining = Math.max(0, timerRemaining());
		const seconds = Math.ceil(remaining / 1000);
		const text = String(Math.floor(seconds / 60)).padStart(2, "0") + String(seconds % 60).padStart(2, "0");
		digits.forEach((svg, i) => timerSetDigit(svg, text[i]));

		let color = "green";
		if (remaining <= TIMER_RED) color = "red";
		else if (remaining <= TIMER_YELLOW) color = "yellow";
		container.dataset.color = color;

		const running = timerRead("must:start") !== null && timerRead("must:done") === null;
		container.classList.toggle("is-blinking", running && remaining <= TIMER_BLINK);
	}
	update();
	setInterval(update, 250);
}
