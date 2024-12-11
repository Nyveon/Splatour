import { useInteractions } from "@/hooks/useInteractions";
import { NodeType } from "@/model/GSNode";
import { color, sidebarWidthREM } from "@/utils/theme";
import styled from "@emotion/styled";
import ArtifactNode from "./nodes/artifacts/ArtifactNode";

const Aside = styled.aside`
	position: absolute;
	top: 0;
	right: 0;
	z-index: 3;

	width: ${sidebarWidthREM}rem;
	padding: 1rem;

	border-bottom-left-radius: 1rem;

	color: ${color.textLight};
	background-color: ${color.backgroundDark};

	border-style: solid;
	border-color: ${color.borderHalf};
	border-width: 1px;
	border-top: none;
	border-right: none;
`;

export default function NodesSidebar() {
	const currentSceneId = useInteractions((state) => state.currentSceneId);
	const currentNodeId = useInteractions((state) => state.currentNodeId);
	const currentNodeType = useInteractions((state) => state.currentNodeType);

	if (!currentNodeId) {
		return null;
	}

	return (
		<Aside>
			{currentNodeType === NodeType.Artifact && (
				<ArtifactNode nodeId={currentNodeId} sceneId={currentSceneId} />
			)}
		</Aside>
	);
}
