import type { GSScene } from "@/model/GSScene";
import { useEffect, useRef } from "react";
import type { Group } from "three";
import SceneArtifacts from "../nodes/artifacts/SceneArtifacts";
import SceneBarriers from "../nodes/barriers/SceneBarriers";
import ScenePortals from "../nodes/portals/ScenePortals";
import SceneViewer from "./SceneViewer";

export default function SceneStatic({ scene }: { scene: GSScene }) {
	const sceneRef = useRef<Group>(null);
	const relativeGroupRef = useRef<Group>(null);
	const floorGroupRef = useRef<Group>(null);

	useEffect(() => {
		if (!sceneRef.current || !relativeGroupRef.current) return;

		sceneRef.current.position.set(
			scene.position.x,
			scene.position.y,
			scene.position.z
		);
		relativeGroupRef.current.scale.set(
			scene.scale.x,
			scene.scale.y,
			scene.scale.z
		);
		relativeGroupRef.current.rotation.set(
			scene.rotation.x,
			scene.rotation.y,
			scene.rotation.z
		);
	}, [scene, sceneRef]);

	console.log(scene);

	return (
		<group ref={sceneRef}>
			<group ref={relativeGroupRef}>
				<SceneViewer sceneData={{ filePath: scene.filePath }} />
				<SceneArtifacts sceneId={scene.id} />
			</group>
			<group ref={floorGroupRef} userData={{ hasCollidables: true }}>
				<SceneBarriers sceneId={scene.id} />
				<ScenePortals sceneId={scene.id} />
			</group>
		</group>
	);
}
