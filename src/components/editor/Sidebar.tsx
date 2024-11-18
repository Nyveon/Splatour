import styled from "@emotion/styled";
import { useState } from "react";
import GSMap from "../../splats/GSMap";
import GSScene from "../../splats/GSScene";
import { color } from "../../utils/theme";
import SceneCard from "./SceneCard";

const s = {
	li: styled.li`
		display: flex;
		flex-direction: column;
		gap: 1rem;

		margin: 1rem;
		padding: 10px;

		border: thin solid ${color.border};

		&:hover {
			cursor: pointer;
			background-color: ${color.backgroundMedium};
		}
	`,
};

export default function Sidebar({ gsmap }: { gsmap: GSMap }) {
	const [selectedScene, setSelectedScene] = useState<GSScene | null>(null);

	return (
		<ul>
			{gsmap.scenes.map((scene) => (
				<s.li
					key={scene.id}
					onClick={() => {
						setSelectedScene(scene);
						console.log(selectedScene);
					}}
				>
					<SceneCard scene={scene} selected={selectedScene == scene} />
				</s.li>
			))}
		</ul>
	);
}
