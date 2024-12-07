import { useGSStore } from "@/hooks/useGSStore";
import Artifact from "./Artifact";
import { useShallow } from "zustand/shallow";

export default function SceneArtifacts({ sceneId }: { sceneId: string }) {
    const artifactIds = useGSStore(
        useShallow((state) => Object.keys(state.gsmap.scenes[sceneId].artifacts))
    );

	if (!artifactIds) {
		return null;
	}

	return (
		<>
			{artifactIds.map((artifactId) => {
				return <Artifact key={artifactId} sceneId={sceneId} artifactId={artifactId} />;
			})}
		</>
	);
}
