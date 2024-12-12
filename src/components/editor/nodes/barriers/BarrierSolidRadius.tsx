import Stepper from "@/components/input/Stepper";
import { useGSStore } from "@/hooks/useGSStore";
import { assertNodeIsSolid } from "@/model/GSNode";

export default function BarrierSolidRadius({
	nodeId,
	sceneId,
}: {
	nodeId: string;
	sceneId: string;
}) {
	const barrierRadius = useGSStore((state) => {
		const barrier = state.gsmap.scenes[sceneId].barriers[nodeId];
		assertNodeIsSolid(barrier);
		return barrier.radius;
	});
	const setNodeTransform = useGSStore((state) => state.setNodeTransform);

	const handleChange = (value: number) => {
		setNodeTransform(sceneId, nodeId, {
			radius: value,
		});
	};

	return (
		<Stepper
			value={barrierRadius}
			valueHandler={handleChange}
			min={0.1}
			max={Infinity}
			step={0.1}
			label="r"
		/>
	);
}
