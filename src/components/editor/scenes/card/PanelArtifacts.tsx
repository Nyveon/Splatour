import SceneCardPanel from "@/components/editor/scenes/card/SceneCardPanel";
import EditRotation from "@/components/editor/scenes/properties/EditRotation";
import EditScale from "@/components/editor/scenes/properties/EditScale";
import EditTranslation from "@/components/editor/scenes/properties/EditTranslation";
import { AppIcons } from "@/utils/theme";

export default function PanelArtifacts({ sceneId }: { sceneId: string }) {
	return (
		<SceneCardPanel label="Artifacts" icon={AppIcons.Artifact}>
			<EditTranslation sceneId={sceneId} />
			<EditScale sceneId={sceneId} />
			<EditRotation sceneId={sceneId} />
		</SceneCardPanel>
	);
}
