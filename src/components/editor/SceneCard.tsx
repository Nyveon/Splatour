import Icon from "@/components/Icon";
import EditRotation from "@/components/editor/inputs/EditRotation";
import EditScale from "@/components/editor/inputs/EditScale";
import EditTranslation from "@/components/editor/inputs/EditTranslation";
import SceneDelete from "@/components/editor/inputs/SceneDelete";
import SceneName from "@/components/editor/inputs/SceneName";
import { useGSStore } from "@/hooks/useGSStore";
import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import Button from "../input/Button";
import SceneReset from "./inputs/SceneReset";

const BaseSceneCard = styled.div`
	border: thin solid ${color.border};
	padding: 10px;
`;

const ClosedSceneCard = styled(BaseSceneCard)`
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
	gap: 0.5rem;
	width: 100%;
	padding-block: 0.5rem;
	border-bottom: thin solid ${color.borderHalf};

	svg {
		width: 1rem;
		height: 1rem;
	}
`;

const BottomBar = styled(SceneItem)`
	border-bottom: none;
	justify-content: space-around;
	padding-bottom: 0;
	padding-inline: 2rem;
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

	console.log("scenecard" + sceneId);

	if (selected) {
		return (
			<BaseSceneCard>
				<SceneDetails>
					<SceneItem>
						<SceneName sceneId={sceneId} />
					</SceneItem>
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
					<BottomBar>
						<SceneDelete sceneId={sceneId} />
						<SceneReset sceneId={sceneId} />
						<Button
							title="Minimize scene details"
							icon="minimize-2"
							variant="primary"
							onClick={() => handleSelected(null)}
						/>
					</BottomBar>
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
