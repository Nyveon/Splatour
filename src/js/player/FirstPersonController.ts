import * as THREE from "three";

import { clamp } from "../_util.js";
import { KEYS } from "./InputController.js";
import InputController from "./InputController.js";

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
