import { useGSStore } from "@/hooks/useGSStore";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { assertNodeIsSolid } from "@/model/GSNode";
import { barrierHeight } from "@/utils/constants";
import { color } from "@/utils/theme";
import { Cylinder } from "@react-three/drei";

export default function BarrierSolid({
	sceneId,
	barrierId,
}: {
	sceneId: string;
	barrierId: string;
}) {
	const visible = useSettingsStore((state) => state.debug && state.debugNodes);
	const solidPosition = useGSStore((state) => {
		const barrier = state.gsmap.scenes[sceneId].barriers[barrierId];
		assertNodeIsSolid(barrier);
		return barrier.position;
	});
	const solidRadius = useGSStore((state) => {
		const barrier = state.gsmap.scenes[sceneId].barriers[barrierId];
		assertNodeIsSolid(barrier);
		return barrier.radius;
	});

	return (
		<Cylinder
			args={[solidRadius, solidRadius, barrierHeight, 24]}
			position={[solidPosition.x, barrierHeight / 2, solidPosition.z]}
			visible={visible}
			userData={{ collidable: true }}
		>
			<meshBasicMaterial color={color.barrierNode} opacity={0.7} transparent />
		</Cylinder>
	);
}
