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

const helpInfo = `
# *icon-${AppIcons.Portal}* Portals

Portals are *:nodes* that allow players to switch between scenes in *:Dynamic Viewer* maps.

## *icon-${AppIcons.PortalEdge}* Type: Edge

Edges are flat, thin, invisible and seamless links between two scenes.
Upon collision, it will switch the player's current scene to the target destination.
This does **not** change the camera position.

- *icon-plus-circle* **Creation**: *:Left click* to set the start position,
  move the mouse to the end position and *:left click* again to place the wall or *:right click* to cancel.
- *icon-log-out* **Destination**: The scene to switch to.
- *icon-move* **Offset**: Set the X and Z offsets relative to the scene center

## *icon-${AppIcons.PortalWarp}* Type: Warp

*Not yet implemented*

`;

export default function PanelPortals({ sceneId }: { sceneId: string }) {
	return (
		<SceneCardPanel label="Portals" icon={AppIcons.Portal} helpInfo={helpInfo}>
			<NodeList sceneId={sceneId} type={NodeType.PortalEdge} />
			{/* <NodeList sceneId={sceneId} type={NodeType.BarrierWall} /> */}

			<CreationButtons>
				<NodeCreate
					targetState={UserState.PortalEdges}
					label="New Edge"
					icon={AppIcons.PortalEdge}
				/>
				<NodeCreate
					targetState={UserState.PortalWarps}
					label="New Warp"
					icon={AppIcons.PortalWarp}
					disabled={true}
				/>
			</CreationButtons>
		</SceneCardPanel>
	);
}
