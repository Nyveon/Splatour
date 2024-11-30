import { useGSStore } from "@/hooks/useGSStore";
import { GSScene, gssUpdateTransforms } from "@/model/GSScene";
import { DropInViewer, SplatSceneParams } from "@mkkellogg/gaussian-splats-3d";
import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { useShallow } from "zustand/react/shallow";

export default function GSViewer() {
	const scenes: GSScene[] = useGSStore(
		useShallow((state) => Object.values(state.gsmap.scenes))
	);
	const sceneIds = useGSStore(
		useShallow((state) => Object.keys(state.gsmap.scenes))
	);
	const [viewer, setViewer] = useState<DropInViewer>();
	const [loading, setLoading] = useState<boolean>(false);

	const { scene } = useThree();

	let localLoading = loading;
	function setLoadingImmediate(value: boolean) {
		localLoading = value;
		setLoading(value);
	}

	console.log("GSViewer re-render");

	useEffect(() => {
		console.log("Hook1");

		setLoadingImmediate(true);

		//todo: should only be dynamic for the editor
		const viewer = new DropInViewer({
			// sharedMemoryForWorkers: true,
			// dynamicScene: true,
		});

		const defaultSettings = {
			showLoadingUI: false,
			splatAlphaRemovalThreshold: 20,
		};

		const fileScenes = scenes.filter((scene) => !scene.buffer);

		const fileSceneParams: SplatSceneParams[] = fileScenes.map(
			(scene: GSScene) => ({
				path: scene.filePath,
				...defaultSettings,
			})
		);

		const splatBuffers = scenes.flatMap((scene) => {
			if (!scene.buffer) return [];
			return scene.buffer;
		});
		const splatBufferOptions = splatBuffers.map(() => defaultSettings);

		const addSplatBuffersPromise = splatBuffers.length
			? viewer.viewer.addSplatBuffers(splatBuffers, splatBufferOptions)
			: Promise.resolve();

		const addSplatFilesPromise = fileSceneParams.length
			? viewer.addSplatScenes(fileSceneParams, true)
			: Promise.resolve();

		console.log("Hook1: adding scenes");

		Promise.all([addSplatBuffersPromise, addSplatFilesPromise])
			.then(() => {
				console.log("Hook1: all scenes added");
				console.log(viewer);

				const sceneCount = viewer.getSceneCount();
				console.log("Scenes:", sceneCount);
				for (let i = 0; i < sceneCount; i++) {
					const group = new THREE.Group();
					group.add(viewer.getSplatScene(i));
					scene.add(group);
				}

				gssUpdateTransforms(viewer, scenes);
			})
			.catch((err: unknown) => {
				console.log("Hook1: Error loading splat scenes:", err);
			})
			.finally(() => {
				console.log("Hook1: setting loading to false", loading);
				setLoadingImmediate(false);
			});

		setViewer(viewer);

		return () => {
			console.log("Hook1: Viewer disposal begin");
			viewer
				.dispose()
				.then(() => {
					console.log("Hook1: Viewer disposed");
				})
				.catch((err: unknown) => {
					console.log("Hook1: Viewer disposal error:", err);
				});
		};
	}, [sceneIds]); //todo change to length of key array
	// todo: maybe this should only run once

	useEffect(() => {
		console.log("Hook2", localLoading);
		if (!viewer || localLoading) {
			console.log("Hook2: skipped");
			return;
		}
		console.log("Hook2: running");
		gssUpdateTransforms(viewer, scenes);
	}, [scenes, localLoading, viewer]);

	if (!viewer || !scenes.length) {
		return null;
	}

	return <primitive object={viewer} />;
}
