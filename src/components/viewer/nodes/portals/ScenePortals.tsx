import { useGSStore } from "@/hooks/useGSStore";
import { useShallow } from "zustand/react/shallow";
import Portal from "./Portal";

export default function ScenePortals({ sceneId }: { sceneId: string }) {
	const portalIds = useGSStore(
		useShallow((state) => Object.keys(state.gsmap.scenes[sceneId].portals))
	);

	if (!portalIds) {
		return null;
	}

	return (
		<>
			{portalIds.map((portalId) => {
				return <Portal key={portalId} sceneId={sceneId} portalId={portalId} />;
			})}
		</>
	);
}
