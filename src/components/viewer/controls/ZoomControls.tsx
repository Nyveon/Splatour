import { useInteractions } from "@/hooks/useInteractions";
import { useProductStore } from "@/hooks/useProductStore";
import useViewerStore from "@/hooks/useViewerContext";
import { fovNotch, maxFov, minFov } from "@/utils/constants";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type RefObject } from "react";
import { MathUtils, PerspectiveCamera } from "three";
import type { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";

export default function ZoomControls({
	controlsRef,
}: {
	controlsRef?: RefObject<PointerLockControlsImpl | null>;
}) {
	const camera = useThree((state) => state.camera) as PerspectiveCamera;
	const invalidate = useThree((state) => state.invalidate);
	const viewerContainerRef = useViewerStore(
		(state) => state.viewerContainerRef
	);
	const desiredFov = useRef(camera.fov);
	useEffect(() => {
		desiredFov.current = camera.fov;
		const handleWheel = (event: WheelEvent) => {
			if (
				event.ctrlKey ||
				useProductStore.getState().active ||
				useProductStore.getState().cartOpen
			)
				return;
			const container = viewerContainerRef?.current;
			const locked = useInteractions.getState().isLocked;
			const insideViewer =
				container !== null &&
				container !== undefined &&
				event.target instanceof Node &&
				container.contains(event.target);
			if (!locked && !insideViewer) return;
			event.preventDefault();
			const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 100 : 1;
			const notches = (event.deltaY * unit) / 100;
			desiredFov.current = MathUtils.clamp(
				desiredFov.current + notches * fovNotch,
				minFov,
				maxFov
			);
			invalidate();
		};
		window.addEventListener("wheel", handleWheel, { passive: false });
		return () => window.removeEventListener("wheel", handleWheel);
	}, [camera, viewerContainerRef, invalidate]);

	// smoothing
	useFrame(({ gl }, delta) => {
		if (gl.xr.isPresenting) return;
		if (Math.abs(camera.fov - desiredFov.current) >= 0.01) {
			camera.fov = MathUtils.damp(
				camera.fov,
				desiredFov.current,
				20,
				delta > 0.25 ? 1 / 60 : Math.min(delta, 0.1)
			);
			if (Math.abs(camera.fov - desiredFov.current) < 0.01)
				camera.fov = desiredFov.current;
			camera.updateProjectionMatrix();
			invalidate();
		}
		// mouse sensitivity needs to scale with zoom-in
		const controls = controlsRef?.current;
		if (controls) {
			const fovRatio =
				Math.tan(MathUtils.degToRad(camera.fov) / 2) /
				Math.tan(MathUtils.degToRad(maxFov) / 2);
			controls.pointerSpeed = fovRatio;
		}
	});
	return null;
}
