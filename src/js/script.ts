import * as THREE from "three";
import FirstPersonController from "./player/FirstPersonController.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import GS3dScene from "./maps/GS3dScene.ts";
import createSky from "./environment/Sky.ts";
import createCheckerboard from "./environment/CheckerBoard.ts";
import GS3dMap from "./maps/GS3dMap.ts";

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(500));
scene.add(createSky(renderer));
scene.add(createCheckerboard());

const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

window.addEventListener("resize", () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
});

const controls = new FirstPersonController(camera, renderer.domElement);
controls.setTranslation(0, 3.5, 10);

renderer.setAnimationLoop(() => {
	stats.begin();
	controls.update();
	renderer.render(scene, camera);
	stats.end();
});

function handleModalSubmit() {
	const modal = document.getElementById("myModal")!;
	const fileInput: HTMLInputElement = document.getElementById(
		"fileInput"
	) as HTMLInputElement;

	if (!fileInput || !fileInput.files) {
		alert("File input not found.");
		return;
	}

	const file = fileInput.files[0];

	if (!file) {
		alert("Please select a JSON file");
		return;
	}

	const reader = new FileReader();

	reader.onload = function (e) {
		try {
			if (!e.target || !e.target.result) {
				throw new Error("Invalid file data.");
			}

			console.log("JSON data uploaded:", e.target.result);
			const gsmap = GS3dMap.deserialize(e.target.result.toString());
			gsmap.addToScene(scene);
		} catch (error) {
			alert("Invalid JSON file." + error);
		}
	};

	reader.readAsText(file);

	modal.classList.add("hidden");
}

document
	.getElementById("modalButton")!
	.addEventListener("click", handleModalSubmit);
