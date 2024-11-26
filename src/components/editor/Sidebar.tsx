import styled from "@emotion/styled";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGSStore } from "../../hooks/useGSStore";
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

export default function Sidebar() {
	const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
	const sceneIds = useGSStore(
		useShallow((state) => Object.keys(state.gsmap.scenes))
	);
	// const sceneIds = useGSStore((state) => Object.keys(state.gsmap.scenes));
	// const sceneIds = ["1", "2", "3"];

	console.log("sidebar");

	return (
		<ul>
			{sceneIds.map((sceneId) => (
				<s.li
					key={sceneId}
					onClick={() => {
						setSelectedSceneId((prevId) =>
							prevId === sceneId ? null : sceneId
						);
					}}
				>
					<SceneCard sceneId={sceneId} selected={selectedSceneId === sceneId} />
				</s.li>
			))}
		</ul>
	);
}
