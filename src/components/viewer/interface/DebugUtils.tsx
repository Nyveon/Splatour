import Checkerboard from "@/components/viewer/world/Checkerboard";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import styled from "@emotion/styled";
import { GizmoHelper, GizmoViewport, Stats } from "@react-three/drei";

const s = {
	Stats: styled(Stats)`
		position: absolute !important;
	`,
};

export default function DebugUtils({
	viewerContainerRef,
}: {
	viewerContainerRef: React.RefObject<HTMLElement>;
}) {
	const debug = useSettingsStore((state) => state.debug);

	if (!debug) {
		return null;
	}

	return (
		<>
			<axesHelper args={[50]} />
			<Checkerboard />
			<GizmoHelper alignment="top-right" margin={[80, 80]}>
				<GizmoViewport
					axisColors={["red", "green", "blue"]}
					labelColor="black"
					disabled={true}
				/>
			</GizmoHelper>
			<s.Stats parent={viewerContainerRef} showPanel={0} />
		</>
	);
}
