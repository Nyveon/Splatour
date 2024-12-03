import { useGSStore } from "@/hooks/useGSStore";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import SceneViewer from "./SceneViewer";

export default function SceneDynamic({ sceneId }: { sceneId: string }) {
	const sceneRef = useRef<Group>(null);
	const sceneFile = useGSStore((state) => state.gsmap.scenes[sceneId].filePath);
	const sceneBuffer = useGSStore((state) => state.gsmap.scenes[sceneId].buffer);

	useFrame(() => {
		if (!sceneRef.current) return;

		const scenePosition = useGSStore.getState().gsmap.scenes[sceneId].position;
		const sceneScale = useGSStore.getState().gsmap.scenes[sceneId].scale;
		const sceneRotation = useGSStore.getState().gsmap.scenes[sceneId].rotation;

		sceneRef.current.position.set(
			scenePosition.x,
			scenePosition.y,
			scenePosition.z
		);
		sceneRef.current.scale.set(sceneScale.x, sceneScale.y, sceneScale.z);
		sceneRef.current.rotation.set(
			sceneRotation.x,
			sceneRotation.y,
			sceneRotation.z
		);
	});

	const sceneData = {
		filePath: sceneFile,
		buffer: sceneBuffer,
	};

	return <SceneViewer ref={sceneRef} sceneData={sceneData} />;
}
