import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions } from "@/hooks/useInteractions";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { color } from "@/utils/theme";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh, Vector3 } from "three";
import ArtifactContentHint from "./ArtifactContentHint";
import ArtifactContentView from "./ArtifactContentView";

const activationRangeBase = 1.25; // 75cm average arm length
const artifactWorldPosition = new Vector3();
const artifactWorldScale = new Vector3();
const cameraWorldPosition = new Vector3();

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
	const informationVisible = useSettingsStore(
		(state) => state.informationNodesVisible
	);
	const ready = useRef(false);
	const inActiveScene = useRef(false);
	const withinRange = useRef(false);

	useFrame(({ raycaster, camera }) => {
		const artifact = artifactMesh.current;

		if (!artifact) {
			return;
		}
		if (!informationVisible) {
			withinRange.current = false;
			if (ready.current) setInteractable(false);
			ready.current = false;
			if (isActive) setIsActive(false);
			return;
		}

		const currentSceneId = useInteractions.getState().currentSceneId;

		if (currentSceneId !== sceneId) {
			inActiveScene.current = false;
			withinRange.current = false;
			if (ready.current) setInteractable(false);
			ready.current = false;
			if (isActive) setIsActive(false);

			if (artifactHint.current) {
				artifactHint.current.style.display = "none";
			}
			return;
		}

		inActiveScene.current = true;

		artifact.getWorldPosition(artifactWorldPosition);
		camera.getWorldPosition(cameraWorldPosition);
		const distance = cameraWorldPosition.distanceTo(artifactWorldPosition);

		artifact.getWorldScale(artifactWorldScale);
		const artifactTrueSize = artifactRadius * artifactWorldScale.x;
		const activationRange = artifactTrueSize + activationRangeBase;
		withinRange.current = distance <= activationRange;
		if (artifactHint.current) {
			artifactHint.current.style.pointerEvents =
				withinRange.current && !isActive ? "auto" : "none";
		}

		if (distance > activationRange) {
			if (artifactHint.current) {
				if (distance < 2 * activationRange) {
					artifactHint.current.style.opacity = "40%";
				} else {
					artifactHint.current.style.opacity = "20%";
				}
			}

			if (isActive) {
				setIsActive(false);
				setInteractable(false);
			}

			if (ready.current) {
				ready.current = false;
				setInteractable(false);
			}

			return;
		}

		if (artifactHint.current) {
			artifactHint.current.style.display = "block";

			if (isActive) {
				artifactHint.current.style.opacity = "0%";
			} else {
				artifactHint.current.style.opacity = "95%";
			}
		}

		const lookingAt = raycaster.intersectObject(artifact).length > 0;

		if (lookingAt) {
			if (!useInteractions.getState().interactable) {
				setInteractable(true);
			}
			ready.current = true;
		} else if (
			useInteractions.getState().interactable &&
			!lookingAt &&
			ready.current
		) {
			setInteractable(false);
			ready.current = false;
		}
	});

	function handleClick() {
		if (
			!informationVisible ||
			!inActiveScene.current ||
			!withinRange.current
		) {
			return;
		}

		if (isActive) {
			setIsActive(false);
		} else {
			setIsActive(true);
		}
	}

	return (
		<group
			position={[artifactPosition.x, artifactPosition.y, artifactPosition.z]}
		>
			{informationVisible && (
				<ArtifactContentView
					active={isActive}
					sceneId={sceneId}
					artifactId={artifactId}
					onClose={() => setIsActive(false)}
				/>
			)}
			{informationVisible && (
				<ArtifactContentHint
					ref={artifactHint}
					onClick={handleClick}
				/>
			)}

			<mesh ref={artifactMesh} visible={visible} onClick={() => handleClick()}>
				<sphereGeometry args={[artifactRadius, 16]} />
				<meshBasicMaterial
					color={color.artifactNode}
					opacity={0.7}
					transparent
				/>
			</mesh>
		</group>
	);
}
