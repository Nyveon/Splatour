import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import { useEffect, useState } from "react";
import * as THREE from "three";
import GSMap from "./GSMap";
import GSScene from "./GSScene";

export default function GSViewer({ gsmap }: { gsmap: GSMap }) {
	console.log("Viewer redraw!");
	console.log(gsmap);
	const [viewer, setViewer] = useState<THREE.Group>(new THREE.Group());
	useEffect(() => {
		const viewer = new GaussianSplats3D.DropInViewer({
			sharedMemoryForWorkers: true, //todo: activate this
		});
		const addParams: { path: string }[] = gsmap.scenes.map(
			(scene: GSScene) => ({
				path: scene.filePath,
				...scene.getOptions(),
			}),
		);
		viewer
			.addSplatScenes(addParams, false)
			// Needed for next js
			.catch((err: Error) => {
				console.log("Error loading splat scenes:", err);
			});

		setViewer(viewer);

		return () => void viewer.dispose();
	}, [gsmap]);

	return <primitive object={viewer} />;
}
