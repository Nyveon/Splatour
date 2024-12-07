import { useInteractions } from "@/hooks/useInteractions";
import { GSSceneArtifact } from "@/model/GSSceneArtifact";

export default function Artifact({ artifact }: { artifact: GSSceneArtifact }) {
	const setInteractable = useInteractions((state) => state.setInteractable);

	console.log("redraw artifact");

	return (
		<mesh
			position={[artifact.position.x, artifact.position.y, artifact.position.z]}
			onPointerOver={() => {
				setInteractable(true);
			}}
			onPointerOut={() => {
				setInteractable(false);
			}}
		>
			<sphereGeometry args={[artifact.radius, 16]} />
			<meshBasicMaterial color="green" opacity={0.7} transparent />
		</mesh>
	);
}
