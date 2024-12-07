import type { GSScene } from "@/model/GSScene";
import { useEffect, useRef } from "react";
import type { Group } from "three";
import SceneViewer from "./SceneViewer";

export default function SceneStatic({ scene }: { scene: GSScene }) {
	const sceneRef = useRef<Group>(null);

	useEffect(() => {
		if (!sceneRef.current) return;

		sceneRef.current.position.set(
			scene.position.x,
			scene.position.y,
			scene.position.z
		);
		sceneRef.current.scale.set(scene.scale.x, scene.scale.y, scene.scale.z);
		sceneRef.current.rotation.set(
			scene.rotation.x,
			scene.rotation.y,
			scene.rotation.z
		);
	}, [scene, sceneRef]);

	return (
		<group ref={sceneRef}>
			<SceneViewer sceneData={{ filePath: scene.filePath }} />
			{/* //todo: artifacts */}
		</group>
	);
}
