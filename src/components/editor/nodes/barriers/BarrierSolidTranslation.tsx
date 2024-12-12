import AxisInputs from "@/components/input/AxisInputs";
import { useGSStore } from "@/hooks/useGSStore";
import { assertNodeIsSolid } from "@/model/GSNode";
import { axis } from "@/utils/constants";

export default function BarrierSolidTranslation({
	nodeId,
	sceneId,
}: {
	nodeId: string;
	sceneId: string;
}) {
	const barrierPosition = useGSStore((state) => {
		const barrier = state.gsmap.scenes[sceneId].barriers[nodeId];
		assertNodeIsSolid(barrier);
		return barrier.position;
	});
	const setNodeTransform = useGSStore((state) => state.setNodeTransform);

	const handleChange = (ax: axis, value: number) => {
		setNodeTransform(sceneId, nodeId, {
			position: { ...barrierPosition, [ax]: value },
		});
	};

	return (
		<AxisInputs
			values={barrierPosition}
			handleChange={handleChange}
			min={-Infinity}
			max={Infinity}
			step={0.1}
			exclude={["y"]}
		/>
	);
}
