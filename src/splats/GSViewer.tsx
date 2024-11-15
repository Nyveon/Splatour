import { DropInViewer } from "@mkkellogg/gaussian-splats-3d";
import { useEffect, useState } from "react";
import * as THREE from "three";
import GSMap from "./GSMap";
import GSScene from "./GSScene";

export default function GSViewer({ gsmap }: { gsmap: GSMap }) {
	console.log("Viewer redraw!");
	console.log(gsmap);
	const [viewer, setViewer] = useState<DropInViewer | THREE.Group>(
		new THREE.Group(),
	);
	useEffect(() => {
		const viewer = new DropInViewer({
			sharedMemoryForWorkers: true,
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
			.catch((err: unknown) => {
				console.log("Error loading splat scenes:", err);
			});

		setViewer(viewer);

		return () => {
			viewer.dispose();
		};
	}, [gsmap]);

	return <primitive object={viewer} />;
}
