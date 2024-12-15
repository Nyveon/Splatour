import Button from "@/components/input/Button";
import { useInteractions } from "@/hooks/useInteractions";
import { playerHeight } from "@/utils/constants";
import { toastSuccess } from "@/utils/toasts";

export default function ResetCamera() {
	const setTeleportPending = useInteractions(
		(state) => state.setTeleportPending
	);

	function resetCamera() {
		setTeleportPending({
			x: 0,
			y: playerHeight,
			z: 0,
		});
		toastSuccess("Camera position reset");
	}

	return (
		<Button
			onClick={resetCamera}
			label="Reset"
			title="Return camera to starting position"
			icon="target"
		/>
	);
}
