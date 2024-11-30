import { useGSStore } from "@/hooks/useGSStore";
import { useEffect, useRef } from "react";
import * as THREE from "three";
// ? maybe use import { useShallow } from "zustand/shallow";

/**
 * A GaussianSplats3D Scene to be rendered by a GS3DViewer
 */
export default function GS3DScene({
	sceneId,
	loadScene,
	viewer,
}: {
	sceneId: string;
	loadScene: any;
	viewer: any;
}) {
	const sceneContainer = useRef<THREE.Group>(null!);

	console.log("S: RE ", sceneId);
	const scenePosition = useGSStore(
		(state) => state.gsmap.scenes[sceneId].position
	);

	useEffect(() => {
		console.log("S: Loading scene", sceneId);
		const sceneData = useGSStore.getState().gsmap.scenes[sceneId];

		//todo: refactor this
		const baseParams = {
			sceneId: sceneId,
			container: sceneContainer.current,
		};

		if (sceneData.buffer) {
			baseParams.buffer = sceneData.buffer;
		} else {
			baseParams.path = sceneData.filePath;
		}

		loadScene(baseParams);
	}, [viewer]);

	//todo: rotation and scale

	const pos = scenePosition;

	//todo: Primitives will not dispose of the object they carry on unmount, you are responsible for disposing of it!
	return <group position={[pos.x, pos.y, pos.z]} ref={sceneContainer}></group>;
}
