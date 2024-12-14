import { useGSStore } from "@/hooks/useGSStore";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { assertNodeIsPortalEdge } from "@/model/GSNode";
import { barrierHeight } from "@/utils/constants";
import { color } from "@/utils/theme";
import { RoundedBox } from "@react-three/drei";
import { Vector3 } from "three";

const startPosition = new Vector3();
const centerPosition = new Vector3();
const endPosition = new Vector3();
const direction = new Vector3();

export default function PortalEdge({
	sceneId,
	portalId,
}: {
	sceneId: string;
	portalId: string;
}) {
	const visible = useSettingsStore((state) => state.debug && state.debugNodes);
	const wallStartPosition = useGSStore((state) => {
		const portal = state.gsmap.scenes[sceneId].portals[portalId];
		assertNodeIsPortalEdge(portal);
		return portal.startPosition;
	});
	const wallEndPosition = useGSStore((state) => {
		const portal = state.gsmap.scenes[sceneId].portals[portalId];
		assertNodeIsPortalEdge(portal);
		return portal.endPosition;
	});
	const wallThickness = useGSStore((state) => {
		const portal = state.gsmap.scenes[sceneId].portals[portalId];
		assertNodeIsPortalEdge(portal);
		return portal.thickness;
	});
	const destination = useGSStore((state) => {
		const portal = state.gsmap.scenes[sceneId].portals[portalId];
		assertNodeIsPortalEdge(portal);
		return portal.destination;
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
			userData={{
				collidable: true,
				portal: true,
				portalFrom: sceneId,
				portalTo: destination,
			}}
		>
			<meshStandardMaterial
				color={color.portalNode}
				transparent
				opacity={0.5}
			/>
		</RoundedBox>
	);
}
