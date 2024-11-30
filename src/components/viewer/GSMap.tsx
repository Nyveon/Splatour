import { useGSStore } from "@/hooks/useGSStore";
import { useShallow } from "zustand/shallow";
import GSViewer from "./GSViewer";

export default function GSMap() {
	const sceneIds = useGSStore(
		useShallow((state) => Object.keys(state.gsmap.scenes))
	);

	return (
		<>
			{sceneIds.map((sceneId) => {
				return <GSViewer key={sceneId} sceneId={sceneId} />;
			})}
		</>
	);
}
