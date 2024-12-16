import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions } from "@/hooks/useInteractions";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import SceneArtifacts from "../nodes/artifacts/SceneArtifacts";
import SceneBarriers from "../nodes/barriers/SceneBarriers";
import ScenePortals from "../nodes/portals/ScenePortals";
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

		const sceneHidden =
			!useSettingsStore.getState().forceVisible &&
			(useInteractions.getState().currentSceneId !== sceneId ||
				useGSStore.getState().gsmap.scenes[sceneId].hidden);
		// const sceneVisible = !useGSStore.getState().gsmap.scenes[sceneId].hidden;
		splatSceneRef.current.visible = !sceneHidden;
	}

	function updateScene() {
		const gsmapScene = useGSStore.getState().gsmap.scenes[sceneId];

		if (
			!gsmapScene ||
			!sceneRef.current ||
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
		relativeGroupRef.current.scale.set(
			sceneScale.x,
			sceneScale.y,
			sceneScale.z
		);
		relativeGroupRef.current.rotation.set(
			sceneRotation.x,
			sceneRotation.y,
			sceneRotation.z
		);

		floorGroupRef.current.position.set(0, -scenePosition.y, 0);
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
		<group ref={sceneRef} userData={{ hasCollidables: true }}>
			<group ref={relativeGroupRef}>
				<SceneViewer ref={splatSceneRef} sceneData={sceneData} />
				<SceneArtifacts sceneId={sceneId} />
			</group>
			<group ref={floorGroupRef} userData={{ hasCollidables: true }}>
				<SceneBarriers sceneId={sceneId} />
				<ScenePortals sceneId={sceneId} />
			</group>
		</group>
	);
}
