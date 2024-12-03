import { useGSStore } from "@/hooks/useGSStore";
import { useShallow } from "zustand/shallow";
import SceneDynamic from "./gsplats/SceneDynamic";

export default function MapDynamic() {
	const sceneIds = useGSStore(
		useShallow((state) => Object.keys(state.gsmap.scenes))
	);

	return (
		<>
			{sceneIds.map((sceneId) => {
				return <SceneDynamic key={sceneId} sceneId={sceneId} />;
			})}
		</>
	);
}
