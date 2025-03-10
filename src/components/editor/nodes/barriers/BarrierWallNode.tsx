import { AppIcons } from "@/utils/theme";
import NodeContainer from "../shared/NodeContainer";
import SegmentNodeTranslation from "../shared/SegmentNodeTranslation";
import NodeFloorSnap from "../shared/NodeFloorSnap";

export default function BarrierSolidNode({
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
			icon={AppIcons.BarrierWall}
		>
			<SegmentNodeTranslation nodeId={nodeId} sceneId={sceneId} />

			<NodeFloorSnap />
		</NodeContainer>
	);
}
