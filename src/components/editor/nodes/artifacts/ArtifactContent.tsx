import { useGSStore } from "@/hooks/useGSStore";

export default function ArtifactContent({
	nodeId,
	sceneId,
}: {
	nodeId: string;
	sceneId: string;
}) {
	const artifactContent = useGSStore(
		(state) => state.gsmap.scenes[sceneId].artifacts[nodeId].content
	);
	const setArtifactTransform = useGSStore(
		(state) => state.setArtifactTransform
	);

    return <div>hi</div>
}