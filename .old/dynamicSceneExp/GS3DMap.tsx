import { useGSStore } from "@/hooks/useGSStore";
import { useShallow } from "zustand/shallow";
import GS3DScene from "./GS3DScene";

export default function GS3DMap({ loadScene, viewer }) {
	console.log("M: RE");

	const sceneIds = useGSStore(
		useShallow((state) => Object.keys(state.gsmap.scenes))
	);

	return (
		<>
			{sceneIds.map((sceneId) => {
				return (
					<GS3DScene key={sceneId} sceneId={sceneId} loadScene={loadScene} viewer={viewer} />
				);
			})}
		</>
	);
}
