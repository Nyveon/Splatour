import { AppIcons } from "@/utils/theme";
import NodeContainer from "../shared/NodeContainer";
import NodeFloorSnap from "../shared/NodeFloorSnap";
import NodePanel from "../shared/NodePanel";
import BarrierSolidRadius from "./BarrierSolidRadius";
import BarrierSolidTranslation from "./BarrierSolidTranslation";

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
			icon={AppIcons.BarrierSolid}
		>
			<NodePanel label="Offset" icon="move">
				<BarrierSolidTranslation nodeId={nodeId} sceneId={sceneId} />
			</NodePanel>

			<NodePanel label="Radius" icon="maximize-2">
				<BarrierSolidRadius nodeId={nodeId} sceneId={sceneId} />
			</NodePanel>

			<NodeFloorSnap />
		</NodeContainer>
	);
}
