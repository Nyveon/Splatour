import Button from "@/components/input/Button";
import { useGSStore } from "@/hooks/useGSStore";

export default function SceneDelete({ sceneId }: { sceneId: string }) {
	const setDeleteScene = useGSStore((state) => state.setDeleteScene);
	return (
		<Button
			title="Delete the scene from the map"
			icon="trash"
			variant="danger"
			onClick={() => {
				setDeleteScene(sceneId);
			}}
		/>
	);
}
