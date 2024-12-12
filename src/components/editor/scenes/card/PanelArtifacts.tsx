import SceneCardPanel from "@/components/editor/scenes/card/SceneCardPanel";
import { UserState } from "@/hooks/useInteractions";
import { NodeType } from "@/model/GSNode";
import { AppIcons } from "@/utils/theme";
import NodeCreate from "../elements/NodeCreate";
import NodeList from "../elements/NodeList";

export default function PanelArtifacts({ sceneId }: { sceneId: string }) {
	return (
		<SceneCardPanel label="Artifacts" icon={AppIcons.Artifact}>
			<NodeList sceneId={sceneId} type={NodeType.Artifact} />
			<NodeCreate targetState={UserState.Artifacts} label="New Artifact" />
		</SceneCardPanel>
	);
}
