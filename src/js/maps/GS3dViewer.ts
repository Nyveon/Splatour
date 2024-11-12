import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import GS3dScene from "./GS3dScene.ts";
import GS3dMap from "./GS3dMap.ts";
import createSky from "../environment/Sky.ts";
import createCheckerboard from "../environment/CheckerBoard.ts";
import FirstPersonController from "../player/FirstPersonController.js";

export default class GS3dViewer {
	private gsmap: GS3dMap;
	private scene!: THREE.Scene;
	private camera!: THREE.PerspectiveCamera;
	private controls!: FirstPersonController;
	private renderer!: THREE.WebGLRenderer;
	private stats?: Stats;
	private viewerContainer!: HTMLElement;
	private isPaused: boolean = false;

	private mode: "firstPerson" | "birdsEye" = "firstPerson";
	private raycaster: THREE.Raycaster = new THREE.Raycaster();
	private mouse: THREE.Vector2 = new THREE.Vector2();
	private isDrawing: boolean = false;
	private drawingStartPoint: THREE.Vector3 | null = null;
	private wallsArray: THREE.Line[] = [];
	private tempWall: THREE.Mesh | null = null;
    private highlightedWall: THREE.Mesh | null = null;

	constructor(gsmap: GS3dMap, debug: boolean) {
		this.gsmap = gsmap;
		gsmap.parent = this;
		this.viewerContainer = document.getElementById("viewer")!;
		this.initializeRenderer();
		this.initializeScene(debug);
		this.initializeCamera();
		this.initializeControls(debug);
		this.handleResize();
		this.startRenderLoop(debug);
		this.gsmap.addToScene(this.scene);

		if (debug) {
			this.initializeModeSwitching();
			this.initializeDrawing();
		}
	}

	private initializeModeSwitching() {
		document.addEventListener("keydown", (event) => {
			if (event.code === "Enter") {
				if (this.mode === "birdsEye") {
					this.enterFirstPersonView();
				}
			}
		});
	}

	private initializeDrawing() {
		this.renderer.domElement.addEventListener(
			"mousedown",
			this.onMouseDown.bind(this),
			false
		);
		this.renderer.domElement.addEventListener(
			"mouseup",
			this.onMouseUp.bind(this),
			false
		);
		this.renderer.domElement.addEventListener(
			"mousemove",
			this.onMouseMove.bind(this),
			false
		);
		this.renderer.domElement.addEventListener(
			"contextmenu",
			(event) => event.preventDefault(),
			false
		);
	}

	private onMouseDown(event: MouseEvent) {
		if (this.mode !== "birdsEye") return;

        if (event.button === 0) {
            this.isDrawing = true;
            this.updateMousePosition(event);
    
            this.raycaster.setFromCamera(this.mouse, this.camera);
    
            const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
            const intersectPoint = new THREE.Vector3();
            this.raycaster.ray.intersectPlane(plane, intersectPoint);
    
            this.drawingStartPoint = intersectPoint.clone();
        } else if (event.button === 2) {
            this.deleteWallAtMousePosition(event);
        }
	}

    private deleteWallAtMousePosition(event: MouseEvent) {
        this.updateMousePosition(event);
    
        this.raycaster.setFromCamera(this.mouse, this.camera);
    
        // Raycast against the walls
        const intersects = this.raycaster.intersectObjects(this.wallsArray);
    
        if (intersects.length > 0) {
            // The closest intersected object is the one under the cursor
            const intersectedObject = intersects[0].object as THREE.Mesh;
    
            // Remove the wall from the scene
            this.scene.remove(intersectedObject);
    
            // Remove the wall from the wallsArray
            const index = this.wallsArray.indexOf(intersectedObject);
            if (index > -1) {
                this.wallsArray.splice(index, 1);
            }
    
            // Optional: Dispose of the geometry and material
            intersectedObject.geometry.dispose();
            if (Array.isArray(intersectedObject.material)) {
                intersectedObject.material.forEach(material => material.dispose());
            } else {
                intersectedObject.material.dispose();
            }
    
            // Reset cursor and highlighted wall
            this.renderer.domElement.style.cursor = 'auto';
            this.highlightedWall = null;
        }
    }

	private onMouseUp(event: MouseEvent) {
		if (this.mode !== "birdsEye" || !this.isDrawing) return;

		this.isDrawing = false;
		this.updateMousePosition(event);

		this.raycaster.setFromCamera(this.mouse, this.camera);

		const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
		const intersectPoint = new THREE.Vector3();
		this.raycaster.ray.intersectPlane(plane, intersectPoint);

		this.createWall(this.drawingStartPoint!, intersectPoint);
	}

    private onMouseMove(event: MouseEvent) {
        if (this.mode !== 'birdsEye') return;
    
        this.updateMousePosition(event);
        this.raycaster.setFromCamera(this.mouse, this.camera);
    
        if (this.isDrawing) {
            // Handle temporary wall preview during drawing
            const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
            const intersectPoint = new THREE.Vector3();
            this.raycaster.ray.intersectPlane(plane, intersectPoint);
    
            // Remove the previous temporary wall
            if (this.tempWall) {
                this.scene.remove(this.tempWall);
                this.tempWall.geometry.dispose();
                if (Array.isArray(this.tempWall.material)) {
                    this.tempWall.material.forEach(material => material.dispose());
                } else {
                    this.tempWall.material.dispose();
                }
                this.tempWall = null;
            }
    
            // Create a new temporary wall from drawingStartPoint to current intersectPoint
            if (this.drawingStartPoint) {
                this.tempWall = this.createTemporaryWall(this.drawingStartPoint, intersectPoint);
            }
    
            // Optional: Change cursor to indicate drawing mode
            this.renderer.domElement.style.cursor = 'crosshair';
        } else {
            // Handle wall highlighting when not drawing
            const intersects = this.raycaster.intersectObjects(this.wallsArray);
    
            if (intersects.length > 0) {
                const intersectedObject = intersects[0].object as THREE.Mesh;
    
                if (this.highlightedWall !== intersectedObject) {
                    // Remove highlight from previous wall
                    if (this.highlightedWall) {
                        (this.highlightedWall.material as THREE.MeshStandardMaterial).emissive.setHex(0x000000);
                    }
    
                    // Highlight new wall
                    this.highlightedWall = intersectedObject;
                    (this.highlightedWall.material as THREE.MeshStandardMaterial).emissive.setHex(0xff0000);
    
                    // Change cursor to pointer
                    this.renderer.domElement.style.cursor = 'pointer';
                }
            } else {
                // Remove highlight from previous wall
                if (this.highlightedWall) {
                    (this.highlightedWall.material as THREE.MeshStandardMaterial).emissive.setHex(0x000000);
                    this.highlightedWall = null;
                }
    
                // Reset cursor
                this.renderer.domElement.style.cursor = 'auto';
            }
        }
    }

	private createTemporaryWall(
		startPoint: THREE.Vector3,
		endPoint: THREE.Vector3
	): THREE.Mesh {
		const wallThickness = 0.1;
		const wallHeight = 2.5;

		const direction = new THREE.Vector3().subVectors(endPoint, startPoint);
		const length = direction.length();

		const midpoint = new THREE.Vector3()
			.addVectors(startPoint, endPoint)
			.multiplyScalar(0.5);

		const geometry = new THREE.BoxGeometry(length, wallHeight, wallThickness);
		const material = new THREE.MeshStandardMaterial({
			color: 0x808080,
			opacity: 0.5,
			transparent: true,
		});
		const wall = new THREE.Mesh(geometry, material);

		wall.position.set(midpoint.x, wallHeight / 2, midpoint.z);
		const angle = Math.atan2(direction.z, direction.x);
		wall.rotation.y = -angle;

		this.scene.add(wall);
		return wall;
	}

    private createWall(startPoint: THREE.Vector3, endPoint: THREE.Vector3) {
        const wallThickness = 0.1;
        const wallHeight = 4;
    
        const direction = new THREE.Vector3().subVectors(endPoint, startPoint);
        const length = direction.length();
    
        const midpoint = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);
    
        const geometry = new THREE.BoxGeometry(length, wallHeight, wallThickness);
        const material = new THREE.MeshStandardMaterial({
            color: 0x808080,
            emissive: 0x000000, // Set emissive color for highlighting
        });
        const wall = new THREE.Mesh(geometry, material);
    
        wall.position.set(midpoint.x, wallHeight / 2, midpoint.z);
        const angle = Math.atan2(direction.z, direction.x);
        wall.rotation.y = -angle;
    
        wall.castShadow = true;
        wall.receiveShadow = true;
    
        this.scene.add(wall);
        this.wallsArray.push(wall);
    }

	private updateMousePosition(event: MouseEvent) {
		const rect = this.renderer.domElement.getBoundingClientRect();
		this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
	}

	private enterBirdsEyeView(gsScene: GS3dScene) {
		this.mode = "birdsEye";
		const scenePosition = gsScene.getPosition();
		const sceneScale = gsScene.getScale();
		const xzPlaneScale = Math.max(sceneScale.x, sceneScale.z);
		this.controls.enableBirdsEye();
		this.controls.setTranslation(
			scenePosition.x,
			15 * xzPlaneScale,
			scenePosition.z
		);
		this.controls.setRotation(0, -Math.PI / 2);
		this.controls.update();
	}

	private enterFirstPersonView() {
		this.mode = "firstPerson";
		this.controls.disableBirdsEye();
	}

	private initializeRenderer() {
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(
			this.viewerContainer.clientWidth,
			this.viewerContainer.clientHeight
		);
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

			const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
			this.scene.add(ambientLight);

			const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
			directionalLight.position.set(10, 20, 10);
			directionalLight.castShadow = true;
			this.scene.add(directionalLight);
		}

		this.scene.add(createSky(this.renderer));
	}

	private initializeCamera() {
		const aspectRatio =
			this.viewerContainer.clientWidth / this.viewerContainer.clientHeight;
		this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
	}

	private initializeControls(debug: boolean) {
		this.controls = new FirstPersonController(
			this.camera,
			this.renderer.domElement,
            this.wallsArray,
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
	}

	private handleResize() {
		window.addEventListener("resize", this.resizeHandler.bind(this));
	}

	private startRenderLoop(debug: boolean) {
		this.renderer.setAnimationLoop(() => {
			if (this.isPaused) return;

			if (debug && this.stats) this.stats.begin();

			this.controls.update();
			this.renderer.render(this.scene, this.camera);

			if (debug && this.stats) this.stats.end();
		});
	}

	public pauseRenderLoop() {
		this.isPaused = true;
	}

	public resumeRenderLoop() {
		this.isPaused = false;
	}
}
