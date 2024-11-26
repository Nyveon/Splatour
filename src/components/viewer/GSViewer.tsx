import { useGSStore } from "@/hooks/useGSStore";
import { GSScene, gssUpdateTransforms } from "@/model/GSScene";
import { DropInViewer, SplatSceneParams } from "@mkkellogg/gaussian-splats-3d";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

export default function GSViewer() {
	const scenes: GSScene[] = useGSStore(
		useShallow((state) => Object.values(state.gsmap.scenes))
	);

	console.log("gsviewer");

	const [viewer, setViewer] = useState<DropInViewer>();

	useEffect(() => {
		const viewer = new DropInViewer({
			sharedMemoryForWorkers: true,
		});

		console.log("dropinviewer");

		const addParams: SplatSceneParams[] = scenes.map((scene: GSScene) => ({
			path: scene.filePath,
			showLoadingUI: false,
			splatAlphaRemovalThreshold: 20,
			// ...gssGetOptions(scene),
		}));

		console.log("addParams: ", addParams);

		viewer
			.addSplatScenes(addParams, true)
			.then(() => {
				gssUpdateTransforms(viewer, scenes);
			})
			.catch((err: unknown) => {
				// Needed for next js
				console.log("Error loading splat scenes:", err);
			});

		console.log("V", viewer);

		setViewer(viewer);

		return () => {
			viewer.dispose();
		};
	}, [scenes.length]); //todo change to length of key array

	useEffect(() => {
		if (!viewer) return;
		console.log("V2", viewer);
		gssUpdateTransforms(viewer, scenes);
	}, [scenes]);

	if (!viewer || !scenes.length) {
		return null;
	}

	return <primitive object={viewer} />;
}
