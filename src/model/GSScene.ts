import { DropInViewer } from "@mkkellogg/gaussian-splats-3d";
import * as THREE from "three";

export interface SerialGSScene {
	filePath: string;
	name: string;
	scale: { x: number; y: number; z: number };
	rotation: { x: number; y: number; z: number };
	position: { x: number; y: number; z: number };
}

export interface GSScene {
	id: string;
	filePath: string;
	name: string;
	scale: { x: number; y: number; z: number };
	rotation: { x: number; y: number; z: number };
	position: { x: number; y: number; z: number };
	container: THREE.Group;
}

export function gssCreate(filePath: string, name: string): GSScene {
	return {
		id: crypto.randomUUID(),
		filePath: filePath,
		name: name,
		scale: { x: 1, y: 1, z: 1 },
		rotation: { x: 0, y: 0, z: 0 },
		position: { x: 0, y: 0, z: 0 },
		container: new THREE.Group(),
	};
}

export function gssGetOptions(scene: GSScene) {
	return {
		scale: [scene.scale.x, scene.scale.y, scene.scale.z],
		rotation: [scene.rotation.x, scene.rotation.y, scene.rotation.z],
		position: [scene.position.x, scene.position.y, scene.position.z],
	};
}

export function gssDeserialize(scene: SerialGSScene): GSScene {
	const gssBase = gssCreate(scene.filePath, scene.name);
	gssBase.scale = scene.scale;
	gssBase.rotation = scene.rotation;
	gssBase.position = scene.position;
	return gssBase;
}

function gssUpdateTransform(container: THREE.Object3D, scene: GSScene) {
	container.position.set(scene.position.x, scene.position.y, scene.position.z);
	container.rotation.set(scene.rotation.x, scene.rotation.y, scene.rotation.z);
	container.scale.set(scene.scale.x, scene.scale.y, scene.scale.z);
}

export function gssUpdateTransforms(viewer: DropInViewer, scenes: GSScene[]) {
	scenes.forEach((scene, index) => {
		const sceneContainer = viewer.getSplatScene(index).parent;

		if (!sceneContainer) {
			console.error("sceneContainer is null");
			return;
		}

		gssUpdateTransform(sceneContainer, scene);
	});
}
