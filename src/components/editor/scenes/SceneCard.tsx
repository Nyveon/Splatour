import EditRotation from "@/components/editor/scenes/properties/EditRotation";
import EditScale from "@/components/editor/scenes/properties/EditScale";
import EditTranslation from "@/components/editor/scenes/properties/EditTranslation";
import SceneName from "@/components/editor/scenes/properties/SceneName";
import SceneDelete from "@/components/editor/scenes/SceneDelete";
import SceneReset from "@/components/editor/scenes/SceneReset";
import Icon from "@/components/Icon";
import Button from "@/components/input/Button";
import { useGSStore } from "@/hooks/useGSStore";
import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import ChildList from "./ChildList";

const BaseSceneCard = styled.div`
	border: thin solid ${color.border};
	padding: 10px;
`;

const ClosedSceneCard = styled(BaseSceneCard)`
	width: 100%;

	border: thin solid ${color.borderHalf};

	&:hover {
		cursor: pointer;
		background-color: ${color.backgroundMedium};
	}
`;

const SceneDetails = styled.ul`
	display: flex;
	flex-direction: column;
`;

const SceneItem = styled.li`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	width: 100%;
	padding-block: 0.5rem;
	border-bottom: thin solid ${color.borderHalf};

	svg {
		width: 1rem;
		height: 1rem;
	}

	&:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}
`;

const ButtonBar = styled(SceneItem)`
	justify-content: space-around;
	align-items: space-around;
`;

const Uneditable = styled.span`
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
	const sceneName = useGSStore((state) => state.gsmap.scenes[sceneId].name);
	const sceneFile = useGSStore((state) => state.gsmap.scenes[sceneId].filePath);

	if (selected) {
		return (
			<BaseSceneCard>
				<SceneDetails>
					<SceneItem>
						<SceneName sceneId={sceneId} />
					</SceneItem>
					<ButtonBar>
						<SceneDelete sceneId={sceneId} />
						<SceneReset sceneId={sceneId} />
						<Button
							title="Teleport to center"
							icon="target"
							variant="disabled"
						/>
						<Button title="Toggle visibility" icon="eye" variant="disabled" />
						<Button
							title="Minimize scene details"
							icon="minimize-2"
							variant="primary"
							onClick={() => handleSelected(null)}
						/>
					</ButtonBar>
					<SceneItem>
						<Icon icon="file" />
						<Uneditable>{sceneFile}</Uneditable>
					</SceneItem>
					<SceneItem>
						<EditTranslation sceneId={sceneId} />
					</SceneItem>
					<SceneItem>
						<EditScale sceneId={sceneId} />
					</SceneItem>
					<SceneItem>
						<EditRotation sceneId={sceneId} />
					</SceneItem>
					<SceneItem>
						<ChildList sceneId={sceneId} />
					</SceneItem>
				</SceneDetails>
			</BaseSceneCard>
		);
	} else {
		return (
			<ClosedSceneCard onClick={() => handleSelected(sceneId)}>
				{sceneName}
			</ClosedSceneCard>
		);
	}
}
