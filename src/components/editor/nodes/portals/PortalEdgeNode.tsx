import { AppIcons } from "@/utils/theme";
import NodeContainer from "../shared/NodeContainer";
import NodeFloorSnap from "../shared/NodeFloorSnap";
import SegmentNodeTranslation from "../shared/SegmentNodeTranslation";
import PortalSceneDestination from "./PortalSceneDestination";

export default function PortalEdgeNode({
	nodeId,
	sceneId,
}: {
	nodeId: string;
	sceneId: string;
}) {
	return (
		<NodeContainer sceneId={sceneId} nodeId={nodeId} icon={AppIcons.PortalEdge}>
			<PortalSceneDestination leavingFrom={sceneId} portalId={nodeId} />

			<SegmentNodeTranslation nodeId={nodeId} sceneId={sceneId} />

			<NodeFloorSnap />
		</NodeContainer>
	);
}
