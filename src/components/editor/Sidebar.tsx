import SceneCard from "@/components/editor/SceneCard";
import { useGSStore } from "@/hooks/useGSStore";
import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

const SceneListItem = styled.li`
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
`;

export default function Sidebar() {
	const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
	const sceneIds = useGSStore(
		useShallow((state) => Object.keys(state.gsmap.scenes))
	);

	console.log("sidebar");

	return (
		<ul>
			{sceneIds.map((sceneId) => (
				<SceneListItem
					key={sceneId}
					onClick={() => {
						setSelectedSceneId((prevId) =>
							prevId === sceneId ? null : sceneId
						);
					}}
				>
					<SceneCard sceneId={sceneId} selected={selectedSceneId === sceneId} />
				</SceneListItem>
			))}
		</ul>
	);
}
