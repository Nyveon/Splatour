import SceneCardPanel from "@/components/editor/scenes/card/SceneCardPanel";
import { NodeType } from "@/model/GSNode";
import { AppIcons } from "@/utils/theme";
import ArtifactCreate from "../elements/ArtifactCreate";
import NodeList from "../elements/NodeList";

export default function PanelArtifacts({ sceneId }: { sceneId: string }) {
	return (
		<SceneCardPanel label="Artifacts" icon={AppIcons.Artifact}>
			<NodeList sceneId={sceneId} type={NodeType.Artifact} />
			<ArtifactCreate />
		</SceneCardPanel>
	);
}
