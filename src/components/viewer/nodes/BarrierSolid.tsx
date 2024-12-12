import { useGSStore } from "@/hooks/useGSStore";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { assertNodeIsSolid } from "@/model/GSNode";
import { barrierHeight } from "@/utils/constants";

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
		<group position={[solidPosition.x, 0, solidPosition.z]}>
			<mesh visible={visible}>
				<cylinderGeometry
					args={[solidRadius, solidRadius, barrierHeight, 16]}
				/>
				<meshBasicMaterial color="red" opacity={0.7} transparent />
			</mesh>
		</group>
	);
}
