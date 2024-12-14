import AxisInputs from "@/components/input/AxisInputs";
import { useGSStore } from "@/hooks/useGSStore";
import { assertNodeIsSegment } from "@/model/GSNode";
import { axis } from "@/utils/constants";
import NodePanel from "./NodePanel";

export default function BarrierWallTranslation({
	nodeId,
	sceneId,
}: {
	nodeId: string;
	sceneId: string;
}) {
	const startPosition = useGSStore((state) => {
		const node = state.gsmap.scenes[sceneId].nodes[nodeId];
		assertNodeIsSegment(node);
		return node.startPosition;
	});
	const endPosition = useGSStore((state) => {
		const node = state.gsmap.scenes[sceneId].nodes[nodeId];
		assertNodeIsSegment(node);
		return node.endPosition;
	});
	const setNodeTransform = useGSStore((state) => state.setNodeTransform);

	const handleChangeStart = (ax: axis, value: number) => {
		setNodeTransform(sceneId, nodeId, {
			startPosition: { ...startPosition, [ax]: value },
		});
	};

	const handleChangeEnd = (ax: axis, value: number) => {
		setNodeTransform(sceneId, nodeId, {
			endPosition: { ...endPosition, [ax]: value },
		});
	};

	return (
		<>
			<NodePanel label="Start" icon="move">
				<AxisInputs
					values={startPosition}
					handleChange={handleChangeStart}
					min={-Infinity}
					max={Infinity}
					step={0.1}
					exclude={["y"]}
				/>
			</NodePanel>

			<NodePanel label="End" icon="move">
				<AxisInputs
					values={endPosition}
					handleChange={handleChangeEnd}
					min={-Infinity}
					max={Infinity}
					step={0.1}
					exclude={["y"]}
				/>
			</NodePanel>
		</>
	);
}
