import Checkerboard from "../objects/Checkerboard";
import { GizmoHelper, GizmoViewport, Stats } from "@react-three/drei";

export default function Debug() {
	return (
		<>
			<axesHelper args={[50]} />
			<Checkerboard />
			<GizmoHelper alignment="bottom-right" margin={[80, 80]}>
				<GizmoViewport
					axisColors={["red", "green", "blue"]}
					labelColor="black"
				/>
			</GizmoHelper>
			<Stats showPanel={0} className="stats" />
		</>
	);
}
