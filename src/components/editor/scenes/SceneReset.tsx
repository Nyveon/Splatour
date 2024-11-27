import Button from "@/components/input/Button";
import { useGSStore } from "@/hooks/useGSStore";
import { gssResetTransform } from "@/model/GSScene";

export default function SceneReset({ sceneId }: { sceneId: string }) {
	const setSceneTransform = useGSStore((state) => state.setSceneTransform);

	return (
		<Button
			title="Reset the translation, rotation, and scale of the scene"
			icon="refresh-cw"
			variant="danger"
			onClick={() => {
				setSceneTransform(sceneId, gssResetTransform);
			}}
		/>
	);
}
