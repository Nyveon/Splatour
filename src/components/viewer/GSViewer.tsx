import { useGSStore } from "@/hooks/useGSStore";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import { useEffect, useState } from "react";

export default function GSViewer({ sceneId }: { sceneId: string }) {
	const [viewer, setViewer] = useState<GaussianSplats3D.DropInViewer | null>();
	const scenePosition = useGSStore(
		(state) => state.gsmap.scenes[sceneId].position
	);
	const sceneRotation = useGSStore(
		(state) => state.gsmap.scenes[sceneId].rotation
	);
	const sceneScale = useGSStore((state) => state.gsmap.scenes[sceneId].scale);

	console.log("Vh1");

	useEffect(() => {
		const viewer = new GaussianSplats3D.DropInViewer({
			sharedMemoryForWorkers: true,
			// todo: https://github.com/mkkellogg/GaussianSplats3D/issues/380
			dynamicScene: false,
			sceneFadeInRateMultiplier: 100,
		});
		console.log("Vh1: Viewer created");
		setViewer(viewer);

		const scene = useGSStore.getState().gsmap.scenes[sceneId];

		const defaultOptions = {
			showLoadingUI: true,
			splatAlphaRemovalThreshold: 20,
		};

		const loadScene = scene.buffer
			? viewer.viewer.addSplatBuffers([scene.buffer], [defaultOptions])
			: viewer.addSplatScene(scene.filePath, defaultOptions);

		loadScene
			.then(() => {
				console.log("Vh1: scene loaded");
			})
			.catch((err) => {
				console.error(err);
			});

		return () => {
			console.log("Vh1: Viewer disposal begin");
			setViewer(null);
			viewer
				.dispose()
				.then(() => {
					console.log("Vh1: Viewer disposed");
				})
				.catch((err: unknown) => {
					console.log("Vh1: Viewer disposal error:", err);
				});
		};
	}, [sceneId]);

	return (
		<group
			position={[scenePosition.x, scenePosition.y, scenePosition.z]}
			scale={[sceneScale.x, sceneScale.y, sceneScale.z]}
			rotation={[sceneRotation.x, sceneRotation.y, sceneRotation.z]}
		>
			{viewer && <primitive object={viewer} />}
		</group>
	);
}
