import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions } from "@/hooks/useInteractions";
import { resolvePostProcessing } from "@/model/PostProcessing";
import { ScenePostProcessor } from "@/utils/postProcessing";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";

export default function ScenePostProcessing() {
	const processor = useRef<ScenePostProcessor | null>(null);
	useEffect(() => {
		const instance = new ScenePostProcessor();
		processor.current = instance;
		return () => {
			processor.current = null;
			instance.dispose();
		};
	}, []);
	useFrame(({ gl, scene, camera }, delta) => {
		const map = useGSStore.getState().gsmap;
		const sceneId =
			useInteractions.getState().currentSceneId || map.defaultScene;
		if (!processor.current || gl.xr.isPresenting) {
			gl.render(scene, camera);
			return;
		}
		const settings = resolvePostProcessing(map.scenes[sceneId]?.postProcessing);
		// Skip periodic exposure metering and GPU readback on mobile devices.
		if (isMobile) settings.autoExposure = false;
		processor.current.render(
			gl,
			scene,
			camera,
			settings,
			sceneId,
			delta
		);
	}, 1);
	return null;
}
