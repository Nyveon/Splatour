import Icon from "@/components/Icon";
import AxisInputs from "@/components/input/AxisInputs";
import { useGSStore } from "@/hooks/useGSStore";
import { axis } from "@/utils/constants";
import styled from "@emotion/styled";

const Label = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;

	svg {
		width: 1rem;
		height: 1rem;
	}
`;

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
	const setArtifactTransform = useGSStore(
		(state) => state.setArtifactTransform
	);

	const handleChange = (ax: axis, value: number) => {
		setArtifactTransform(sceneId, nodeId, {
			position: { ...artifactPosition, [ax]: value },
		});
	};

	return (
		<>
			<Label>
				<Icon icon="move" />
				Relative Position
			</Label>
			<AxisInputs
				values={artifactPosition}
				handleChange={handleChange}
				min={-Infinity}
				max={Infinity}
				step={0.1}
			/>
		</>
	);
}
