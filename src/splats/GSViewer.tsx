import { DropInViewer } from "@mkkellogg/gaussian-splats-3d";
import { useEffect, useState } from "react";
import * as THREE from "three";
import GSMap from "./GSMap";
import GSScene from "./GSScene";

export default function GSViewer({ gsmap }: { gsmap: GSMap }) {
	const [viewer, setViewer] = useState<DropInViewer | THREE.Group>(
		new THREE.Group(),
	);
	useEffect(() => {
		const viewer = new DropInViewer({
			sharedMemoryForWorkers: true,
			// gpuAcceleratedSort: true, //todo: check why this fails?
			// inMemoryCompressionLevel: 2,
			// integerBasedSort: false,
			// halfPrecisionCovariancesOnGPU: true,
			// splatRenderMode: "TwoD",
			// splatSortDistanceMapPrecision: 4,
			// ignoreDevicePixelRatio: true,
			logLevel: 4,
			// optimizeSplatData: false,
			// useBuiltInControls: false,
			// set rendered?
			// set camera?
		});
		const addParams: { path: string }[] = gsmap.scenes.map(
			(scene: GSScene) => ({
				path: scene.filePath,
				showLoadingUI: false,
				splatAlphaRemovalThreshold: 20, //todo: parametrize this
				...scene.getOptions(),
			}),
		);
		viewer
			.addSplatScenes(addParams, true)
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
