import Stepper from "@/components/input/Stepper";
import { useGSStore } from "@/hooks/useGSStore";

export default function ArtifactSize({
	nodeId,
	sceneId,
}: {
	nodeId: string;
	sceneId: string;
}) {
	const artifactSize = useGSStore(
		(state) => state.gsmap.scenes[sceneId].artifacts[nodeId].radius
	);
	const setArtifactTransform = useGSStore(
		(state) => state.setArtifactTransform
	);

	const handleChange = (value: number) => {
		setArtifactTransform(sceneId, nodeId, {
			radius: value,
		});
	};

	return (
		<Stepper
			value={artifactSize}
			valueHandler={handleChange}
			min={0.1}
			max={Infinity}
			step={0.1}
			label="r"
		/>
	);
}
