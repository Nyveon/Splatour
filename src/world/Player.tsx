import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useJoystickControls } from "../hooks/useJoystickControls";
import { Controls } from "../utils/constants";

const speed = 5;

export default function Player() {
	const [, getControls] = useKeyboardControls();
	const joystickState = useJoystickControls();
	const joystickX = joystickState.x / 100; // Normalize to -1 to 1
	const joystickY = joystickState.y / 100;

	useFrame((state, delta) => {
		const controls = getControls();

		const straightDirection =
			(controls[Controls.forward] ? 1 : 0) -
			(controls[Controls.backward] ? 1 : 0) +
			joystickY;
		const strafeDirection =
			(controls[Controls.left] ? 1 : 0) -
			(controls[Controls.right] ? 1 : 0) -
			joystickX;
		const verticalDirection =
			(controls[Controls.up] ? 1 : 0) - (controls[Controls.down] ? 1 : 0);

		const camera = state.camera;

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

		move.multiplyScalar(speed * delta);

		camera.position.add(move);
	});

	return null;
}
