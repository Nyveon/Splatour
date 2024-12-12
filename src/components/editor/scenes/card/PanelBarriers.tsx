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

export default function Barriers({ sceneId }: { sceneId: string }) {
	return (
		<SceneCardPanel label="Barriers" icon={AppIcons.Barrier}>
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
