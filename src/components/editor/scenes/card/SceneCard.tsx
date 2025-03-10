import SceneDelete from "@/components/editor/scenes/manage/SceneDelete";
import MinimizeCard from "@/components/editor/scenes/misc/MinimizeCard";
import SceneTeleporter from "@/components/editor/scenes/misc/SceneTeleporter";
import SceneName from "@/components/editor/scenes/properties/SceneName";
import SceneReset from "@/components/editor/scenes/properties/SceneReset";
import SceneVisibility from "@/components/editor/scenes/properties/SceneVisibility";
import Icon from "@/components/Icon";
import { useGSStore } from "@/hooks/useGSStore";
import { color } from "@/utils/theme";
import { toastError, toastSuccess } from "@/utils/toasts";
import styled from "@emotion/styled";
import PanelArtifacts from "./PanelArtifacts";
import PanelBackdrop from "./PanelBackdrop";
import PanelBarriers from "./PanelBarriers";
import PanelPlacement from "./PanelPlacement";
import PanelPortals from "./PanelPortals";
import SceneIsDefault from "./SceneIsDefault";

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

const LabelID = styled(UneditableItem)`
	font-size: 0.65rem;
	font-family: monospace;
	text-align: center;

	cursor: pointer;

	&:hover {
		color: ${color.textLight};
	}
`;

export default function SceneCard({
	sceneId,
	selected,
	handleSelected,
}: {
	sceneId: string;
	selected: boolean;
	handleSelected: (sceneId: string) => void;
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
				<LabelID
					onClick={() => {
						navigator.clipboard
							.writeText(sceneId)
							.then(() => toastSuccess("Scene ID copied to clipboard"))
							.catch(() => toastError("Failed to copy scene ID to clipboard"));
					}}
					title="The scene's unique identifier"
				>
					{sceneId}
				</LabelID>

				<UneditableItem title="The scene's gaussian splat file path within the project">
					<Icon icon="file" />
					{sceneFile}
				</UneditableItem>

				<CardItem>
					<SceneIsDefault sceneId={sceneId} />
				</CardItem>

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
					<PanelPortals sceneId={sceneId} />
				</CardItem>

				<CardItem>
					<PanelBarriers sceneId={sceneId} />
				</CardItem>

				<CardItem>
					<PanelBackdrop sceneId={sceneId} />
				</CardItem>
			</Collapsible>
		</SceneCardContainer>
	);
}
