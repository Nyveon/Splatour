import Button from "@/components/input/Button";
import { useGSStore } from "@/hooks/useGSStore";

export default function SceneVisibility({ sceneId }: { sceneId: string }) {
	const isHidden = useGSStore((state) => state.gsmap.scenes[sceneId].hidden);
	const setSceneTransform = useGSStore((state) => state.setSceneTransform);

	const handleToggle = () => {
		setSceneTransform(sceneId, { hidden: !isHidden });
	};

	return (
		<Button
			title="Toggle visibility"
			variant={isHidden ? "pending" : "primary"}
			icon={isHidden ? "eye-off" : "eye"}
			onClick={handleToggle}
		/>
	);
}
