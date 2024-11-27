import SceneCard from "@/components/editor/SceneCard";
import { useGSStore } from "@/hooks/useGSStore";
import styled from "@emotion/styled";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import Button from "../input/Button";

const SceneListItem = styled.li`
	display: flex;
	flex-direction: column;
	gap: 1rem;

	margin: 1rem;
`;

export default function Sidebar() {
	const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
	const sceneIds = useGSStore(
		useShallow((state) => Object.keys(state.gsmap.scenes))
	);

	console.log("sidebar");

	return (
		<>
			<ul>
				{sceneIds.map((sceneId) => (
					<SceneListItem key={sceneId}>
						<SceneCard
							sceneId={sceneId}
							selected={selectedSceneId === sceneId}
							handleSelected={setSelectedSceneId}
						/>
					</SceneListItem>
				))}

				<SceneListItem>
					<Button title="Add new scene" label="test" />
				</SceneListItem>
			</ul>
		</>
	);
}
