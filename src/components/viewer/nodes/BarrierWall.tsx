import { useGSStore } from "@/hooks/useGSStore";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { assertNodeIsWall } from "@/model/GSNode";
import { barrierHeight } from "@/utils/constants";
import { color } from "@/utils/theme";
import { RoundedBox } from "@react-three/drei";
import { Vector3 } from "three";

const startPosition = new Vector3();
const centerPosition = new Vector3();
const endPosition = new Vector3();
const direction = new Vector3();

export default function BarrierWall({
	sceneId,
	barrierId,
}: {
	sceneId: string;
	barrierId: string;
}) {
	const visible = useSettingsStore((state) => state.debug && state.debugNodes);
	const wallStartPosition = useGSStore((state) => {
		const barrier = state.gsmap.scenes[sceneId].barriers[barrierId];
		assertNodeIsWall(barrier);
		return barrier.startPosition;
	});
	const wallEndPosition = useGSStore((state) => {
		const barrier = state.gsmap.scenes[sceneId].barriers[barrierId];
		assertNodeIsWall(barrier);
		return barrier.endPosition;
	});
	const wallThickness = useGSStore((state) => {
		const barrier = state.gsmap.scenes[sceneId].barriers[barrierId];
		assertNodeIsWall(barrier);
		return barrier.thickness;
	});

	startPosition.set(wallStartPosition.x, 0, wallStartPosition.z);
	endPosition.set(wallEndPosition.x, 0, wallEndPosition.z);
	centerPosition.copy(startPosition).add(endPosition).multiplyScalar(0.5);
	direction.copy(endPosition).sub(startPosition).normalize();

	const width = startPosition.distanceTo(endPosition);

	return (
		<RoundedBox
			args={[width, barrierHeight, wallThickness]}
			position={[centerPosition.x, barrierHeight / 2, centerPosition.z]}
			radius={wallThickness / 2}
			rotation={[0, -Math.atan2(direction.z, direction.x), 0]}
			visible={visible}
		>
			<meshStandardMaterial
				color={color.barrierNode}
				transparent
				opacity={0.5}
			/>
		</RoundedBox>
	);
}
