import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions } from "@/hooks/useInteractions";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh, Vector3 } from "three";
import ArtifactContentView from "./ArtifactContentView";

const activationRange = 1;
const artifactWorldPosition = new Vector3();

//todo: left click to interact
//todo: right click to edit

export default function Artifact({
	sceneId,
	artifactId,
}: {
	sceneId: string;
	artifactId: string;
}) {
	const [isActive, setIsActive] = useState(false);
	const artifactMesh = useRef<Mesh>(null);
	const setInteractable = useInteractions((state) => state.setInteractable);
	const artifactPosition = useGSStore(
		(state) => state.gsmap.scenes[sceneId].artifacts[artifactId].position
	);
	const artifactRadius = useGSStore(
		(state) => state.gsmap.scenes[sceneId].artifacts[artifactId].radius
	);
	const debug = useSettingsStore((state) => state.debug);

	function deactivate() {
		if (!isActive) {
			return;
		}

		setInteractable(false);
		setIsActive(false);
	}

	function activate() {
		if (isActive) {
			return;
		}

		setInteractable(true);
		setIsActive(true);
	}

	useFrame(({ raycaster }) => {
		const artifact = artifactMesh.current;

		if (!artifact) {
			return;
		}

		artifact.getWorldPosition(artifactWorldPosition);
		const distance = raycaster.ray.origin.distanceTo(artifactWorldPosition);

		if (distance > activationRange) {
			deactivate();
			return;
		}

		if (raycaster.intersectObject(artifact).length > 0) {
			activate();
		} else {
			deactivate();
		}
	});

	return (
		<group
			position={[artifactPosition.x, artifactPosition.y, artifactPosition.z]}
		>
			<ArtifactContentView
				active={isActive}
				sceneId={sceneId}
				artifactId={artifactId}
			/>

			<mesh ref={artifactMesh} visible={debug}>
				<sphereGeometry args={[artifactRadius, 16]} />
				<meshBasicMaterial color="green" opacity={0.7} transparent />
			</mesh>
		</group>
	);
}
