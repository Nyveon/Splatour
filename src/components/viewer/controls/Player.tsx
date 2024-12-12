import { useInteractions } from "@/hooks/useInteractions";
import { useJoystickControls } from "@/hooks/useJoystickControls";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { Controls } from "@/utils/constants";
import { useKeyboardControls } from "@react-three/drei";
import { RootState, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";

const rotationSpeed = 1.5;

const walkingSpeed = 1.4; // meters per second
const walkingCadence = 115; // steps per minute
const stepsPerSecond = walkingCadence / 60;
const bobbingSpeed = stepsPerSecond * Math.PI * 2;
const bobbingAmplitude = 0.02;

export default function Player() {
	const [, getControls] = useKeyboardControls();
	const forward = new Vector3();
	const right = new Vector3();
	const move = new Vector3();

	const bobbingPhase = useRef(0);
	const bobbingOffset = useRef(0);

	useFrame((state: RootState, delta: number) => {
		// Handle teleportation
		const teleportPending = useInteractions.getState().teleportPending;
		const setTeleportPending = useInteractions.getState().setTeleportPending;

		if (teleportPending) {
			console.log(teleportPending);
			state.camera.position.set(
				teleportPending.x,
				teleportPending.y,
				teleportPending.z
			);
			setTeleportPending(null);
		}

		// Get inputs and state
		const inControl = useInteractions.getState().isLocked;
		const debug = useSettingsStore.getState().debug;
		const controls = inControl ? getControls() : {};
		const joystickState = useJoystickControls.getState();
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
		camera.getWorldDirection(forward);
		forward.y = 0;
		forward.normalize();
		right.crossVectors(camera.up, forward).normalize();
		move.set(0, 0, 0);
		move.add(forward.multiplyScalar(straightDirection));
		move.add(right.multiplyScalar(strafeDirection));
		move.y += debug ? verticalDirection : 0;

		const prevBobbingOffset = bobbingOffset.current;

		if (move.length() > 0) {
			move.normalize();
			bobbingPhase.current += delta * bobbingSpeed;
			bobbingOffset.current = Math.sin(bobbingPhase.current) * bobbingAmplitude;
		} else {
			bobbingPhase.current = 0;
			bobbingOffset.current = 0;
		}

		move.multiplyScalar(walkingSpeed * delta);

		camera.position.y += bobbingOffset.current - prevBobbingOffset;

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
