import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import GS3dMap from "./GS3dMap.ts";
import createSky from "../environment/Sky.ts";
import createCheckerboard from "../environment/CheckerBoard.ts";
import FirstPersonController from "../player/FirstPersonController.js";

export default class GS3dViewer {
	private map: GS3dMap;
	private scene!: THREE.Scene;
	private camera!: THREE.PerspectiveCamera;
	private controls!: FirstPersonController;
	private renderer!: THREE.WebGLRenderer;
	private stats?: Stats;
	private viewerContainer: HTMLElement | null;

	constructor(map: GS3dMap, debug: boolean) {
		this.map = map;
		this.viewerContainer = document.getElementById("viewer");
		this.initializeRenderer();
		this.initializeScene(debug);
		this.initializeCamera();
		this.initializeControls(debug);
		this.handleResize();
		this.startRenderLoop(debug);
		this.map.addToScene(this.scene);
	}

	private initializeRenderer() {
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.viewerContainer?.appendChild(this.renderer.domElement);
	}

	private initializeScene(debug: boolean) {
		this.scene = new THREE.Scene();

		if (debug) {
			this.scene.add(new THREE.AxesHelper(500));
			this.scene.add(createCheckerboard());

			this.stats = new Stats();
			this.stats.showPanel(0);
			this.viewerContainer?.appendChild(this.stats.dom);
		}

		this.scene.add(createSky(this.renderer));
	}

	private initializeCamera() {
		const aspectRatio = window.innerWidth / window.innerHeight;
		this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
	}

	private initializeControls(debug: boolean) {
		this.controls = new FirstPersonController(
			this.camera,
			this.renderer.domElement,
			debug
		);
		this.controls.setTranslation(0, 3.5, 10);
	}

	private handleResize() {
		const resizeHandler = () => {
			if (!this.viewerContainer) return;

			const newWidth = this.viewerContainer.clientWidth;
			const newHeight = this.viewerContainer.clientHeight;
			this.renderer.setSize(newWidth, newHeight);
			this.camera.aspect = newWidth / newHeight;
			this.camera.updateProjectionMatrix();
		};

		window.addEventListener("resize", this.throttle(resizeHandler, 200));
	}

	// Utility function to throttle event handlers
	private throttle(func: Function, limit: number) {
		let inThrottle: boolean;
		return function (this: any, ...args: any[]) {
			if (!inThrottle) {
				func.apply(this, args);
				inThrottle = true;
				setTimeout(() => (inThrottle = false), limit);
			}
		};
	}

	private startRenderLoop(debug: boolean) {
		this.renderer.setAnimationLoop(() => {
			if (debug && this.stats) this.stats.begin();

			this.controls.update();
			this.renderer.render(this.scene, this.camera);

			if (debug && this.stats) this.stats.end();
		});
	}
}
