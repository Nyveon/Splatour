import { DropInViewer, SplatBuffer } from "@mkkellogg/gaussian-splats-3d";
import { forwardRef, useEffect, useState } from "react";
import type { Group } from "three";

interface SceneData {
	buffer?: SplatBuffer;
	filePath: string;
}

interface SceneViewerProps {
	sceneData: SceneData;
}

const SceneViewer = forwardRef<Group, SceneViewerProps>(function GS3DViewer(
	{ sceneData }: SceneViewerProps,
	ref
) {
	const [viewer, setViewer] = useState<DropInViewer | null>();

	console.log("Scene re-render");

	useEffect(() => {
		const viewer = new DropInViewer({
			sharedMemoryForWorkers: true,
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
				console.log("Splat Scene loaded", sceneData.filePath);
				console.log("Splat count: ", viewer.splatMesh.getSplatCount());
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

	return <group ref={ref}>{viewer && <primitive object={viewer} />}</group>;
});

export default SceneViewer;
