import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import { produce } from "immer";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import GS3DScenes from "./GS3DMap";

const defaultSettings = {
	showLoadingUI: false,
	splatAlphaRemovalThreshold: 20,
	position: [0, 0, 0],
	rotation: [0, 0, 0, 1],
	scale: [1, 1, 1],
};

export default function GS3DViewer() {
	const [viewer, setViewer] = useState<GaussianSplats3D.DropInViewer | null>();
	const loadedScenes = useRef<Set<string>>(new Set());
	const [scenesQueue, setScenesQueue] = useState<
		Record<string, GaussianSplats3D.SplatSceneParams>
	>({});

	console.log("V: RE");

	// useEffect(() => {
	// 	const viewer = new GaussianSplats3D.DropInViewer({
	// 		gpuAcceleratedSort: false,
	// 		sharedMemoryForWorkers: true,
	// 		dynamicScene: true, //todo: should not be dynamic for exported viewer
	// 	});

	// 	setViewer(viewer);

	// 	return () => {
	// 		console.log("Vh1: Viewer disposal begin");
	// 		loadedScenes.current = new Set<string>();
	// 		// setScenesQueue({});
	// 		viewer
	// 			.dispose()
	// 			.then(() => {
	// 				console.log("Vh1: Viewer disposed");
	// 			})
	// 			.catch((err: unknown) => {
	// 				console.log("Vh1: Viewer disposal error:", err);
	// 			});
	// 		setViewer(null);
	// 	};
	// }, []);

	useEffect(() => {
		const scenes = Object.values(scenesQueue);

		if (scenes.length > 0) {
			const viewer = new GaussianSplats3D.DropInViewer({
				gpuAcceleratedSort: false,
				sharedMemoryForWorkers: true,
				dynamicScene: true, //todo: should not be dynamic for exported viewer
			});

			setViewer(viewer);

			// Update viewer with batched scenes
			console.log("Vh2: Updating viewer with scenes", scenesQueue);

			const fileScenes = scenes.filter((scene) => !scene.buffer);
			const bufferScenes = scenes.filter((scene) => scene.buffer);

			let loadSquence = Promise.resolve();

			if (fileScenes.length) {
				loadSquence = loadSquence.then(async () => {
					console.log("Vh2: Adding splat files");
					await viewer.addSplatScenes(fileScenes, true);
					console.log("Vh2: Splat files added");
				});
			}

			if (bufferScenes.length) {
				const splatBuffers = bufferScenes.flatMap(
					(scene) => scene.buffer || []
				);
				const splatBufferOptions = splatBuffers.map(() => defaultSettings);
				loadSquence = loadSquence.then(async () => {
					console.log("Vh2: Adding splat buffers");
					await viewer.viewer.addSplatBuffers(splatBuffers, splatBufferOptions);
					console.log("Vh2: Splat buffers added");
				});
			}

			loadSquence
				.then(() => {
					console.log("Vh2: All scenes added");
					scenes.forEach((scene, i) => {
						console.log("Vh2: Attaching scene to group", i);
						const splatScene = viewer.getSplatScene(i);
						//todo: maybe dispose all children?

						scene.container.add(splatScene);
						loadedScenes.current.add(scene.sceneId);
					});

					// setScenesQueue({});
				})
				.catch((err) => {
					console.log("Vh2: Error loading splat scenes", err);
				})
				.finally(() => {
					//todo: reset load queue here or in the "then"
					console.log("Vh2: hi");
					console.log(viewer);
				});

			// ? Cleanup or reset behavior can go here if needed
		} else {
			console.log("Vh2: Skipped because ", viewer, scenesQueue);
		}
	}, [scenesQueue]);

	const loadScene = (loadParams) => {
		if (loadParams.sceneId in loadedScenes.current) {
			console.log("Vload: Scene already loaded");
			return;
		}

		console.log("Vload: Loading scene", loadParams.sceneId);
		setScenesQueue(
			produce(scenesQueue, (draft) => {
				draft[loadParams.sceneId] = loadParams;
			})
		);
	};

	//todo: removeScene

	console.log(viewer);

	return (
		<>
			{viewer && <primitive object={viewer} />}
			{viewer && <GS3DScenes loadScene={loadScene} viewer={viewer} />}
		</>
	);
}
