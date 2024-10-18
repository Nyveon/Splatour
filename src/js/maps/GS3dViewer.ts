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
	private viewerContainer!: HTMLElement;

	constructor(map: GS3dMap, debug: boolean) {
		this.map = map;
		this.viewerContainer = document.getElementById("viewer")!;
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
		this.renderer.setSize(this.viewerContainer.clientWidth, this.viewerContainer.clientHeight);
		this.viewerContainer?.appendChild(this.renderer.domElement);
	}

	private initializeScene(debug: boolean) {
		this.scene = new THREE.Scene();

		if (debug) {
			this.scene.add(new THREE.AxesHelper(500));
			this.scene.add(createCheckerboard());

			this.stats = new Stats();
			this.stats.showPanel(0);
            // this.stats.dom.setAttribute("id", "stats");
            this.stats.dom.style.position = "absolute";
			this.viewerContainer?.appendChild(this.stats.dom);
		}

		this.scene.add(createSky(this.renderer));
	}

	private initializeCamera() {
		const aspectRatio = this.viewerContainer.clientWidth / this.viewerContainer.clientHeight;
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

    private resizeHandler() {
        if (!this.viewerContainer) return;

        const newWidth = this.viewerContainer.clientWidth;
        const newHeight = this.viewerContainer.clientHeight;
        this.renderer.setSize(newWidth, newHeight);
        this.camera.aspect = newWidth / newHeight;
        this.camera.updateProjectionMatrix();
        console.log("resize");
        console.log(newWidth);
    }


	private handleResize() {
		window.addEventListener("resize", this.resizeHandler.bind(this));
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
