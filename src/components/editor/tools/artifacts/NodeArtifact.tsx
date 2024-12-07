import Icon from "@/components/Icon";
import TextInput from "@/components/input/TextInput";
import { useGSStore } from "@/hooks/useGSStore";
import { AppIcons, color } from "@/utils/theme";
import styled from "@emotion/styled";
import ArtifactTranslation from "./ArtifactTranslation";

const NodeContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
`;

const NodeLabel = styled.div`
	display: flex;
	gap: 0.5rem;
	font-size: 1.2rem;
	line-height: 1.2rem;

	svg {
		width: 1.2rem;
		height: 1.2rem;
	}
`;

const LabelBelongsTo = styled.div`
	color: ${color.textDisabled};
	font-style: italic;
`;

const NodePanel = styled.div`
	display: flex;
	flex-direction: column;

	gap: 0.5rem;
	border-top: 1px solid ${color.border};
	padding-top: 0.5rem;
`;

export default function NodeArtifact({
	nodeId,
	sceneId,
}: {
	nodeId: string;
	sceneId: string;
}) {
	const artifact = useGSStore(
		(state) => state.gsmap.scenes[sceneId].artifacts[nodeId]
	);
	const sceneName = useGSStore((state) => state.gsmap.scenes[sceneId].name);
	const setArtifactTransform = useGSStore(
		(state) => state.setArtifactTransform
	);

	return (
		<NodeContainer>
			<NodeLabel>
				<Icon icon={AppIcons.Artifact} />
				<TextInput
					value={artifact.name}
					valueHandler={(value: string) =>
						setArtifactTransform(sceneId, nodeId, { name: value })
					}
				/>
			</NodeLabel>
			<LabelBelongsTo>Belongs to: {sceneName}</LabelBelongsTo>

			<NodePanel>
				<ArtifactTranslation nodeId={nodeId} sceneId={sceneId} />
			</NodePanel>
		</NodeContainer>
	);
}
