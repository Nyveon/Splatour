import { UserState } from "@/hooks/useInteractions";
import { NodeType } from "@/model/GSNode";
import { AppIcons } from "@/utils/theme";
import styled from "@emotion/styled";
import NodeCreate from "../elements/NodeCreate";
import NodeList from "../elements/NodeList";
import SceneCardPanel from "./SceneCardPanel";

const CreationButtons = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
`;

const helpOffset =
	"*icon-move* **Offset**: Set the X and Z offsets relative to the scene center";

const helpInfo = `
# *icon-${AppIcons.Barrier}* Barriers

Barriers are solid invisible *:nodes* that the player can collide with.
You can enable *:Noclip* in the *:icon-move* *:Movement* toolbar to ignore collisions.

## *icon-${AppIcons.BarrierWall}* Type: Wall

Walls are flat, thin barriers defined by a start and end position, useful for
setting boundaries in a scene.

- *icon-plus-square* **Creation**: *:Left click* to set the start position,
  move the mouse to the end position and *:left click* again to place the wall or *:right click* to cancel.
- ${helpOffset} for each point.

## *icon-${AppIcons.BarrierSolid}* Type: Solid

Solids are cyllindrical barriers, useful for preventing players from walking through objects in the scene.

- *icon-plus-circle* **Creation**: *:Scroll* to adjust the radius and *:left click* to place the solid.
- ${helpOffset} for each point.
- *icon-maximize-2* **Radius**: The radius of the cylinder.
`;

export default function Barriers({ sceneId }: { sceneId: string }) {
	return (
		<SceneCardPanel
			label="Barriers"
			icon={AppIcons.Barrier}
			helpInfo={helpInfo}
		>
			<NodeList sceneId={sceneId} type={NodeType.BarrierSolid} />
			<NodeList sceneId={sceneId} type={NodeType.BarrierWall} />

			<CreationButtons>
				<NodeCreate
					targetState={UserState.BarrierWalls}
					label="New Wall&nbsp;"
					icon="plus-square"
				/>
				<NodeCreate targetState={UserState.BarrierSolids} label="New Solid" />
			</CreationButtons>
		</SceneCardPanel>
	);
}
