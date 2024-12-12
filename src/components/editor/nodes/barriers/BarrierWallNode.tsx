import { AppIcons } from "@/utils/theme";
import NodeContainer from "../NodeContainer";
import BarrierFloorSnap from "./BarrierFloorSnap";
import BarrierWallTranslation from "./BarrierWallTranslation";

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
			<BarrierWallTranslation nodeId={nodeId} sceneId={sceneId} />

			<BarrierFloorSnap />
		</NodeContainer>
	);
}
