import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions } from "@/hooks/useInteractions";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh, Vector3 } from "three";
import ArtifactContentHint from "./ArtifactContentHint";
import ArtifactContentView from "./ArtifactContentView";
import { color } from "@/utils/theme";

const activationRangeBase = 0.75; // 75cm average arm length
const artifactWorldPosition = new Vector3();
const artifactWorldScale = new Vector3();

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
	const artifactHint = useRef<HTMLDivElement>(null);
	const setInteractable = useInteractions((state) => state.setInteractable);
	const artifactPosition = useGSStore(
		(state) => state.gsmap.scenes[sceneId].artifacts[artifactId].position
	);
	const artifactRadius = useGSStore(
		(state) => state.gsmap.scenes[sceneId].artifacts[artifactId].radius
	);
	const visible = useSettingsStore((state) => state.debug && state.debugNodes);

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

		artifact.getWorldScale(artifactWorldScale);
		const artifactTrueSize = artifactRadius * artifactWorldScale.x;
		const activationRange = artifactTrueSize + activationRangeBase;

		if (distance > activationRange) {
			if (artifactHint.current) {
				if (distance < 2 * activationRange) {
					artifactHint.current.style.opacity = "33%";
				} else {
					artifactHint.current.style.opacity = "10%";
				}
			}

			deactivate();
			return;
		}

		if (artifactHint.current) {
			if (isActive) {
				artifactHint.current.style.opacity = "0%";
			} else {
				artifactHint.current.style.opacity = "100%";
			}
		}

		if (
			raycaster.intersectObject(artifact).length > 0 ||
			distance < artifactTrueSize
		) {
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
			<ArtifactContentHint ref={artifactHint} />

			<mesh ref={artifactMesh} visible={visible}>
				<sphereGeometry args={[artifactRadius, 16]} />
				<meshBasicMaterial color={color.artifactNode} opacity={0.7} transparent />
			</mesh>
		</group>
	);
}
