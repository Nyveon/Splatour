import Checkbox from "@/components/input/Checkbox";
import { useGSStore } from "@/hooks/useGSStore";

export default function SceneIsDefault({ sceneId }: { sceneId: string }) {
	const defaultScene = useGSStore((state) => state.gsmap.defaultScene);
	const setGSMap = useGSStore((state) => state.setGSMap);

	const handleDefaultScene = (value: boolean) => {
		if (value) {
			setGSMap({ defaultScene: sceneId });
		}
	};

	return (
		<Checkbox
			label="Default scene"
			title="Set this scene as the default (entry) scene for the entire map"
			value={sceneId === defaultScene}
			onChange={handleDefaultScene}
		/>
	);
}
