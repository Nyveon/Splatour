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

export default function PanelPortals({ sceneId }: { sceneId: string }) {
	return (
		<SceneCardPanel label="Portals" icon={AppIcons.Portal}>
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
				/>
			</CreationButtons>
		</SceneCardPanel>
	);
}
