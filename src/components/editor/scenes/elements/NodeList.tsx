import { useGSStore } from "@/hooks/useGSStore";
import { NodeType } from "@/model/GSNode";
import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import { useShallow } from "zustand/react/shallow";
import NodeItem from "./NodeItem";

export const List = styled.ul`
	display: flex;
	flex-direction: column;
	margin-bottom: 0.5rem;
`;

export const ListItem = styled.li`
	border-top: thin solid ${color.borderQuarter};

	&:last-child {
		border-bottom: thin solid ${color.borderQuarter};
	}
`;

export default function NodeList({
	sceneId,
	type,
}: {
	sceneId: string;
	type: NodeType;
}) {
	const nodeIds = useGSStore(
		useShallow((state) => {
			const nodes = Object.values(state.gsmap.scenes[sceneId].nodes);
			const filtered = nodes.filter((node) => node.type === type);
			const ids = filtered.map((node) => node.id);
			return ids;
		})
	);

	if (nodeIds.length === 0) {
		return null;
	}

	return (
		<List>
			{nodeIds.map((nodeId) => (
				<ListItem key={nodeId}>
					<NodeItem sceneId={sceneId} nodeId={nodeId} nodeType={type} />
				</ListItem>
			))}
		</List>
	);
}
