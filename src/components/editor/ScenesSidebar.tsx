import SceneCard from "@/components/editor/scenes/card/SceneCard";
import NewScene from "@/components/editor/scenes/manage/NewScene";
import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions } from "@/hooks/useInteractions";
import { color, headerHeightREM, sidebarWidthREM } from "@/utils/theme";
import styled from "@emotion/styled";
import { useRef } from "react";
import { useShallow } from "zustand/react/shallow";

const scrollbarWidthREM = 1;

const Aside = styled.aside`
	z-index: 1;

	height: calc(100vh - ${headerHeightREM}rem);
	margin-right: calc(${-scrollbarWidthREM}rem - 1px);

	scrollbar-gutter: stable;
	scrollbar-width: ${scrollbarWidthREM}rem;
	scrollbar-color: ${color.borderHalf} ${color.backgroundDark};

	overflow-y: auto;
`;

const SceneList = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 1rem;

	width: ${sidebarWidthREM}rem;
	min-height: 100%;

	margin: 0;
	padding: 0.5rem;

	background-color: ${color.backgroundDark};
	color: ${color.textLight};
	text-align: left;
	border-right: 1px solid ${color.borderHalf};
`;

const SceneListItem = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
`;

export default function Sidebar({ className }: { className?: string }) {
	const ref = useRef(null);
	// const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
	const selectedSceneId = useInteractions((state) => state.currentSceneId);
	const setSelectedSceneId = useInteractions(
		(state) => state.setCurrentSceneId
	);
	const sceneIds = useGSStore(
		useShallow((state) => Object.keys(state.gsmap.scenes))
	);
	const resetCurrentNode = useInteractions((state) => state.resetCurrentNode);

	function handleSelectScene(sceneId: string) {
		setSelectedSceneId(sceneId);

		if (sceneId) {
			setSelectedSceneId(sceneId);
		}

		if (sceneId !== selectedSceneId) {
			resetCurrentNode();
		}
	}

	return (
		<Aside>
			<SceneList className={className} ref={ref}>
				{sceneIds.map((sceneId) => (
					<SceneListItem key={sceneId}>
						<SceneCard
							sceneId={sceneId}
							selected={selectedSceneId === sceneId}
							handleSelected={handleSelectScene}
						/>
					</SceneListItem>
				))}

				<SceneListItem>
					<NewScene />
				</SceneListItem>
			</SceneList>
		</Aside>
	);
}
