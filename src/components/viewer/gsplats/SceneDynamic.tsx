import { useGSStore } from "@/hooks/useGSStore";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import SceneArtifacts from "../nodes/SceneArtifacts";
import SceneBarriers from "../nodes/SceneBarriers";
import SceneViewer from "./SceneViewer";

export default function SceneDynamic({ sceneId }: { sceneId: string }) {
	const sceneRef = useRef<Group>(null);
	const relativeGroupRef = useRef<Group>(null);
	const floorGroupRef = useRef<Group>(null);
	const splatSceneRef = useRef<Group>(null);
	const sceneFile = useGSStore((state) => state.gsmap.scenes[sceneId].filePath);
	const sceneBuffer = useGSStore((state) => state.gsmap.scenes[sceneId].buffer);

	function updateSplatScene() {
		if (!splatSceneRef.current) {
			return;
		}

		const sceneVisible = !useGSStore.getState().gsmap.scenes[sceneId].hidden;
		splatSceneRef.current.visible = sceneVisible;
	}

	function updateScene() {
		const gsmapScene = useGSStore.getState().gsmap.scenes[sceneId];

		if (
			!sceneRef.current ||
			!gsmapScene ||
			!relativeGroupRef.current ||
			!floorGroupRef.current
		) {
			return;
		}

		const scenePosition = gsmapScene.position;
		const sceneScale = gsmapScene.scale;
		const sceneRotation = gsmapScene.rotation;

		sceneRef.current.position.set(
			scenePosition.x,
			scenePosition.y,
			scenePosition.z
		);
		sceneRef.current.scale.set(sceneScale.x, sceneScale.y, sceneScale.z);

		// Fully linked rotation
		relativeGroupRef.current.rotation.set(
			sceneRotation.x,
			sceneRotation.y,
			sceneRotation.z
		);

		// Floor snapped rotation
		floorGroupRef.current.rotation.set(0, sceneRotation.y, 0);
	}

	useFrame(() => {
		updateSplatScene();
		updateScene();
	});

	const sceneData = {
		filePath: sceneFile,
		buffer: sceneBuffer,
	};

	return (
		<group ref={sceneRef}>
			<group ref={relativeGroupRef}>
				<SceneViewer ref={splatSceneRef} sceneData={sceneData} />
				<SceneArtifacts sceneId={sceneId} />
			</group>
			<group ref={floorGroupRef}>
				<SceneBarriers sceneId={sceneId} />
			</group>
		</group>
	);
}
