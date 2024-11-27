import Icon from "@/components/Icon";
import DeleteScene from "@/components/editor/inputs/DeleteScene";
import EditRotation from "@/components/editor/inputs/EditRotation";
import EditScale from "@/components/editor/inputs/EditScale";
import EditTranslation from "@/components/editor/inputs/EditTranslation";
import SceneName from "@/components/editor/inputs/SceneName";
import { useGSStore } from "@/hooks/useGSStore";
import { color } from "@/utils/theme";
import styled from "@emotion/styled";

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
`;

const Uneditable = styled.span`
	color: ${color.textDisabled};
`;

export default function SceneCard({
	sceneId,
	selected,
}: {
	sceneId: string;
	selected: boolean;
}) {
	const sceneName = useGSStore((state) => state.gsmap.scenes[sceneId].name);
	const sceneFile = useGSStore((state) => state.gsmap.scenes[sceneId].filePath);

	console.log("scenecard" + sceneId);

	if (selected) {
		return (
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
					<DeleteScene sceneId={sceneId} />
				</BottomBar>
			</SceneDetails>
		);
	} else {
		return <span>{sceneName}</span>;
	}
}
