import { useGSStore } from "@/hooks/useGSStore";
import { useShallow } from "zustand/shallow";
import GSSceneEditable from "./GSSceneEditable";

export default function GSMapEditable() {
	const sceneIds = useGSStore(
		useShallow((state) => Object.keys(state.gsmap.scenes))
	);

	return (
		<>
			{sceneIds.map((sceneId) => {
				return <GSSceneEditable key={sceneId} sceneId={sceneId} />;
			})}
		</>
	);
}
