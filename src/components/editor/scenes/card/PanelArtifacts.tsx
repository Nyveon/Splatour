import SceneCardPanel from "@/components/editor/scenes/card/SceneCardPanel";
import { UserState } from "@/hooks/useInteractions";
import { NodeType } from "@/model/GSNode";
import { AppIcons } from "@/utils/theme";
import NodeCreate from "../elements/NodeCreate";
import NodeList from "../elements/NodeList";

const helpInfo = `
# *icon-${AppIcons.Artifact}* Artifacts

Artifacts are interactable *:nodes* that can be placed in a scene.

## *icon-mouse-pointer* Interactions

A *:icon-${AppIcons.Artifact}* *:Hint* icon
at the artifact's position will become more opaque as the player gets closer,
until the player is within interaction range (fully opaque).
The player can trigger an *:action* associated with the artifact by *:clicking* it while
in range.

## *icon-${AppIcons.Artifact}* Type: Artifact

Sphere-shaped node, its *:action* toggles the visibility of a rendered *:Markdown Content* modal.
Useful for annotations and information in the scene.

- *icon-move* **Offset**: Set the X, Y and Z offsets relative to the scene center.
- *icon-maximize-2* **Radius**: The radius of the sphere. Directly affects the interaction range.
- *icon-file-text* **Content**: The Markdown Content to display upon interaction.
`;

export default function PanelArtifacts({ sceneId }: { sceneId: string }) {
	return (
		<SceneCardPanel
			label="Artifacts"
			icon={AppIcons.Artifact}
			helpInfo={helpInfo}
		>
			<NodeList sceneId={sceneId} type={NodeType.Artifact} />
			<NodeCreate targetState={UserState.Artifacts} label="New Artifact" />
		</SceneCardPanel>
	);
}
