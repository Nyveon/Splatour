import AxisInputs from "@/components/input/AxisInputs";
import { useGSStore } from "@/hooks/useGSStore";
import { axis } from "@/utils/constants";

export default function ArtifactTranslation({
	nodeId,
	sceneId,
}: {
	nodeId: string;
	sceneId: string;
}) {
	const artifactPosition = useGSStore(
		(state) => state.gsmap.scenes[sceneId].artifacts[nodeId].position
	);
	const setNodeTransform = useGSStore(
		(state) => state.setNodeTransform
	);

	const handleChange = (ax: axis, value: number) => {
		setNodeTransform(sceneId, nodeId, {
			position: { ...artifactPosition, [ax]: value },
		});
	};

	return (
		<AxisInputs
			values={artifactPosition}
			handleChange={handleChange}
			min={-Infinity}
			max={Infinity}
			step={0.1}
		/>
	);
}
