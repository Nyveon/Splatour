import { AppIcons } from "@/utils/theme";
import NodeContainer from "../shared/NodeContainer";
import NodePanel from "../shared/NodePanel";
import ArtifactContent from "./ArtifactContent";
import ArtifactSize from "./ArtifactSize";
import ArtifactTranslation from "./ArtifactTranslation";

export default function ArtifactNode({
	nodeId,
	sceneId,
}: {
	nodeId: string;
	sceneId: string;
}) {
	return (
		<NodeContainer sceneId={sceneId} nodeId={nodeId} icon={AppIcons.Artifact}>
			<NodePanel label="Offset" icon="move">
				<ArtifactTranslation nodeId={nodeId} sceneId={sceneId} />
			</NodePanel>

			<NodePanel label="Radius" icon="maximize-2">
				<ArtifactSize nodeId={nodeId} sceneId={sceneId} />
			</NodePanel>

			<NodePanel label="Content" icon="file-text" vertical={true}>
				<ArtifactContent nodeId={nodeId} sceneId={sceneId} />
			</NodePanel>
		</NodeContainer>
	);
}
