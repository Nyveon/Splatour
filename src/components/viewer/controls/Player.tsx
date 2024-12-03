import { useJoystickControls } from "@/hooks/useJoystickControls";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { Controls } from "@/utils/constants";
import { useKeyboardControls } from "@react-three/drei";
import { RootState, useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

const walkSpeed = 5;
const rotationSpeed = 1.5;

export default function Player({ inControl }: { inControl: boolean }) {
	const [, getControls] = useKeyboardControls();
	const joystickState = useJoystickControls();
	const debug = useSettingsStore((state) => state.debug);

	useFrame((state: RootState, delta) => {
		// Get inputs
		const controls = inControl ? getControls() : {};
		const { moveX, moveY, cameraX, cameraY } = joystickState;
		const camera = state.camera;

		// Camera direction from inputs
		camera.rotation.order = "YXZ";
		const cameraDX = cameraY * rotationSpeed * delta;
		const cameraDY = -cameraX * rotationSpeed * delta;
		const rotationChange = cameraDX !== 0 || cameraDY !== 0;

		// Move direction from inputs
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
		const translationChange =
			straightDirection !== 0 ||
			strafeDirection !== 0 ||
			verticalDirection !== 0;

		// Skip if no change
		if (!rotationChange && !translationChange) {
			return;
		}

		// Calculate movement
		const forward = new Vector3();
		camera.getWorldDirection(forward);
		forward.y = 0;
		forward.normalize();
		const right = new Vector3();
		right.crossVectors(camera.up, forward).normalize();
		const move = new Vector3();
		move.add(forward.multiplyScalar(straightDirection));
		move.add(right.multiplyScalar(strafeDirection));
		move.y += debug ? verticalDirection : 0;

		if (move.length() > 0) {
			move.normalize();
		}

		move.multiplyScalar(walkSpeed * delta);

		// Update camera
		state.events.update?.();
		camera.position.add(move);
		camera.rotation.y += cameraDY;
		camera.rotation.x = Math.max(
			-Math.PI / 2,
			Math.min(Math.PI / 2, camera.rotation.x + cameraDX)
		);
	});

	return null;
}
