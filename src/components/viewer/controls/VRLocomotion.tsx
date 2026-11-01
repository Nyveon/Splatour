import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions } from "@/hooks/useInteractions";
import { playerHeight } from "@/utils/constants";
import {
	createTeleportVisuals,
	updateTeleportArc,
} from "@/utils/teleportVisuals";
import {
	SnapTurnInput,
	snapTurnRig,
	teleportArc,
	teleportDestination,
	teleportRig,
} from "@/utils/vrLocomotion";
import { useFrame, useThree } from "@react-three/fiber";
import { SplatMesh } from "@sparkjsdev/spark";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Box3, Quaternion, Vector3, type Group } from "three";

export default function VRLocomotion({
	rigRef,
}: {
	rigRef: RefObject<Group | null>;
}) {
	const { gl, camera, scene } = useThree();
	const snap = useMemo(() => new SnapTurnInput(), []);
	const aimSource = useRef<XRInputSource | null>(null);
	const armed = useRef(false);
	const wasAiming = useRef(false);
	const boundsCache = useMemo(() => new WeakMap<SplatMesh, Box3>(), []);
	const visuals = useMemo(() => createTeleportVisuals(playerHeight), []);
	useEffect(() => {
		const reset = () => {
			snap.reset();
			armed.current = wasAiming.current = false;
			aimSource.current = null;
			visuals.line.visible = visuals.marker.visible = false;
		};
		gl.xr.addEventListener("sessionstart", reset);
		gl.xr.addEventListener("sessionend", reset);
		return () => {
			gl.xr.removeEventListener("sessionstart", reset);
			gl.xr.removeEventListener("sessionend", reset);
			visuals.line.geometry.dispose();
			visuals.line.material.dispose();
			visuals.marker.geometry.dispose();
			visuals.marker.material.dispose();
		};
	}, [gl, snap, visuals]);

	const containsLoadedScene = (sceneId: string, target: Vector3) => {
		const bounds = new Box3();
		scene.traverse((root) => {
			if (root.userData.tourSceneId !== sceneId) return;
			root.traverse((object) => {
				if (!(object instanceof SplatMesh) || !object.userData.splatReady)
					return;
				let localBounds = boundsCache.get(object);
				if (!localBounds) {
					localBounds = object.getBoundingBox(true);
					boundsCache.set(object, localBounds);
				}
				object.updateWorldMatrix(true, false);
				bounds.union(localBounds.clone().applyMatrix4(object.matrixWorld));
			});
		});
		return (
			!bounds.isEmpty() &&
			target.x >= bounds.min.x &&
			target.x <= bounds.max.x &&
			target.z >= bounds.min.z &&
			target.z <= bounds.max.z
		);
	};

	useFrame((_state, _delta, frame) => {
		const rig = rigRef.current;
		const session = gl.xr.getSession();
		const space = gl.xr.getReferenceSpace();
		visuals.line.visible = visuals.marker.visible = false;
		if (
			!rig ||
			!gl.xr.isPresenting ||
			!session ||
			!frame ||
			!space ||
			session.visibilityState !== "visible"
		) {
			wasAiming.current = armed.current = false;
			snap.reset();
			return;
		}
		const sources = [...session.inputSources].filter(
			(source) => !source.hand && source.gamepad
		);
		const right = sources.find((source) => source.handedness === "right");
		const turn = snap.update(right?.gamepad?.axes[2] ?? 0);
		if (turn) snapTurnRig(rig, camera, turn);
		const left = sources.find((source) => source.handedness === "left");
		const pose = left && frame.getPose(left.targetRaySpace, space);
		if (!left || !pose) {
			wasAiming.current = armed.current = false;
			aimSource.current = null;
			return;
		}
		if (aimSource.current !== left) {
			aimSource.current = left;
			wasAiming.current = armed.current = false;
		}
		const aiming =
			(left.gamepad?.buttons[0]?.value ?? 0) > 0.5 ||
			(left.gamepad?.axes[3] ?? 0) < -0.65;
		if (!aiming && !wasAiming.current) armed.current = true;
		if (!armed.current || (!aiming && !wasAiming.current)) return;
		rig.updateWorldMatrix(true, true);
		const origin = new Vector3()
			.copy(pose.transform.position)
			.applyMatrix4(rig.matrixWorld);
		const direction = new Vector3(0, 0, -1)
			.applyQuaternion(new Quaternion().copy(pose.transform.orientation))
			.transformDirection(rig.matrixWorld);
		const { points, target } = teleportArc(origin, direction);
		const map = useGSStore.getState().gsmap;
		const sceneId =
			useInteractions.getState().currentSceneId || map.defaultScene;
		const head = camera.getWorldPosition(new Vector3());
		const destination =
			target && teleportDestination(map, sceneId, head, target);
		const valid = !!(
			destination &&
			target &&
			containsLoadedScene(destination.sceneId, target)
		);
		if (!aiming) {
			wasAiming.current = false;
			if (valid && target && destination) {
				teleportRig(rig, camera, target);
				useInteractions.getState().setCurrentSceneId(destination.sceneId);
			}
			return;
		}
		wasAiming.current = true;
		const color = valid ? "#78e08f" : "#ff7979";
		visuals.line.material.color.set(color);
		visuals.marker.material.color.set(color);
		updateTeleportArc(visuals.line, points);
		visuals.line.visible = true;
		if (target) {
			visuals.marker.position.copy(target);
			visuals.marker.visible = true;
		}
	}, -0.5);
	return (
		<group>
			<primitive object={visuals.line} />
			<primitive object={visuals.marker} />
		</group>
	);
}
