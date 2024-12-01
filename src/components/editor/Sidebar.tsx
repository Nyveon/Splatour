import NewScene from "@/components/editor/scenes/manage/NewScene";
import SceneCard from "@/components/editor/scenes/SceneCard";
import { useGSStore } from "@/hooks/useGSStore";
import styled from "@emotion/styled";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

const SceneListItem = styled.li`
	display: flex;
	flex-direction: column;
	align-items: center;

	gap: 1rem;
	margin: 1rem;
`;

export default function Sidebar({ className }: { className?: string }) {
	const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
	const sceneIds = useGSStore(
		useShallow((state) => Object.keys(state.gsmap.scenes))
	);

	return (
		<aside className={className}>
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
					<NewScene />
				</SceneListItem>
			</ul>
		</aside>
	);
}
