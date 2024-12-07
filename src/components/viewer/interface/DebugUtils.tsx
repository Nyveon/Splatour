import { useSettingsStore } from "@/hooks/useSettingsStore";
import useViewerStore from "@/hooks/useViewerContext";
import styled from "@emotion/styled";
import {
	Stats as BaseStats,
	GizmoHelper,
	GizmoViewport,
	Grid,
} from "@react-three/drei";
import { useEffect } from "react";

const Stats = styled(BaseStats)`
	position: absolute !important;
	left: unset !important;
	right: 0 !important;
`;

export default function DebugUtils() {
	const viewerContainerRef = useViewerStore(
		(state) => state.viewerContainerRef
	);
	const debug = useSettingsStore((state) => state.debug);

	useEffect(() => {
		if (viewerContainerRef?.current) {
			console.log("Viewer container is available:", viewerContainerRef.current);
		}
	}, [viewerContainerRef]);

	if (!debug) {
		return null;
	}

	return (
		<>
			<axesHelper args={[50]} />
			<Grid infiniteGrid={true} sectionColor="white" fadeStrength={10} />

			<GizmoHelper alignment="top-left" margin={[90, 70]}>
				<GizmoViewport
					axisColors={["red", "green", "blue"]}
					labelColor="black"
					disabled={true}
				/>
			</GizmoHelper>
			{viewerContainerRef && (
				<Stats parent={viewerContainerRef} showPanel={0} />
			)}
		</>
	);
}
