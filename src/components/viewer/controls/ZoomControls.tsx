import { fovNotch, maxFov, minFov } from "@/utils/constants";
import { useInteractions } from "@/hooks/useInteractions";
import useViewerStore from "@/hooks/useViewerContext";
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
    const viewerContainerRef = useViewerStore((state) => state.viewerContainerRef);
    const desiredFov = useRef(camera.fov);
    useEffect(() => {
        desiredFov.current = camera.fov;
        const handleWheel = (event: WheelEvent) => {
            if (event.ctrlKey) return;
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
            desiredFov.current = MathUtils.clamp(desiredFov.current + notches * fovNotch, minFov, maxFov);
        };
        window.addEventListener("wheel", handleWheel, { passive: false });
        return () => window.removeEventListener("wheel", handleWheel);
    }, [camera, viewerContainerRef]);

    // smoothing
    useFrame((_, delta) => {
        if (Math.abs(camera.fov - desiredFov.current) >= 0.01) {
            camera.fov = MathUtils.damp(camera.fov, desiredFov.current, 20, delta);
            camera.updateProjectionMatrix();
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
