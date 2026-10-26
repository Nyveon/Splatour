import { SplatMesh } from "@sparkjsdev/spark";
import {
	Raycaster,
	Vector2,
	type Camera,
	type Intersection,
	type Object3D,
} from "three";

/** One-shot surface pick, restricted to the selected visible scene's splats. */
export function pickSplatSurface(
	scene: Object3D,
	sceneId: string,
	camera: Camera,
	canvas: HTMLCanvasElement,
	event: PointerEvent
) {
	const bounds = canvas.getBoundingClientRect();
	const ray = new Raycaster();
	ray.setFromCamera(
		new Vector2(
			((event.clientX - bounds.left) / bounds.width) * 2 - 1,
			(-(event.clientY - bounds.top) / bounds.height) * 2 + 1
		),
		camera
	);
	const hits: Intersection[] = [];
	scene.traverseVisible((object) => {
		if (object.userData.floorAlignmentSceneId !== sceneId) return;
		object.traverseVisible((child) => {
			if (!(child instanceof SplatMesh) || !child.isInitialized) return;
			child.updateWorldMatrix(true, false);
			const wasRaycastable = child.raycastable;
			try {
				child.raycastable = true;
				child.raycast(ray, hits);
			} finally {
				child.raycastable = wasRaycastable;
			}
		});
	});
	hits.sort((a, b) => a.distance - b.distance);
	return hits[0]?.point;
}
