import { useGSStore } from "@/hooks/useGSStore";
import { NodeType } from "@/model/GSNode";
import PortalEdge from "./PortalEdge";

export default function Portal({
	sceneId,
	portalId,
}: {
	sceneId: string;
	portalId: string;
}) {
	const portalType = useGSStore(
		(state) => state.gsmap.scenes[sceneId].portals[portalId].type
	);

	if (portalType === NodeType.PortalEdge) {
		return <PortalEdge sceneId={sceneId} portalId={portalId} />;
	} else if (portalType === NodeType.PortalWarp) {
		return null;
		// return <PortalWarp sceneId={sceneId} portalId={portalId} />;
	} else {
		return null;
	}
}
