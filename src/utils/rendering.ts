import type { Scene } from "three";

/** Signal a changed HDR input, separately from animation-only redraws. */
export function invalidateScene(scene: Scene, invalidate: () => void) {
	scene.userData.renderRevision = (scene.userData.renderRevision ?? 0) + 1;
	invalidate();
}
