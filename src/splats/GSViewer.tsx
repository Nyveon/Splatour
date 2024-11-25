import { DropInViewer } from "@mkkellogg/gaussian-splats-3d";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { useGSStore } from "../hooks/useGSStore";
import { GSScene, gssGetOptions } from "./GSScene";
import sceneContainerMap from "./sceneContainerMap";

export default function GSViewer() {
	const gsmap = useGSStore((state) => state.gsmap);

	const [viewer, setViewer] = useState<DropInViewer | THREE.Group>(
		new THREE.Group()
	);

	useEffect(() => {
		const viewer = new DropInViewer({
			sharedMemoryForWorkers: true,
		});
		const addParams: { path: string }[] = gsmap.scenes.map(
			(scene: GSScene) => ({
				path: scene.filePath,
				showLoadingUI: false,
				splatAlphaRemovalThreshold: 20,
				...gssGetOptions(scene),
			})
		);
		viewer
			.addSplatScenes(addParams, true)
			// .then(() => {
			// 	gsmap.scenes.forEach((scene, index) => {
			// 		const container = viewer.getSplatScene(index);
			// 		sceneContainerMap.set(scene.id, container);
			// 		// Initialize container transform
			// 		updateContainerTransform(scene, container);
			// 	});
			// })
			.catch((err: unknown) => {
				// Needed for next js
				console.log("Error loading splat scenes:", err);
			});

		setViewer(viewer);

		return () => {
			viewer.dispose();
			sceneContainerMap.clear();
		};
	}, [gsmap]);

	if (!gsmap) {
		return null;
	}

	return <primitive object={viewer} />;
}
