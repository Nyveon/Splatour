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

	private wallsArray: THREE.Mesh[] = [];

	constructor(
		camera: THREE.PerspectiveCamera,
		canvas: HTMLCanvasElement,
		wallsArray: THREE.Mesh[],
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

		this.wallsArray = wallsArray;
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
		this.input.setMode("birdsEye");
		this.input.releasePointerLock();
	}

	disableBirdsEye(): void {
		this.translation = this.translationBackup;
		this.phi = this.phiBackup;
		this.theta = this.thetaBackup;
		this.input.setMode("firstPerson");
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
		// Calculate input-based velocities
		const forwardVelocity =
			(this.input.key(KEYS.w) ? 1 : 0) + (this.input.key(KEYS.s) ? -1 : 0);
		const strafeVelocity =
			(this.input.key(KEYS.a) ? 1 : 0) + (this.input.key(KEYS.d) ? -1 : 0);

		// No vertical movement in this implementation
		const verticalVelocity = 0;

		// Compute the movement vector in world space
		const movementVector = new THREE.Vector3();

		const qx = new THREE.Quaternion();
		qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi);

		if (forwardVelocity !== 0 || strafeVelocity !== 0) {
			const forward = new THREE.Vector3(0, 0, -1);
			forward.applyQuaternion(qx);
			forward.normalize();

			const left = new THREE.Vector3(-1, 0, 0);
			left.applyQuaternion(qx);
			left.normalize();

			// Combine forward and strafe movements
			movementVector.addScaledVector(forward, forwardVelocity);
			movementVector.addScaledVector(left, strafeVelocity);
			movementVector.normalize(); // Ensure consistent movement speed

			movementVector.multiplyScalar(timeElapsedS * this.moveSpeed);
		}

		// Apply collision detection and response
		this.applyCollisionResponse(movementVector);

		// Update the player's position
		this.translation.add(movementVector);
	}

	private applyCollisionResponse(movementVector: THREE.Vector3): void {
		// Define the maximum number of collision iterations to prevent infinite loops
		const maxIterations = 3;
		let iteration = 0;

		// Temporary variables for calculations
		let remainingMovement = movementVector.clone();

		while (iteration < maxIterations && remainingMovement.lengthSq() > 0) {
			const proposedPosition = this.translation.clone().add(remainingMovement);

			// Perform collision detection
			const collisionResult = this.checkCollisionsRaycast(
				this.translation,
				proposedPosition
			);

			if (!collisionResult) {
				// No collision, movement is safe
				break;
			} else {
				// Adjust the movement vector based on collision normal
				const { collisionPoint, collisionNormal } = collisionResult;

				// Calculate the amount of movement into the collision plane
				const moveDistance = remainingMovement.length();
				const pushBack =
					remainingMovement.dot(collisionNormal) / collisionNormal.lengthSq();

				// Remove the component of movement in the direction of the collision normal
				const adjustment = collisionNormal.clone().multiplyScalar(pushBack);

				remainingMovement.sub(adjustment);

				// Increment iteration counter
				iteration++;
			}
		}

		// Update the movement vector with the adjusted remaining movement
		movementVector.copy(remainingMovement);
	}

	private checkCollisionsRaycast(
		currentPosition: THREE.Vector3,
		proposedPosition: THREE.Vector3
	): { collisionPoint: THREE.Vector3; collisionNormal: THREE.Vector3 } | null {
		const direction = new THREE.Vector3()
			.subVectors(proposedPosition, currentPosition)
			.normalize();
		const distance = currentPosition.distanceTo(proposedPosition);

		const raycaster = new THREE.Raycaster(
			currentPosition,
			direction,
			0,
			distance
		);

		const intersects = raycaster.intersectObjects(this.wallsArray, false);

		if (intersects.length > 0) {
			const collisionPoint = intersects[0].point;
			const collisionNormal =
				intersects[0].face?.normal.clone() || new THREE.Vector3();

			// Transform the collision normal to world space
			intersects[0].object.getWorldDirection(collisionNormal);

			return { collisionPoint, collisionNormal };
		}

		return null; // No collision
	}
}
