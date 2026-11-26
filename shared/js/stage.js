// Mise à l’échelle de la scène dans la fenêtre.
// La scène garde les dimensions de la maquette (--stage-w × --stage-h, 1920 × 1080 par défaut).

const stage = document.querySelector(".stage");

function fitStage() {
	const scale = Math.min(window.innerWidth / stage.offsetWidth, window.innerHeight / stage.offsetHeight);
	stage.style.setProperty("--scale", scale);
}

window.addEventListener("resize", fitStage);
fitStage();
