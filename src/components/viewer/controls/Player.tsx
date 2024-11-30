import { useJoystickControls } from "@/hooks/useJoystickControls";
import { Controls } from "@/utils/constants";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const walkSpeed = 5;
const rotationSpeed = 1.5;

export default function Player() {
	const [, getControls] = useKeyboardControls();
	const joystickState = useJoystickControls();

	useFrame((state, delta) => {
		const controls = getControls();
		const { moveX, moveY, cameraX, cameraY } = joystickState;
		const camera = state.camera;

		// Move direction
		const straightDirection =
			(controls[Controls.forward] ? 1 : 0) -
			(controls[Controls.backward] ? 1 : 0) +
			moveY;
		const strafeDirection =
			(controls[Controls.left] ? 1 : 0) -
			(controls[Controls.right] ? 1 : 0) -
			moveX;
		const verticalDirection =
			(controls[Controls.up] ? 1 : 0) - (controls[Controls.down] ? 1 : 0);

		// Camera direction
		camera.rotation.order = "YXZ";
		camera.rotation.y -= cameraX * rotationSpeed * delta;
		camera.rotation.x += cameraY * rotationSpeed * delta;

		const forward = new THREE.Vector3();
		camera.getWorldDirection(forward);
		forward.y = 0;
		forward.normalize();

		const right = new THREE.Vector3();
		right.crossVectors(camera.up, forward).normalize();

		const move = new THREE.Vector3();
		move.add(forward.multiplyScalar(straightDirection));
		move.add(right.multiplyScalar(strafeDirection));
		move.y += verticalDirection;

		if (move.length() > 0) {
			move.normalize();
		}

		move.multiplyScalar(walkSpeed * delta);

		camera.position.add(move);
	});

	return null;
}
