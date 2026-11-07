import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions, UserState } from "@/hooks/useInteractions";
import { useProductStore } from "@/hooks/useProductStore";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { NodeType } from "@/model/GSNode";
import { useThree } from "@react-three/fiber";
import { SplatMesh } from "@sparkjsdev/spark";
import { useEffect } from "react";
import {
	Box3,
	Euler,
	Matrix4,
	Quaternion,
	Raycaster,
	Vector2,
	Vector3,
	type Intersection,
} from "three";

export default function ProductPicker() {
	const { gl, camera, scene } = useThree();
	useEffect(() => {
		const canvas = gl.domElement;
		const eventDocument = canvas.ownerDocument;
		const pick = (checkOcclusion: boolean) => {
			const lockedElement = eventDocument.pointerLockElement;
			const lockedHere =
				lockedElement !== null &&
				(lockedElement === canvas || lockedElement.contains(canvas));
			if (!lockedHere) return;
			if (
				useProductStore.getState().active ||
				useProductStore.getState().cartOpen
			)
				return;
			const interactions = useInteractions.getState();
			if (interactions.userState !== UserState.None) return;
			const map = useGSStore.getState().gsmap;
			const sceneId = interactions.currentSceneId || map.defaultScene;
			const data = map.scenes[sceneId];
			if (!data) return;
			const products = Object.values(data.artifacts).filter(
				(node) => node.product
			);
			if (!products.length) return;
			camera.updateWorldMatrix(true, false);
			const raycaster = new Raycaster();
			raycaster.setFromCamera(new Vector2(), camera);
			const transform = new Matrix4().compose(
				new Vector3(data.position.x, data.position.y, data.position.z),
				new Quaternion().setFromEuler(
					new Euler(data.rotation.x, data.rotation.y, data.rotation.z)
				),
				new Vector3(data.scale.x, data.scale.y, data.scale.z)
			);
			const localRay = raycaster.ray
				.clone()
				.applyMatrix4(transform.clone().invert());
			let nearest: { id: string; distance: number } | undefined;
			for (const node of products) {
				if (!node.product) continue;
				const center = new Vector3(
					node.position.x,
					node.position.y,
					node.position.z
				);
				const size = new Vector3(
					node.product.hitbox.x,
					node.product.hitbox.y,
					node.product.hitbox.z
				);
				const point = localRay.intersectBox(
					new Box3().setFromCenterAndSize(center, size),
					new Vector3()
				);
				if (!point) continue;
				const distance = point
					.applyMatrix4(transform)
					.distanceTo(raycaster.ray.origin);
				if (distance <= 6 && (!nearest || distance < nearest.distance))
					nearest = { id: node.id, distance };
			}
			if (!nearest) return;
			const target = { sceneId, artifactId: nearest.id };
			if (!checkOcclusion) return target;
			const surfaces: Intersection[] = [];
			scene.traverseVisible((object) => {
				if (!(object instanceof SplatMesh) || !object.isInitialized) return;
				const previous = object.raycastable;
				try {
					object.raycastable = true;
					object.raycast(raycaster, surfaces);
				} finally {
					object.raycastable = previous;
				}
			});
			const surface = surfaces.reduce(
				(distance, hit) => Math.min(distance, hit.distance),
				Infinity
			);
			if (!Number.isFinite(surface) || surface + 0.3 < nearest.distance) return;
			return target;
		};
		const updateAim = () => {
			useProductStore.getState().setAimed(pick(false) ?? null);
		};
		const click = (event: MouseEvent) => {
			if (event.button !== 0) return;
			const editing = useSettingsStore.getState().debug;
			const target = pick(!editing);
			if (!target) return;
			event.preventDefault();
			event.stopImmediatePropagation();
			useInteractions.getState().unlock();
			useProductStore.getState().setAimed(null);
			if (editing)
				useInteractions
					.getState()
					.setCurrentNode(target.artifactId, NodeType.Artifact);
			else useProductStore.getState().open(target.sceneId, target.artifactId);
			eventDocument.exitPointerLock();
		};
		const timer = window.setInterval(updateAim, 150);
		eventDocument.addEventListener("pointerlockchange", updateAim);
		eventDocument.addEventListener("click", click, true);
		return () => {
			window.clearInterval(timer);
			eventDocument.removeEventListener("pointerlockchange", updateAim);
			eventDocument.removeEventListener("click", click, true);
			useProductStore.getState().setAimed(null);
		};
	}, [gl, camera, scene]);
	return null;
}
