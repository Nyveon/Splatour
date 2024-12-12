import { useGSStore } from "@/hooks/useGSStore";
import { NodeType } from "@/model/GSNode";
import BarrierSolid from "./BarrierSolid";

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
		console.error("not yet implemented");
		return null;
	} else if (barrierType === NodeType.BarrierSolid) {
		return <BarrierSolid sceneId={sceneId} barrierId={barrierId} />;
	} else {
		return null;
	}
}
