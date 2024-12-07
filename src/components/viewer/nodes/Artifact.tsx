import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions } from "@/hooks/useInteractions";

//todo: activation range
//todo: left click to interact
//todo: right click to edit

export default function Artifact({
	sceneId,
	artifactId,
}: {
	sceneId: string;
	artifactId: string;
}) {
	const setInteractable = useInteractions((state) => state.setInteractable);
	const artifactPosition = useGSStore(
		(state) => state.gsmap.scenes[sceneId].artifacts[artifactId].position
	);
	const artifactRadius = useGSStore(
		(state) => state.gsmap.scenes[sceneId].artifacts[artifactId].radius
	);

	return (
		<mesh
			position={[artifactPosition.x, artifactPosition.y, artifactPosition.z]}
			onPointerOver={() => {
				setInteractable(true);
			}}
			onPointerOut={() => {
				setInteractable(false);
			}}
		>
			<sphereGeometry args={[artifactRadius, 16]} />
			<meshBasicMaterial color="green" opacity={0.7} transparent />
		</mesh>
	);
}
