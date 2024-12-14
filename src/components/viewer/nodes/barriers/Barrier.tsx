import { useGSStore } from "@/hooks/useGSStore";
import { NodeType } from "@/model/GSNode";
import BarrierSolid from "./BarrierSolid";
import BarrierWall from "./BarrierWall";

export default function Barrier({
	sceneId,
	barrierId,
}: {
	sceneId: string;
	barrierId: string;
}) {
	const barrierType = useGSStore(
		(state) => state.gsmap.scenes[sceneId].barriers[barrierId].type
	);

	if (barrierType === NodeType.BarrierWall) {
		return <BarrierWall sceneId={sceneId} barrierId={barrierId} />;
	} else if (barrierType === NodeType.BarrierSolid) {
		return <BarrierSolid sceneId={sceneId} barrierId={barrierId} />;
	} else {
		return null;
	}
}
