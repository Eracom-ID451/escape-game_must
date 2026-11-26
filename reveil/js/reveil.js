// Réveil – radio-réveil en trois étapes.
//
// 1. J/M : régler la date (12/08) en touchant les chiffres de l’horloge.
// 2. Température : l’affichage défile de 10° à 19° ; des segments verts
//    dessinent un 4 → on tape 4 au clavier, il fait 14°.
// 3. Radio : chaque station a un segment vert, ensemble ils dessinent un 4
//    → on tape 4 au clavier, la fréquence devient 104.6.
// L’heure du réveil se compose au fil des étapes : 02:01 → 12:08 → 14:08 → 14:48.

const DATE = "1208";
const ANSWERS = { temperature: ["4", "14"], radio: ["4"] };

// Heure, date, température et fréquence affichées à chaque étape (0 à 3)
const CLOCK = ["0201", "1208", "1408", "1448"];
const INITIAL = CLOCK[0];

const TEMPERATURE_DELAY = 1000; // ms : durée d’affichage d’une température
const BLANK_DELAY = 400; // ms : écran éteint entre deux températures
const SUCCESS_DELAY = 700; // ms : avant de revenir au réveil

// Segments allumés pour chaque caractère (a en haut, puis dans le sens horaire, g au milieu)
const SEGMENTS = {
	"0": "abcdef", "1": "bc", "2": "abdeg", "3": "abcdg", "4": "bcfg",
	"5": "acdfg", "6": "acdefg", "7": "abc", "8": "abcdefg", "9": "abcdfg",
	"c": "afg", "": "",
};

// Températures qui défilent ; certaines ont un segment vert sur le second chiffre
const TEMPERATURES = ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19"];
const TEMPERATURE_HINTS = { "13": "b", "16": "g", "17": "c", "18": "f" };

// Stations de radio : fréquence et segment vert du troisième chiffre
const STATIONS = [
	{ name: "Radio FM", freq: "1006", green: "f" },
	{ name: "Radio SUN", freq: "1086", green: "g" },
	{ name: "Radio FAM", freq: "1096", green: "b" },
	{ name: "Radio RAW", freq: "1056", green: "c" },
];

let step = 0;
let previousScreen = "accueil";

// ---------- Chiffres à sept segments ----------

const SVG_NS = "http://www.w3.org/2000/svg";

// Polygones des segments pour un chiffre de largeur w et de hauteur h.
// t : épaisseur d’un segment ; d : demi-espace entre deux segments.
// Un chiffre « half » ne garde que la moitié haute (a, b, f) et le milieu g, posé en bas.
function segmentShapes(w, h, half) {
	const t = w * (half ? 0.18 : 0.227);
	const d = Math.max(0.6, w * 0.022);
	const H = half ? 2 * (h - t / 2) : h;
	const m = H / 2;
	const k = t / 2;

	const shapes = {
		a: [[d, 0], [w - d, 0], [w - t - d, t], [t + d, t]],
		f: [[0, d], [t, t + d], [t, m - k - 2 * d], [k, m - 2 * d], [0, m - k - 2 * d]],
		g: [[k + 2 * d, m], [t + 2 * d, m - k], [w - t - 2 * d, m - k], [w - k - 2 * d, m], [w - t - 2 * d, m + k], [t + 2 * d, m + k]],
	};
	// Symétries : b à droite de f, e et c sous f et b, d sous a
	shapes.b = shapes.f.map(([x, y]) => [w - x, y]);
	if (!half) {
		shapes.e = shapes.f.map(([x, y]) => [x, H - y]);
		shapes.c = shapes.b.map(([x, y]) => [x, H - y]);
		shapes.d = shapes.a.map(([x, y]) => [x, H - y]);
	}
	return shapes;
}

function buildDigit(svg) {
	const w = Number(svg.getAttribute("width"));
	const h = Number(svg.getAttribute("height"));
	const shapes = segmentShapes(w, h, svg.classList.contains("digit--half"));

	svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
	svg.setAttribute("aria-hidden", "true");
	svg.style.clipPath = `inset(0 round ${(w * 0.09).toFixed(1)}px)`;

	for (const [segment, points] of Object.entries(shapes)) {
		const polygon = document.createElementNS(SVG_NS, "polygon");
		polygon.setAttribute("points", points.map((p) => p.map((n) => n.toFixed(2)).join(",")).join(" "));
		polygon.dataset.segment = segment;
		svg.append(polygon);
	}
	setDigit(svg, svg.dataset.value ?? "");
}

// Affiche un caractère ; green : segments à colorer en vert (indices)
function setDigit(svg, value, green = "") {
	svg.dataset.value = value;
	const lit = SEGMENTS[value] ?? "";
	for (const polygon of svg.querySelectorAll("polygon")) {
		const segment = polygon.dataset.segment;
		const isGreen = green.includes(segment);
		polygon.classList.toggle("on", lit.includes(segment) && !isGreen);
		polygon.classList.toggle("off", !lit.includes(segment) && !isGreen);
		polygon.classList.toggle("green", isGreen);
	}
}

// Écrit une suite de caractères dans une liste de chiffres
function setDigits(svgs, text) {
	svgs.forEach((svg, i) => setDigit(svg, text[i] ?? ""));
}

document.querySelectorAll(".digit").forEach(buildDigit);

// ---------- Navigation entre les écrans ----------

const screens = document.querySelectorAll(".screen");

function showScreen(id) {
	const current = document.querySelector(".screen:not([hidden])");
	if (current && current.id !== "clavier") previousScreen = current.id;
	screens.forEach((screen) => (screen.hidden = screen.id !== id));

	stopTemperature();
	if (id === "temperature") startTemperature();
	if (id === "radio" && current?.id === "accueil") showStation(0);
	if (id === "code") codeLocked = false;
}

document.addEventListener("click", (event) => {
	const opener = event.target.closest("[data-open]");
	if (opener && !opener.disabled) showScreen(opener.dataset.open);
});

// ---------- Écran principal ----------

const accueil = document.getElementById("accueil");
const clockDigits = [...accueil.querySelectorAll(".clock .digit")];
const jmDigits = [...accueil.querySelectorAll(".jm .digit")];
const tempDigits = [...accueil.querySelectorAll(".temp .digit:not(.digit--half)")];
const freqDigits = [...accueil.querySelectorAll(".freq .digit")];

function render() {
	const time = CLOCK[step];
	setDigits(clockDigits, time);
	setDigits(jmDigits, step >= 1 ? DATE : INITIAL);
	setDigits(tempDigits, step >= 2 ? "14" : "15");
	setDigits(freqDigits, step >= 3 ? "1046" : "1006");

	// Un chiffre de l’heure passe au vert dès qu’il a changé
	clockDigits.forEach((svg, i) => svg.classList.toggle("is-green", step === 3 || time[i] !== INITIAL[i]));
	accueil.querySelectorAll(".clock .diamond").forEach((el) => el.classList.toggle("is-green", step === 3));
	accueil.querySelector(".jm").classList.toggle("is-green", step >= 1);
	accueil.querySelector(".temp").classList.toggle("is-green", step >= 2);
	accueil.querySelector(".label--temp").classList.toggle("is-green", step >= 2);
	accueil.querySelector(".freq").classList.toggle("is-green", step === 3);
	accueil.querySelector(".label--radio").classList.toggle("is-green", step === 3);
	accueil.querySelectorAll(".separator").forEach((el) => el.classList.toggle("is-green", step === 3));

	// Un seul bouton ENTER actif à la fois ; Reset à la fin
	const enters = ["enter-jm", "enter-temp", "enter-radio"];
	enters.forEach((id, i) => {
		const button = document.getElementById(id);
		button.disabled = i !== step;
		button.hidden = step === 3;
	});
	document.getElementById("reset").hidden = step !== 3;
}

function succeed(nextStep) {
	setTimeout(() => {
		step = nextStep;
		render();
		showScreen("accueil");
	}, SUCCESS_DELAY);
}

document.getElementById("reset").addEventListener("click", () => {
	step = 0;
	codeValue = INITIAL.split("");
	codeButtons.forEach((button, i) => setDigit(button.firstElementChild, codeValue[i]));
	render();
});

// ---------- Étape 1 : la date ----------

const codeButtons = [...document.querySelectorAll("#code .digit-btn")];
let codeValue = INITIAL.split("");
let codeLocked = false;

codeButtons.forEach((button, i) => {
	setDigit(button.firstElementChild, codeValue[i]);
	button.addEventListener("click", () => {
		if (codeLocked) return;
		codeValue[i] = String((Number(codeValue[i]) + 1) % 10);
		setDigit(button.firstElementChild, codeValue[i]);
		if (codeValue.join("") === DATE) {
			codeLocked = true;
			succeed(1);
		}
	});
});

// ---------- Étape 2 : la température défile ----------

const thermoDigits = [...document.querySelectorAll(".thermo .digit:not(.digit--half)")];
const thermo = document.querySelector(".thermo");
let temperatureTimer = null;

function startTemperature() {
	let index = 0;
	let blank = false;

	function tick() {
		// Entre deux températures, l’afficheur est éteint (« 88° » grisé)
		thermo.classList.toggle("is-off", blank);
		if (blank) {
			setDigits(thermoDigits, "");
			index = (index + 1) % TEMPERATURES.length;
		} else {
			const value = TEMPERATURES[index];
			setDigit(thermoDigits[0], value[0]);
			setDigit(thermoDigits[1], value[1], TEMPERATURE_HINTS[value] ?? "");
		}
		temperatureTimer = setTimeout(tick, blank ? BLANK_DELAY : TEMPERATURE_DELAY);
		blank = !blank;
	}
	tick();
}

function stopTemperature() {
	clearTimeout(temperatureTimer);
}

// ---------- Étape 3 : la radio ----------

const station = document.querySelector(".station");
const stationDigits = [...station.querySelectorAll(".digit")];
let stationIndex = 0;

function showStation(index) {
	stationIndex = index;
	const { name, freq, green } = STATIONS[index];
	station.querySelector(".station__name").textContent = name;
	stationDigits.forEach((svg, i) => setDigit(svg, freq[i], i === 2 ? green : ""));
	document.getElementById("radio-prev").hidden = index === 0;
	document.getElementById("radio-next").hidden = index === STATIONS.length - 1;
}

document.getElementById("radio-prev").addEventListener("click", () => showStation(stationIndex - 1));
document.getElementById("radio-next").addEventListener("click", () => showStation(stationIndex + 1));

// ---------- Clavier ----------

const keypadScreen = document.getElementById("keypad-screen");
const MAX_LENGTH = 2;
let keypadFor = "temperature";
let typed = "";

function showTyped() {
	keypadScreen.classList.remove("is-wrong");
	keypadScreen.textContent = typed || "_";
}

document.querySelectorAll("[data-keypad]").forEach((button) => {
	button.addEventListener("click", () => {
		keypadFor = button.dataset.keypad;
		typed = "";
		showTyped();
		showScreen("clavier");
	});
});

document.getElementById("clavier-close").addEventListener("click", () => showScreen(previousScreen));

document.querySelectorAll(".key").forEach((key) => {
	key.addEventListener("click", () => {
		if (key.dataset.key === "effacer") typed = "";
		else if (typed.length < MAX_LENGTH) typed += key.textContent;
		showTyped();
	});
});

document.getElementById("keypad-ok").addEventListener("click", () => {
	if (!typed) return;
	if (ANSWERS[keypadFor].includes(typed)) {
		keypadScreen.classList.add("is-green");
		succeed(keypadFor === "temperature" ? 2 : 3);
		setTimeout(() => keypadScreen.classList.remove("is-green"), SUCCESS_DELAY);
	} else {
		// Mauvaise réponse : l’écran clignote en rouge, puis s’efface
		keypadScreen.classList.add("is-wrong");
		typed = "";
		setTimeout(showTyped, 800);
	}
});

render();
