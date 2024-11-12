import * as THREE from "three";

import { clamp } from "../_util.js";
import { KEYS } from "./InputController.js";
import InputController from "./InputController.js";

export default class FirstPersonController {
	private camera: THREE.PerspectiveCamera;
	private input: InputController;
	private rotation: THREE.Quaternion;
	private translation: THREE.Vector3;
    private translationBackup: THREE.Vector3 = new THREE.Vector3();
	private phi: number;
    private phiBackup: number = 0;
	private theta: number;
    private thetaBackup: number = 0;
	private phiSpeed: number;
	private thetaSpeed: number;
	private moveSpeed: number;
	private debug: boolean;

	constructor(
		camera: THREE.PerspectiveCamera,
		canvas: HTMLCanvasElement,
		debug = false
	) {
		this.camera = camera;
		this.input = new InputController(canvas);
		this.rotation = new THREE.Quaternion();
		this.translation = new THREE.Vector3();
		this.phi = 0;
		this.theta = 0;
		this.phiSpeed = 8;
		this.thetaSpeed = 5;
		this.moveSpeed = 3;
		this.debug = debug;
	}

	update(): void {
		this.input.update();
		this.updateRotation();
		this.updateCamera();
		this.updateTranslation(1 / 60);
	}

    enableBirdsEye(): void {
        this.translationBackup = this.translation.clone();
        this.phiBackup = this.phi;
        this.thetaBackup = this.theta;
        this.input.setMode('birdsEye');
        this.input.releasePointerLock();
    }

    disableBirdsEye(): void {
        this.translation = this.translationBackup;
        this.phi = this.phiBackup;
        this.theta = this.thetaBackup;
        this.input.setMode('firstPerson');
    }

	setTranslation(x: number, y: number, z: number): void {
		this.translation.set(x, y, z);
	}

	private updateCamera(): void {
		this.camera.quaternion.copy(this.rotation);
		this.camera.position.copy(this.translation);
	}

    public setRotation(phi: number, theta: number): void {
        this.phi = phi;
        this.theta = theta;
    }

	private updateRotation(): void {
		const xh = this.input.getXH();
		const yh = this.input.getYH();

		this.phi += -xh * this.phiSpeed;
		this.theta = clamp(
			this.theta + -yh * this.thetaSpeed,
			-Math.PI / 2,
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
			(this.input.key(KEYS.space) ? 1 : 0) +
			(this.input.key(KEYS.shift) ? -1 : 0);

		const qx = new THREE.Quaternion();
		qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi);

		const forward = new THREE.Vector3(0, 0, -1);
		forward.applyQuaternion(qx);
		forward.multiplyScalar(forwardVelocity * timeElapsedS * this.moveSpeed);

		const left = new THREE.Vector3(-1, 0, 0);
		left.applyQuaternion(qx);
		left.multiplyScalar(strafeVelocity * timeElapsedS * this.moveSpeed);

		const up = this.debug
			? new THREE.Vector3(0, 1, 0)
			: new THREE.Vector3(0, 0, 0);
		up.multiplyScalar(verticalVelocity * timeElapsedS * this.moveSpeed);

		if (forwardVelocity !== 0 && strafeVelocity !== 0) {
			forward.multiplyScalar(1 / Math.sqrt(2));
			left.multiplyScalar(1 / Math.sqrt(2));
		}

		this.translation.add(forward);
		this.translation.add(left);
		this.translation.add(up);
	}
}
