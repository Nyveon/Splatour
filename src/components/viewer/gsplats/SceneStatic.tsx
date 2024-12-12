import type { GSScene } from "@/model/GSScene";
import { useEffect, useRef } from "react";
import type { Group } from "three";
import SceneArtifacts from "../nodes/SceneArtifacts";
import SceneViewer from "./SceneViewer";

export default function SceneStatic({ scene }: { scene: GSScene }) {
	const sceneRef = useRef<Group>(null);
	const rotationGroupRef = useRef<Group>(null);

	useEffect(() => {
		if (!sceneRef.current || !rotationGroupRef.current) return;

		sceneRef.current.position.set(
			scene.position.x,
			scene.position.y,
			scene.position.z
		);
		sceneRef.current.scale.set(scene.scale.x, scene.scale.y, scene.scale.z);
		rotationGroupRef.current.rotation.set(
			scene.rotation.x,
			scene.rotation.y,
			scene.rotation.z
		);
	}, [scene, sceneRef]);

	console.log(scene);

	return (
		<group ref={sceneRef}>
			<group ref={rotationGroupRef}>
				<SceneViewer sceneData={{ filePath: scene.filePath }} />
				<SceneArtifacts sceneId={scene.id} />
			</group>
		</group>
	);
}
