import styled from "@emotion/styled";
import ArtifactPlacer from "../editor/nodes/artifacts/ArtifactPlacer";
import BarrierSolidPlacer from "../editor/nodes/barriers/BarrierSolidPlacer";
import BarrierWallPlacer from "../editor/nodes/barriers/BarrierWallPlacer";
import PortalPlacer from "../editor/nodes/portals/PortalEdgePlacer";
import GSMapEditable from "./MapDynamic";
import Viewer from "./Viewer";
import DebugUtils from "./interface/DebugUtils";
import Hotkeys from "./interface/Hotkeys";

const Preview = styled.section`
	position: relative;
	flex-grow: 1;
	flex-shrink: 1;
	overflow: hidden;
`;

export default function EditorView() {
	return (
		<Preview>
			<Viewer>
				<Hotkeys />
				<DebugUtils />

				<GSMapEditable />

				<ArtifactPlacer />
				<BarrierSolidPlacer />
				<BarrierWallPlacer />
				<PortalPlacer />
			</Viewer>
		</Preview>
	);
}
