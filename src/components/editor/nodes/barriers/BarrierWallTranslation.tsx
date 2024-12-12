import AxisInputs from "@/components/input/AxisInputs";
import { useGSStore } from "@/hooks/useGSStore";
import { assertNodeIsWall } from "@/model/GSNode";
import { axis } from "@/utils/constants";
import NodePanel from "../NodePanel";

export default function BarrierWallTranslation({
	nodeId,
	sceneId,
}: {
	nodeId: string;
	sceneId: string;
}) {
	const barrierStartPosition = useGSStore((state) => {
		const barrier = state.gsmap.scenes[sceneId].barriers[nodeId];
		assertNodeIsWall(barrier);
		return barrier.startPosition;
	});
	const barrierEndPosition = useGSStore((state) => {
		const barrier = state.gsmap.scenes[sceneId].barriers[nodeId];
		assertNodeIsWall(barrier);
		return barrier.endPosition;
	});
	const setNodeTransform = useGSStore((state) => state.setNodeTransform);

	const handleChangeStart = (ax: axis, value: number) => {
		setNodeTransform(sceneId, nodeId, {
			startPosition: { ...barrierStartPosition, [ax]: value },
		});
	};

	const handleChangeEnd = (ax: axis, value: number) => {
		setNodeTransform(sceneId, nodeId, {
			endPosition: { ...barrierEndPosition, [ax]: value },
		});
	};

	return (
		<>
			<NodePanel label="Start" icon="move">
				<AxisInputs
					values={barrierStartPosition}
					handleChange={handleChangeStart}
					min={-Infinity}
					max={Infinity}
					step={0.1}
					exclude={["y"]}
				/>
			</NodePanel>

			<NodePanel label="End" icon="move">
				<AxisInputs
					values={barrierEndPosition}
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
