import * as THREE from "three";

import { clamp } from "./_util.js";
import { KEYS } from "./_constants.js";

interface MouseState {
	leftButton: boolean;
	rightButton: boolean;
	mouseX: number;
	mouseY: number;
	mouseXDelta: number;
	mouseYDelta: number;
}

type KeysState = { [key: string]: boolean };

//todo: should be a separate class
class InputController {
	canvas: HTMLCanvasElement;
	private current: MouseState; //todo: not any
	private previous: MouseState | null; //todo: not any
	private keys: KeysState; //todo: not any
	private previousKeys: KeysState; //todo: not any

	constructor(canvas) {
		this.canvas = canvas;
		this.initialize();
	}

	private initialize() {
		this.current = {
			leftButton: false,
			rightButton: false,
			mouseX: 0,
			mouseY: 0,
			mouseXDelta: 0,
			mouseYDelta: 0,
		};

		this.previous = null;
		this.keys = {};
		this.previousKeys = {};

		document.addEventListener("mousedown", (e) => this.onMouseDown_(e), false);
		document.addEventListener("mouseup", (e) => this.onMouseUp_(e), false);
		document.addEventListener("mousemove", (e) => this.onMouseMove_(e), false);
		document.addEventListener("keydown", (e) => this.onKeyDown_(e), false);
		document.addEventListener("keyup", (e) => this.onKeyUp_(e), false);
		this.canvas.addEventListener("click", () =>
			this.canvas.requestPointerLock()
		);
		document.addEventListener(
			"pointerlockchange",
			() => this.onPointerLockChange_(),
			false
		);
		document.addEventListener(
			"pointerlockerror",
			() => this.onPointerLockError_(),
			false
		);
	}

	private onMouseDown_(e: MouseEvent): void {
		if (e.button === 0) {
			this.current.leftButton = true;
		} else if (e.button === 2) {
			this.current.rightButton = true;
		}
	}

	private onMouseUp_(e: MouseEvent): void {
		if (e.button === 0) {
			this.current.leftButton = false;
		} else if (e.button === 2) {
			this.current.rightButton = false;
		}
	}

	private onMouseMove_(e: MouseEvent): void {
		if (document.pointerLockElement === this.canvas) {
			this.current.mouseX += e.movementX;
			this.current.mouseY += e.movementY;

			if (this.previous === null) {
				this.previous = { ...this.current };
			}

			this.current.mouseXDelta = this.current.mouseX - this.previous.mouseX;
			this.current.mouseYDelta = this.current.mouseY - this.previous.mouseY;
		}
	}

	//todo: keycodes are deprecated
	private onKeyDown_(e: KeyboardEvent): void {
		this.keys[e.keyCode] = true;
	}

	private onKeyUp_(e: KeyboardEvent): void {
		this.keys[e.keyCode] = false;
	}

	key(keyCode: number): boolean {
		return !!this.keys[keyCode];
	}

	private onPointerLockChange_(): void {
		if (document.pointerLockElement === this.canvas) {
			console.log("Pointer lock enabled");
		} else {
			console.log("Pointer lock disabled");
		}
	}

	private onPointerLockError_(): void {
		console.log("Pointer lock error");
	}

	update(): void {
		if (this.previous !== null) {
			this.current.mouseXDelta = this.current.mouseX - this.previous.mouseX;
			this.current.mouseYDelta = this.current.mouseY - this.previous.mouseY;

			this.previous = { ...this.current };
		}
	}

	getXH(): number {
		return this.current.mouseXDelta / window.innerWidth;
	}

	getYH(): number {
		return this.current.mouseYDelta / window.innerHeight;
	}
}

export default class FirstPersonController {
	private camera: THREE.PerspectiveCamera;
	private input: InputController;
	private rotation: THREE.Quaternion;
	private translation: THREE.Vector3;
	private phi: number;
	private theta: number;
	private phiSpeed: number;
	private thetaSpeed: number;
	private moveSpeed: number;
	private headBobActive: boolean;

	constructor(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement) {
		this.camera = camera;
		this.input = new InputController(canvas);
		this.rotation = new THREE.Quaternion();
		this.translation = new THREE.Vector3();
		this.phi = 0;
		this.theta = 0;
		this.phiSpeed = 8;
		this.thetaSpeed = 5;
		this.moveSpeed = 3;
		this.headBobActive = false;
	}

	update(): void {
		this.input.update();
		this.updateRotation();
		this.updateCamera();
		this.updateTranslation(1 / 60);
	}

    setTranslation(x: number, y: number, z: number): void {
        this.translation.set(x, y, z);
    }

	private updateCamera(): void {
		this.camera.quaternion.copy(this.rotation);
		this.camera.position.copy(this.translation);
	}

	private updateRotation(): void {
		const xh = this.input.getXH();
		const yh = this.input.getYH();

		this.phi += -xh * this.phiSpeed;
		this.theta = clamp(
			this.theta + -yh * this.thetaSpeed,
			-Math.PI / 3,
			Math.PI / 3
		);

		const qx = new THREE.Quaternion();
		qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi);
		const qz = new THREE.Quaternion();
		qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta);

		const q = new THREE.Quaternion();
		q.multiply(qx);
		q.multiply(qz);

		this.rotation.copy(q);
	}

	private updateTranslation(timeElapsedS: number): void {
		const forwardVelocity =
			(this.input.key(KEYS.w) ? 1 : 0) + (this.input.key(KEYS.s) ? -1 : 0);
		const strafeVelocity =
			(this.input.key(KEYS.a) ? 1 : 0) + (this.input.key(KEYS.d) ? -1 : 0);
		const verticalVelocity =
			(this.input.key(KEYS.q) ? 1 : 0) + (this.input.key(KEYS.e) ? -1 : 0);

		const qx = new THREE.Quaternion();
		qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi);

		const forward = new THREE.Vector3(0, 0, -1);
		forward.applyQuaternion(qx);
		forward.multiplyScalar(forwardVelocity * timeElapsedS * this.moveSpeed);

		const left = new THREE.Vector3(-1, 0, 0);
		left.applyQuaternion(qx);
		left.multiplyScalar(strafeVelocity * timeElapsedS * this.moveSpeed);

		const up = new THREE.Vector3(0, 1, 0);
		up.multiplyScalar(verticalVelocity * timeElapsedS * this.moveSpeed);

		if (forwardVelocity !== 0 && strafeVelocity !== 0) {
			forward.multiplyScalar(1 / Math.sqrt(2));
			left.multiplyScalar(1 / Math.sqrt(2));
		}

		this.translation.add(forward);
		this.translation.add(left);
		this.translation.add(up);

		if (forwardVelocity !== 0 || strafeVelocity !== 0) {
			this.headBobActive = true;
		}
	}
}
