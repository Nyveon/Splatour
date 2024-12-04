import SceneCardSection from "@/components/editor/scenes/card/SceneCardPanel";
import SceneDelete from "@/components/editor/scenes/manage/SceneDelete";
import MinimizeCard from "@/components/editor/scenes/misc/MinimizeCard";
import SceneTeleporter from "@/components/editor/scenes/misc/SceneTeleporter";
import SceneName from "@/components/editor/scenes/properties/SceneName";
import SceneReset from "@/components/editor/scenes/properties/SceneReset";
import SceneVisibility from "@/components/editor/scenes/properties/SceneVisibility";
import Icon from "@/components/Icon";
import { useGSStore } from "@/hooks/useGSStore";
import { AppIcons, color } from "@/utils/theme";
import styled from "@emotion/styled";
import PanelArtifacts from "./PanelArtifacts";
import PanelPlacement from "./PanelPlacement";

const SceneCardContainer = styled.div`
	display: flex;
	flex-direction: column;

	width: 100%;
	padding: 0.5rem;

	border-radius: 0.5rem;
	border: thin solid ${color.borderHalf};

	&[data-open="false"] {
		&:hover {
			cursor: pointer;
			background-color: ${color.backgroundMedium};
		}
	}
`;

const Collapsible = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;

	transition: height 0.2s ease;
	overflow: hidden;

	&[data-open="false"] {
		height: 0;
	}

	&[data-open="true"] {
		height: max-content;
		border-color: ${color.border};
	}
`;

const CardItem = styled.div`
	display: flex;
	align-items: center;

	gap: 0.5rem;
	width: 100%;

	padding: 0.25rem;

	svg {
		width: 1rem;
		height: 1rem;
	}

	&:first-of-type {
		padding-bottom: 0;
	}
`;

const ButtonBarItem = styled(CardItem)`
	justify-content: space-around;
	align-items: space-around;
	padding-inline: 1rem;
`;

const UneditableItem = styled(CardItem)`
	color: ${color.textDisabled};
`;

export default function SceneCard({
	sceneId,
	selected,
	handleSelected,
}: {
	sceneId: string;
	selected: boolean;
	handleSelected: (sceneId: string | null) => void;
}) {
	const sceneFile = useGSStore((state) => state.gsmap.scenes[sceneId].filePath);

	return (
		<SceneCardContainer
			data-open={selected}
			onClick={() => {
				if (!selected) {
					handleSelected(sceneId);
				}
			}}
		>
			<CardItem>
				<SceneName sceneId={sceneId} editing={selected} />
				<MinimizeCard selected={selected} handleSelected={handleSelected} />
			</CardItem>

			<Collapsible data-open={selected}>
				<UneditableItem>
					<Icon icon="file" />
					{sceneFile}
				</UneditableItem>

				<ButtonBarItem>
					<SceneDelete sceneId={sceneId} />
					<SceneReset sceneId={sceneId} />
					<SceneTeleporter sceneId={sceneId} />
					<SceneVisibility sceneId={sceneId} />
				</ButtonBarItem>

				<CardItem>
					<PanelPlacement sceneId={sceneId} />
				</CardItem>

				<CardItem>
					<PanelArtifacts sceneId={sceneId} />
				</CardItem>

				<CardItem>
					<SceneCardSection label="Portals" icon={AppIcons.Portal}>
						Placeholder
					</SceneCardSection>
				</CardItem>

				<CardItem>
					<SceneCardSection label="Barriers" icon={AppIcons.Barrier}>
						Placeholder
					</SceneCardSection>
				</CardItem>
			</Collapsible>
		</SceneCardContainer>
	);
}
