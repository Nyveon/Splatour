import { useSettingsStore } from "@/hooks/useSettingsStore";
import styled from "@emotion/styled";
import ArtifactPlacer from "../editor/nodes/artifacts/ArtifactPlacer";
import BarrierSolidPlacer from "../editor/nodes/barriers/BarrierSolidPlacer";
import BarrierWallPlacer from "../editor/nodes/barriers/BarrierWallPlacer";
import PortalPlacer from "../editor/nodes/portals/PortalEdgePlacer";
import MapDynamic from "./MapDynamic";
import Viewer from "./Viewer";
import CompositeViewer from "./gsplats/CompositeViewer";
import DebugUtils from "./interface/DebugUtils";
import Hotkeys from "./interface/Hotkeys";

const Preview = styled.section`
	position: relative;
	flex-grow: 1;
	flex-shrink: 1;
	overflow: hidden;
`;

export default function EditorView() {
	const isComposite = useSettingsStore((state) => state.compositeViewer);

	return (
		<Preview>
			<Viewer>
				<Hotkeys />
				<DebugUtils />

				{isComposite ? <CompositeViewer /> : <MapDynamic />}

				<ArtifactPlacer />
				<BarrierSolidPlacer />
				<BarrierWallPlacer />
				<PortalPlacer />
			</Viewer>
		</Preview>
	);
}
