import Icon from "@/components/Icon";
import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions } from "@/hooks/useInteractions";
import { NodeIconMap, NodeType } from "@/model/GSNode";
import { color, UnstyledButton } from "@/utils/theme";
import styled from "@emotion/styled";

const Clickable = styled(UnstyledButton)`
	display: flex;
	align-items: center;

	gap: 0.5rem;
	padding-left: 0.5rem;
	padding-block: 0.2rem;
	width: 100%;

	border: 1px solid transparent;

	&[data-hover] {
		color: ${color.textLight};
		background-color: ${color.backgroundMedium};
		border: 1px solid ${color.borderHalf};
	}

	svg {
		color: ${color.textDisabled};
	}

	&[data-active="true"] {
		background-color: ${color.primary};
		border: 1px solid ${color.border};

		svg {
			color: ${color.textLight};
		}
	}
`;

export default function NodeItem({
	sceneId,
	nodeId,
	nodeType,
}: {
	sceneId: string;
	nodeId: string;
	nodeType: NodeType;
}) {
	const setCurrentNode = useInteractions((state) => state.setCurrentNode);
	const currentNodeId = useInteractions((state) => state.currentNodeId);
	const nodeName = useGSStore(
		(state) => state.gsmap.scenes[sceneId].nodes[nodeId].name
	);

	return (
		<Clickable
			onClick={() => setCurrentNode(nodeId, nodeType)}
			data-active={currentNodeId === nodeId}
		>
			<Icon icon={NodeIconMap[nodeType]} />
			{nodeName}
		</Clickable>
	);
}
