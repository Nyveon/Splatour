import TextInput from "@/components/input/TextInput";
import { useGSStore } from "@/hooks/useGSStore";

export default function SceneName({ sceneId, editing }: { sceneId: string, editing: boolean }) {
	const sceneName = useGSStore((state) => state.gsmap.scenes[sceneId].name);
	const setSceneTransform = useGSStore((state) => state.setSceneTransform);

    if (!editing) {
        return <span>{sceneName}</span>;
    }

	return (
		<TextInput
			value={sceneName}
			valueHandler={(value: string) =>
				setSceneTransform(sceneId, { name: value })
			}
		/>
	);
}
