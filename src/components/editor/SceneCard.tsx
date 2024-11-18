import styled from "@emotion/styled";
import GSScene from "../../splats/GSScene";
import { color } from "../../utils/theme";
import Icon from "../Icon";

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
		border-bottom: thin solid ${color.border};

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
	scene,
	selected,
}: {
	scene: GSScene;
	selected: boolean;
}) {
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
			</s.SceneDetails>
		);
	} else {
		return <span>{scene.name}</span>;
	}
}
