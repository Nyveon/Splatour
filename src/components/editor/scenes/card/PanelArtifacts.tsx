import SceneCardPanel from "@/components/editor/scenes/card/SceneCardPanel";
import { useGSStore } from "@/hooks/useGSStore";
import { AppIcons, color } from "@/utils/theme";
import styled from "@emotion/styled";
import ArtifactCreate from "../elements/ArtifactCreate";
import ArtifactItem from "../elements/ArtifactItem";

const ArtifactList = styled.ul`
	display: flex;
	flex-direction: column;
	margin-bottom: 0.5rem;
`;

const ArtifactListItem = styled.li`
	border-top: thin solid ${color.borderQuarter};

	&:last-child {
		border-bottom: thin solid ${color.borderQuarter};
	}
`;

export default function PanelArtifacts({ sceneId }: { sceneId: string }) {
	const artifacts = useGSStore(
		(state) => state.gsmap.scenes[sceneId].artifacts
	);

	return (
		<SceneCardPanel label="Artifacts" icon={AppIcons.Artifact}>
			<ArtifactList>
				{Object.entries(artifacts).map(([artifactId, artifact]) => (
					<ArtifactListItem key={artifactId}>
						<ArtifactItem artifact={artifact} />
					</ArtifactListItem>
				))}
			</ArtifactList>
			<ArtifactCreate />
		</SceneCardPanel>
	);
}
