import { useGSStore } from "@/hooks/useGSStore";
import { useShallow } from "zustand/react/shallow";
import SceneDynamic from "./SceneDynamic";

/** Spark already sorts all meshes together; composite mode shows all scenes. */
export default function CompositeViewer() {
	const sceneIds = useGSStore(
		useShallow((state) => Object.keys(state.gsmap.scenes))
	);
	return (
		<>
			{sceneIds.map((sceneId) => (
				<SceneDynamic key={sceneId} sceneId={sceneId} composite />
			))}
		</>
	);
}
