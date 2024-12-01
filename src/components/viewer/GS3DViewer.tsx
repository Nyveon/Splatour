import { SplatBuffer, DropInViewer } from "@mkkellogg/gaussian-splats-3d";
import { useEffect, useState } from "react";

interface SceneData {
	buffer?: SplatBuffer;
	filePath: string;
}

interface GS3DViewerProps {
	sceneData: SceneData;
	scenePosition: { x: number; y: number; z: number };
	sceneRotation: { x: number; y: number; z: number };
	sceneScale: { x: number; y: number; z: number };
}

export default function GS3DViewer({
	sceneData,
	scenePosition,
	sceneRotation,
	sceneScale,
}: GS3DViewerProps) {
	const [viewer, setViewer] = useState<DropInViewer | null>();

	console.log("Scene re-render");

	useEffect(() => {
		const viewer = new DropInViewer({
			sharedMemoryForWorkers: true,
			// todo: https://github.com/mkkellogg/GaussianSplats3D/issues/380
			dynamicScene: false,
			sceneFadeInRateMultiplier: 100,
		});
		console.log("Scene viewer created");
		setViewer(viewer);

		const defaultOptions = {
			showLoadingUI: true,
			splatAlphaRemovalThreshold: 20,
		};

		const loadScene = sceneData.buffer
			? viewer.viewer.addSplatBuffers([sceneData.buffer], [defaultOptions])
			: viewer.addSplatScene(sceneData.filePath, defaultOptions);

		loadScene
			.then(() => {
				console.log("Splat Scene loaded");
			})
			.catch((err) => {
				console.error(err);
			});

		return () => {
			console.log("Scene Viewer disposal started");
			setViewer(null);
			viewer
				.dispose()
				.then(() => {
					console.log("Scene Viewer disposal completed");
				})
				.catch((err: unknown) => {
					console.log("Scene Viewer disposal error:", err);
				});
		};
	}, [sceneData.filePath, sceneData.buffer]);

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
