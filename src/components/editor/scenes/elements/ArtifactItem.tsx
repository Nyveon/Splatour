import Icon from "@/components/Icon";
import { useInteractions } from "@/hooks/useInteractions";
import { GSSceneArtifact } from "@/model/GSSceneArtifact";
import { AppIcons, color, UnstyledButton } from "@/utils/theme";
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

export default function ArtifactItem({
	artifact,
}: {
	artifact: GSSceneArtifact;
}) {
	const setCurrentNode = useInteractions((state) => state.setCurrentNode);
	const currentNodeId = useInteractions((state) => state.currentNodeId);

	return (
		<Clickable
			onClick={() => setCurrentNode(artifact.id, "artifact")}
			data-active={currentNodeId === artifact.id}
		>
			<Icon icon={AppIcons.Artifact} />
			{artifact.name}
		</Clickable>
	);
}
