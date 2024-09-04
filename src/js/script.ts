import * as THREE from "three";
import FirstPersonController from "./player/FirstPersonController.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import GS3dScene from "./maps/GS3dScene.ts";
import createSky from "./environment/Sky.ts";
import createCheckerboard from "./environment/CheckerBoard.ts";

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

//todo: make this update with resizing window
const renderer = new THREE.WebGLRenderer(); 
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(500));
scene.add(createSky(renderer));
scene.add(createCheckerboard());

//todo: update aspect ratio with resinzing window
const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

const controls = new FirstPersonController(camera, renderer.domElement);
controls.setTranslation(0, 3.5, 10);

renderer.setAnimationLoop(() => {
	stats.begin();
	controls.update();
	renderer.render(scene, camera);
	stats.end();
});

const gs = new GS3dScene("LivingRoom.ply");
gs.setScale(10, 10, 10);
gs.setPosition(0, 3, 0);
gs.setRotationDegrees(168, 0, 352);
gs.addToScene(scene);

document.addEventListener("DOMContentLoaded", function () {
	const modal = document.getElementById("rotationModal")!;
	const openModalBtn = document.getElementById("openModalBtn")!;
	const closeModalBtn = document.getElementById("closeModalBtn")!;
	const exportBtn = document.getElementById("exportBtn")!;

	const xRotationSlider = document.getElementById(
		"xRotation"
	) as HTMLInputElement;
	const yRotationSlider = document.getElementById(
		"yRotation"
	) as HTMLInputElement;
	const zRotationSlider = document.getElementById(
		"zRotation"
	) as HTMLInputElement;

	const xTranslationSlider = document.getElementById(
		"xTranslation"
	) as HTMLInputElement;
	const yTranslationSlider = document.getElementById(
		"yTranslation"
	) as HTMLInputElement;
	const zTranslationSlider = document.getElementById(
		"zTranslation"
	) as HTMLInputElement;

	const transformValuesDisplay = document.getElementById("transformValues")!;

	openModalBtn.addEventListener("click", () => {
		modal.style.display = "block";
		updateTransformDisplay();
	});

	closeModalBtn.addEventListener("click", () => {
		modal.style.display = "none";
	});

	function updateViewerTransform() {
		gs.setRotationDegrees(
			parseInt(xRotationSlider.value),
			parseInt(yRotationSlider.value),
			parseInt(zRotationSlider.value)
		);

		gs.setPosition(
			parseFloat(xTranslationSlider.value),
			parseFloat(yTranslationSlider.value),
			parseFloat(zTranslationSlider.value)
		);

		updateTransformDisplay();
	}

	function updateTransformDisplay() {
		const rotation = gs.getRotationDegrees();
		const translation = gs.getPosition();
		transformValuesDisplay.textContent =
			`Rotation (degrees):\nX: ${rotation.x}, Y: ${rotation.y}, Z: ${rotation.z}\n\n` +
			`Translation:\nX: ${translation.x}, Y: ${translation.y}, Z: ${translation.z}`;
	}

	function exportTransform() {
		const transformData = {
			rotation: gs.getRotationDegrees(),
			translation: gs.getPosition(),
		};
		const jsonString = JSON.stringify(transformData, null, 2);
		const blob = new Blob([jsonString], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "transform.json";
		a.click();
		URL.revokeObjectURL(url);
	}

	xRotationSlider.addEventListener("input", updateViewerTransform);
	yRotationSlider.addEventListener("input", updateViewerTransform);
	zRotationSlider.addEventListener("input", updateViewerTransform);
	xTranslationSlider.addEventListener("input", updateViewerTransform);
	yTranslationSlider.addEventListener("input", updateViewerTransform);
	zTranslationSlider.addEventListener("input", updateViewerTransform);

	exportBtn.addEventListener("click", exportTransform);
});
