import { useGSStore } from "@/hooks/useGSStore";
import { useShallow } from "zustand/shallow";
import ProductMarker from "../../products/ProductMarker";
import Artifact from "./Artifact";

export default function SceneArtifacts({ sceneId }: { sceneId: string }) {
	const artifactIds = useGSStore(
		useShallow((state) => Object.keys(state.gsmap.scenes[sceneId].artifacts))
	);
	const artifacts = useGSStore(
		(state) => state.gsmap.scenes[sceneId].artifacts
	);

	if (!artifactIds) {
		return null;
	}

	return (
		<>
			{artifactIds.map((artifactId) => {
				if (artifacts[artifactId].product)
					return (
						<ProductMarker
							key={artifactId}
							sceneId={sceneId}
							artifactId={artifactId}
						/>
					);
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
