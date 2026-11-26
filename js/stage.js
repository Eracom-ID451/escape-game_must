// Mise à l’échelle de la scène 1920 × 1080 dans la fenêtre

const stage = document.querySelector(".stage");

function fitStage() {
	const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
	stage.style.setProperty("--scale", scale);
}

window.addEventListener("resize", fitStage);
fitStage();
