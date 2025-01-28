import { useGSStore } from "@/hooks/useGSStore";
import { GSScene } from "@/model/GSScene";
import { DropInViewer, SplatSceneParams } from "@mkkellogg/gaussian-splats-3d";
import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { useShallow } from "zustand/react/shallow";

function gssUpdateTransform(container: THREE.Object3D, scene: GSScene) {
	container.rotation.set(scene.rotation.x, scene.rotation.y, scene.rotation.z);
	container.position.set(scene.position.x, scene.position.y, scene.position.z);
	container.scale.set(scene.scale.x, scene.scale.y, scene.scale.z);
}

function gssUpdateTransforms(viewer: DropInViewer, scenes: GSScene[]) {
	scenes.forEach((scene, index) => {
		const sceneContainer = viewer.getSplatScene(index).parent;

		if (!sceneContainer) {
			return;
		}

		gssUpdateTransform(sceneContainer, scene);
	});
	return;
}

export default function CompositeViewer() {
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
			sharedMemoryForWorkers: true,
			dynamicScene: true,
			sceneFadeInRateMultiplier: 100,
		});

		const defaultSettings = {
			showLoadingUI: true,
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
		console.log("Splat count:", viewer.splatMesh.getSplatCount());
		gssUpdateTransforms(viewer, scenes);
	}, [scenes, localLoading, viewer]);

	if (!viewer || !scenes.length) {
		return null;
	}

	return <primitive object={viewer} />;
}
