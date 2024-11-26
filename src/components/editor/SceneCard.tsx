import Icon from "@/components/Icon";
import EditScale from "@/components/editor/inputs/EditScale";
import EditTranslation from "@/components/editor/inputs/EditTranslation";
import { useGSStore } from "@/hooks/useGSStore";
import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import EditRotation from "./inputs/EditRotation";

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
	const scene = useGSStore((state) => state.gsmap.scenes[sceneId]);

	console.log("scenecard" + sceneId);

	if (!scene) {
		return null;
	}

	if (selected) {
		return (
			<SceneDetails>
				<SceneItem>
					<span>{scene.name}</span>
					{/* todo: make this editable */}
				</SceneItem>
				<SceneItem>
					<Icon icon="file" />
					<Uneditable>{scene.filePath}</Uneditable>
				</SceneItem>
				<SceneItem>
					<EditTranslation scene={scene} />
				</SceneItem>
				<SceneItem>
					<EditScale scene={scene} />
				</SceneItem>
				<SceneItem>
					<EditRotation scene={scene} />
				</SceneItem>
			</SceneDetails>
		);
	} else {
		return <span>{scene.name}</span>;
	}
}
