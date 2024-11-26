import styled from "@emotion/styled";
import Icon from "../../components/Icon";
import PositionEditor from "../../components/editor/inputs/EditTranslation";
import { useGSStore } from "../../hooks/useGSStore";
import { color } from "../../utils/theme";

const s = {
	SceneDetails: styled.ul`
		display: flex;
		flex-direction: column;
	`,

	Item: styled.li`
		display: flex;
		gap: 0.5rem;
		width: 100%;
		padding-block: 0.5rem;
		/* border-bottom: thin solid ${color.border}; */

		svg {
			width: 1rem;
			height: 1rem;
		}
	`,

	Uneditable: styled.span`
		color: ${color.textDisabled};
	`,
};

export default function SceneCard({
	sceneId,
	selected,
}: {
	sceneId: string;
	selected: boolean;
}) {
	// const scene = useGSStore((state) =>
	// 	state.gsmap.scenes.find((scene) => scene.id === sceneId)
	// );
	const scene = useGSStore((state) => state.gsmap.scenes[sceneId]);

	console.log("scenecard" + sceneId);

	if (!scene) {
		return null;
	}

	if (selected) {
		return (
			<s.SceneDetails>
				<s.Item>
					<span>{scene.name}</span>
					{/* todo: make this editable */}
				</s.Item>
				<s.Item>
					<Icon icon="file" />
					<s.Uneditable>{scene.filePath}</s.Uneditable>
				</s.Item>
				<s.Item>
					<PositionEditor scene={scene} />
				</s.Item>
				<s.Item>Scale</s.Item>
				<s.Item>Scale</s.Item>
			</s.SceneDetails>
		);
	} else {
		return <span>{scene.name}</span>;
	}
}
