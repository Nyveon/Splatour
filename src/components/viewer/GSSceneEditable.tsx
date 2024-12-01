import { useGSStore } from "@/hooks/useGSStore";
import GSViewer from "./GS3DViewer";

export default function GSSceneEditable({ sceneId }: { sceneId: string }) {
	const scenePosition = useGSStore(
		(state) => state.gsmap.scenes[sceneId].position
	);
	const sceneRotation = useGSStore(
		(state) => state.gsmap.scenes[sceneId].rotation
	);
	const sceneScale = useGSStore((state) => state.gsmap.scenes[sceneId].scale);

	const sceneFile = useGSStore((state) => state.gsmap.scenes[sceneId].filePath);
	const sceneBuffer = useGSStore((state) => state.gsmap.scenes[sceneId].buffer);

	const sceneData = {
		filePath: sceneFile,
		buffer: sceneBuffer,
	};

	return (
		<GSViewer
			sceneData={sceneData}
			scenePosition={scenePosition}
			sceneRotation={sceneRotation}
			sceneScale={sceneScale}
		/>
	);
}
