import TextInput from "@/components/input/TextInput";
import { useGSStore } from "@/hooks/useGSStore";

export default function SceneName({ sceneId }: { sceneId: string }) {
	const sceneName = useGSStore((state) => state.gsmap.scenes[sceneId].name);
	const setSceneTransform = useGSStore((state) => state.setSceneTransform);

	return (
		<TextInput
			value={sceneName}
			valueHandler={(value: string) =>
				setSceneTransform(sceneId, { name: value })
			}
		/>
	);
}
