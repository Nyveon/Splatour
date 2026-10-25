import { useFloorAlignment } from "@/hooks/useFloorAlignment";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import styled from "@emotion/styled";
import ArtifactPlacer from "../editor/nodes/artifacts/ArtifactPlacer";
import BarrierSolidPlacer from "../editor/nodes/barriers/BarrierSolidPlacer";
import BarrierWallPlacer from "../editor/nodes/barriers/BarrierWallPlacer";
import PortalPlacer from "../editor/nodes/portals/PortalEdgePlacer";
import FloorAlignmentPicker from "../editor/scenes/elements/FloorAlignmentPicker";
import CompositeViewer from "./gsplats/CompositeViewer";
import DebugUtils from "./interface/DebugUtils";
import Hotkeys from "./interface/Hotkeys";
import MapDynamic from "./MapDynamic";
import Viewer from "./Viewer";

const Preview = styled.section`
	position: relative;
	flex-grow: 1;
	flex-shrink: 1;
	overflow: hidden;
`;

export default function EditorView() {
	const isComposite = useSettingsStore((state) => state.compositeViewer);
	const alignmentScene = useFloorAlignment((state) => state.sceneId);
	const pointCount = useFloorAlignment((state) => state.points.length);
	const alignmentMode = useFloorAlignment((state) => state.mode);
	const alignmentStatus = useFloorAlignment((state) => state.status);

	return (
		<Preview>
			<Viewer preventPointerLock={!!alignmentScene}>
				<FloorAlignmentPicker />
				<Hotkeys />
				<DebugUtils />

				{isComposite ? <CompositeViewer /> : <MapDynamic />}

				<ArtifactPlacer />
				<BarrierSolidPlacer />
				<BarrierWallPlacer />
				<PortalPlacer />
			</Viewer>
			{alignmentScene && (
				<div
					role="status"
					style={{
						position: "absolute",
						top: "1rem",
						left: "50%",
						transform: "translateX(-50%)",
						padding: ".6rem 1rem",
						borderRadius: ".5rem",
						background: "#20252eee",
						color: "white",
						pointerEvents: "none",
						zIndex: 1001,
					}}
				>
					Floor alignment:{" "}
					{alignmentMode === "automatic"
						? alignmentStatus === "detecting"
							? "detecting floor…"
							: "Review the result in the Floor alignment panel."
						: `${pointCount}/3 points.`}{" "}
					{alignmentMode === "manual" &&
						(pointCount < 3
							? "Click the floor."
							: "Review and apply in the Floor alignment panel.")}{" "}
					Esc cancels.
				</div>
			)}
		</Preview>
	);
}
