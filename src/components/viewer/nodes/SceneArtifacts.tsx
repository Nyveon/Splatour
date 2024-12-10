import { useGSStore } from "@/hooks/useGSStore";
import { useShallow } from "zustand/shallow";
import Artifact from "./Artifact";

export default function SceneArtifacts({ sceneId }: { sceneId: string }) {
	console.log(useGSStore.getState());

	const artifactIds = useGSStore(
		useShallow((state) => Object.keys(state.gsmap.scenes[sceneId].artifacts))
	);

	if (!artifactIds) {
		return null;
	}

	return (
		<>
			{artifactIds.map((artifactId) => {
				return (
					<Artifact
						key={artifactId}
						sceneId={sceneId}
						artifactId={artifactId}
					/>
				);
			})}
		</>
	);
}
