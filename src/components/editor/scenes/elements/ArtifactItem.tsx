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

	&[data-hover] {
		color: ${color.textLight};
		background-color: ${color.primaryLight};
	}

	svg {
		color: ${color.textDisabled};
	}

	&[data-active="true"] {
		background-color: ${color.primary};

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

	console.log(artifact);

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
