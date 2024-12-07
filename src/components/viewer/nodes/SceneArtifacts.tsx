import { useGSStore } from "@/hooks/useGSStore";
import Artifact from "./Artifact";

export default function SceneArtifacts({ sceneId }: { sceneId: string }) {
	const artifacts = useGSStore(
		(state) => state.gsmap.scenes[sceneId].artifacts
	);

	if (!artifacts) {
		return null;
	}

	return (
		<>
			{Object.entries(artifacts).map(([artifactId, artifact]) => {
				return <Artifact key={artifactId} artifact={artifact} />;
			})}
		</>
	);
}
