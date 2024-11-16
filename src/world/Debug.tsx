import styled from "@emotion/styled";
import { GizmoHelper, GizmoViewport, Stats } from "@react-three/drei";
import Checkerboard from "../world/Checkerboard";

const s = {
	Stats: styled(Stats)`
		position: absolute !important;
	`,
};

export default function Debug({
	viewerContainerRef,
}: {
	viewerContainerRef: React.RefObject<HTMLElement>;
}) {
	return (
		<>
			<axesHelper args={[50]} />
			<Checkerboard />
			<GizmoHelper alignment="top-right" margin={[80, 80]}>
				<GizmoViewport
					axisColors={["red", "green", "blue"]}
					labelColor="black"
				/>
			</GizmoHelper>
			<s.Stats parent={viewerContainerRef} showPanel={0} />
		</>
	);
}
