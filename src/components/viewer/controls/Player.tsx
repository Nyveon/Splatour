import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions } from "@/hooks/useInteractions";
import { useJoystickControls } from "@/hooks/useJoystickControls";
import { useProductStore } from "@/hooks/useProductStore";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import {
	barrierHeight,
	Controls,
	playerCrouchHeight,
	playerHeight,
} from "@/utils/constants";
import { moveTourPlayer } from "@/utils/tourCollisions";
import { useKeyboardControls } from "@react-three/drei";
import { RootState, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils, Vector3 } from "three";

const rotationSpeed = 1.5; // for joystick
const walkingSpeed = 1.4; // meters per second
const walkingCadence = 115; // steps per minute
const stepsPerSecond = walkingCadence / 60;
const bobbingSpeed = stepsPerSecond * Math.PI * 2;
const bobbingAmplitude = 0.02;

const forward = new Vector3();
const right = new Vector3();
const move = new Vector3();

function applyCollisionResponse(
	currentPosition: Vector3,
	movementVector: Vector3
): void {
	if (useSettingsStore.getState().noclip && useSettingsStore.getState().debug) {
		return;
	}
	// Preserve the editor's ability to fly above or below the ground barriers.
	if (currentPosition.y < 0 || currentPosition.y > barrierHeight) return;
	const map = useGSStore.getState().gsmap;
	const interactions = useInteractions.getState();
	const sceneId = interactions.currentSceneId || map.defaultScene;
	const result = moveTourPlayer(map, sceneId, currentPosition, movementVector);
	movementVector.x = result.position.x - currentPosition.x;
	movementVector.z = result.position.z - currentPosition.z;
	if (result.sceneId !== sceneId) {
		interactions.setCurrentSceneId(result.sceneId);
	}
}

export default function Player() {
	const [, getControls] = useKeyboardControls();
	const bobbingPhase = useRef(0);
	const bobbingOffset = useRef(0);
	const crouchOffset = useRef(0);

	useFrame((state: RootState, delta: number) => {
		// WebXR owns the head pose; VRControls moves its parent rig instead.
		if (state.gl.xr.isPresenting) return;
		if (
			useProductStore.getState().active ||
			useProductStore.getState().cartOpen
		)
			return;
		// Avoid huge camera jumps after a stall or returning to a background tab.
		delta = Math.min(delta, 0.1);
		// Handle teleportation
		const teleportPending = useInteractions.getState().teleportPending;
		const setTeleportPending = useInteractions.getState().setTeleportPending;

		if (teleportPending) {
			state.camera.position.set(
				teleportPending.x,
				teleportPending.y,
				teleportPending.z
			);
			state.camera.position.y += crouchOffset.current;
			setTeleportPending(null);
		}

		// Get inputs and state
		const inControl = useInteractions.getState().isLocked;
		const debug = useSettingsStore.getState().debug;
		const controls = inControl ? getControls() : {};
		const joystickState = useJoystickControls.getState();
		const { moveX, moveY, cameraX, cameraY } = joystickState;
		const camera = state.camera;

		// Crouching
		const crouching = Boolean(controls[Controls.crouch]);
		const targetCrouchOffset = crouching
			? playerCrouchHeight - playerHeight
			: 0;
		const prevCrouchOffset = crouchOffset.current;
		// smoothing
		crouchOffset.current = MathUtils.damp(
			crouchOffset.current,
			targetCrouchOffset,
			10,
			delta
		);
		camera.position.y += crouchOffset.current - prevCrouchOffset;

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

		move.normalize();
		const instantSpeed =
			useSettingsStore.getState().flySpeed *
			walkingSpeed *
			(crouching ? 0.5 : 1.0) *
			delta;
		move.multiplyScalar(instantSpeed);

		// Collisions
		applyCollisionResponse(camera.position, move);

		// View bobbing
		if (translationChange && move.length() > instantSpeed / 2) {
			bobbingPhase.current += delta * bobbingSpeed;
			bobbingOffset.current = Math.sin(bobbingPhase.current) * bobbingAmplitude;
		} else {
			bobbingPhase.current = 0;
			bobbingOffset.current = 0;
		}
		camera.position.y += bobbingOffset.current - prevBobbingOffset;

		// Update camera
		camera.position.add(move);
		camera.rotation.y += cameraDY;
		camera.rotation.x = Math.max(
			-Math.PI / 2,
			Math.min(Math.PI / 2, camera.rotation.x + cameraDX)
		);
		if (
			rotationChange ||
			move.lengthSq() > 0 ||
			teleportPending ||
			Math.abs(crouchOffset.current - prevCrouchOffset) > 1e-6 ||
			bobbingOffset.current !== prevBobbingOffset
		) {
			state.events.update?.();
		}
	});

	return null;
}
