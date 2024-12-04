import Button from "@/components/input/Button";
import { useGSStore } from "@/hooks/useGSStore";
import useInteractions from "@/hooks/useInteractions";
import { playerHeight } from "@/utils/constants";

export default function SceneTeleporter({ sceneId }: { sceneId: string }) {
	const setTeleportPending = useInteractions(
		(state) => state.setTeleportPending
	);

	function setTeleportTarget() {
		const scenePosition = useGSStore.getState().gsmap.scenes[sceneId].position;
		setTeleportPending({
			x: scenePosition.x,
			y: playerHeight,
			z: scenePosition.z,
		});
	}

	return (
		<Button
			title="Teleport to center"
			icon="target"
			onClick={() => setTeleportTarget()}
		/>
	);
}
