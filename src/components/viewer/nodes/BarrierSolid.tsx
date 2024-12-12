import { useGSStore } from "@/hooks/useGSStore";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { nodeIsSolid } from "@/model/GSNode";
import { barrierHeight } from "@/utils/constants";

export default function BarrierSolid({
	sceneId,
	barrierId,
}: {
	sceneId: string;
	barrierId: string;
}) {
	const debug = useSettingsStore((state) => state.debug);
	const solidPosition = useGSStore((state) => {
		const barrier = state.gsmap.scenes[sceneId].barriers[barrierId];

		if (!nodeIsSolid(barrier)) {
			throw new Error(
				"Expected a GSNodeSolid barrier, but got something else."
			);
		}

		return barrier.position;
	});

	const solidRadius = useGSStore((state) => {
		const barrier = state.gsmap.scenes[sceneId].barriers[barrierId];
		if (!nodeIsSolid(barrier)) {
			throw new Error(
				"Expected a GSNodeSolid barrier, but got something else."
			);
		}
		return barrier.radius;
	});

	// todo: double check the selector here is working and not rerendering on all changes

	console.log("re-rendering barrier");

	return (
		<group position={[solidPosition.x, 0, solidPosition.z]}>
			<mesh visible={debug}>
				<cylinderGeometry
					args={[solidRadius, solidRadius, barrierHeight, 16]}
				/>
				<meshBasicMaterial color="red" opacity={0.7} transparent />
			</mesh>
		</group>
	);
}
