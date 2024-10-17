import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import GS3dMap from "./GS3dMap.ts";
import createSky from "../environment/Sky.ts";
import createCheckerboard from "../environment/CheckerBoard.ts";
import FirstPersonController from "../player/FirstPersonController.js";

export default class GS3dViewer {
	private map: GS3dMap;
	private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private controls: FirstPersonController;
	private renderer: THREE.WebGLRenderer;

	constructor(map: GS3dMap, debug: boolean) {
		this.map = map;

        let stats;
		if (debug) {
			stats = new Stats();
			stats.showPanel(0);
			document.body.appendChild(stats.dom);
		}

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);

		this.scene = new THREE.Scene();
		this.scene.add(new THREE.AxesHelper(500));
		if (debug) this.scene.add(createSky(this.renderer));
		this.scene.add(createCheckerboard());

        const aspectRatio = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

        window.addEventListener("resize", () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        });

        this.controls = new FirstPersonController(this.camera, this.renderer.domElement);
        this.controls.setTranslation(0, 3.5, 10);

        this.renderer.setAnimationLoop(() => {
            if (debug) stats.begin();
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
            if (debug) stats.end();
        });

        this.map.addToScene(this.scene);
	}
}
