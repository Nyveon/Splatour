import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions } from "@/hooks/useInteractions";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { useState } from "react";
import ArtifactContentView from "./ArtifactContentView";

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
	const [isActive, setIsActive] = useState(false);
	const setInteractable = useInteractions((state) => state.setInteractable);
	const artifactPosition = useGSStore(
		(state) => state.gsmap.scenes[sceneId].artifacts[artifactId].position
	);
	const artifactRadius = useGSStore(
		(state) => state.gsmap.scenes[sceneId].artifacts[artifactId].radius
	);
	const debug = useSettingsStore((state) => state.debug);

	return (
		<group
			position={[artifactPosition.x, artifactPosition.y, artifactPosition.z]}
		>
			{isActive && (
				<ArtifactContentView sceneId={sceneId} artifactId={artifactId} />
			)}

			<mesh
				onPointerOver={() => {
					setInteractable(true);
					setIsActive(true);
				}}
				onPointerOut={() => {
					setInteractable(false);
					setIsActive(false);
				}}
				visible={debug}
			>
				<sphereGeometry args={[artifactRadius, 16]} />
				<meshBasicMaterial color="green" opacity={0.7} transparent />
			</mesh>
		</group>
	);
}
