import { useGSStore } from "@/hooks/useGSStore";

export default function NodeArtifact({
	nodeId,
	sceneId,
}: {
	nodeId: string;
	sceneId: string;
}) {
	const artifact = useGSStore(
		(state) => state.gsmap.scenes[sceneId].artifacts[nodeId]
	);

	return <div>{artifact.name}</div>;
}
