import Icon from "@/components/Icon";
import TextInput from "@/components/input/TextInput";
import { useGSStore } from "@/hooks/useGSStore";
import { AppIcons, color } from "@/utils/theme";
import styled from "@emotion/styled";
import NodePanel from "../NodePanel";
import NodeUtils from "../NodeUtils";
import ArtifactContent from "./ArtifactContent";
import ArtifactSize from "./ArtifactSize";
import ArtifactTranslation from "./ArtifactTranslation";

const NodeContainer = styled.div`
	display: flex;
	flex-direction: column;
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
	display: flex;
	justify-content: space-around;

	color: ${color.textDisabled};
	font-style: italic;
	padding-block: 0.5rem;
`;

export default function ArtifactNode({
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
	const setNodeTransform = useGSStore((state) => state.setNodeTransform);
	const setDeleteNode = useGSStore((state) => state.setDeleteNode);

	if (!artifact) {
		return null;
	}

	return (
		<NodeContainer>
			<NodeLabel>
				<Icon icon={AppIcons.Artifact} />
				<TextInput
					value={artifact.name}
					valueHandler={(value: string) =>
						setNodeTransform(sceneId, nodeId, { name: value })
					}
				/>
			</NodeLabel>

			<LabelBelongsTo>Belongs to: {sceneName}</LabelBelongsTo>

			{/* todo: setDeleteNode can probably me moved into nodeutil */}
			<NodeUtils handleDeletion={() => setDeleteNode(sceneId, nodeId)} />

			<NodePanel label="Offset" icon="move">
				<ArtifactTranslation nodeId={nodeId} sceneId={sceneId} />
			</NodePanel>

			<NodePanel label="Size" icon="maximize-2">
				<ArtifactSize nodeId={nodeId} sceneId={sceneId} />
			</NodePanel>

			<NodePanel label="Content" icon="file-text" vertical={true}>
				<ArtifactContent nodeId={nodeId} sceneId={sceneId} />
			</NodePanel>
		</NodeContainer>
	);
}
