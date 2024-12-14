import { AppIcons } from "@/utils/theme";
import NodeContainer from "../shared/NodeContainer";
import NodeFloorSnap from "../shared/NodeFloorSnap";
import SegmentNodeTranslation from "../shared/SegmentNodeTranslation";

export default function PortalEdgeNode({
	nodeId,
	sceneId,
}: {
	nodeId: string;
	sceneId: string;
}) {
	return (
		<NodeContainer
			sceneId={sceneId}
			nodeId={nodeId}
			icon={AppIcons.PortalEdge}
		>
			<SegmentNodeTranslation nodeId={nodeId} sceneId={sceneId} />

			<NodeFloorSnap />
		</NodeContainer>
	);
}
