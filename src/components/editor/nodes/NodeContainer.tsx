import Icon from "@/components/Icon";
import TextInput from "@/components/input/TextInput";
import { useGSStore } from "@/hooks/useGSStore";
import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import { FeatherIconNames } from "feather-icons";
import type { ReactNode } from "react";
import NodeUtils from "./NodeUtils";

const Container = styled.div`
	display: flex;
	flex-direction: column;
`;

const Label = styled.div`
	display: flex;
	gap: 0.5rem;
	font-size: 1.2rem;
	line-height: 1.2rem;

	svg {
		width: 1.2rem;
		height: 1.2rem;
	}
`;

const BelongsTo = styled.div`
	display: flex;
	justify-content: space-around;

	color: ${color.textDisabled};
	font-style: italic;
	padding-block: 0.5rem;
`;

export default function NodeContainer({
	children,
	sceneId,
	nodeId,
	icon,
}: {
	children: ReactNode;
	sceneId: string;
	nodeId: string;
	icon: FeatherIconNames;
}) {
	const nodeName = useGSStore(
		(state) => state.gsmap.scenes[sceneId].nodes[nodeId].name
	);
	const sceneName = useGSStore((state) => state.gsmap.scenes[sceneId].name);
	const setNodeTransform = useGSStore((state) => state.setNodeTransform);

	return (
		<Container>
			<Label>
				<Icon icon={icon} />
				<TextInput
					value={nodeName}
					valueHandler={(value: string) =>
						setNodeTransform(sceneId, nodeId, { name: value })
					}
				/>
			</Label>

			<BelongsTo>Belongs to: {sceneName}</BelongsTo>

			<NodeUtils sceneId={sceneId} nodeId={nodeId} />

			{children}
		</Container>
	);
}
