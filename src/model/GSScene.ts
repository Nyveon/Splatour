import { DropInViewer, SplatBuffer } from "@mkkellogg/gaussian-splats-3d";
import * as THREE from "three";

interface Vec3 {
	x: number;
	y: number;
	z: number;
}

export interface SerialGSScene {
	filePath: string;
	name: string;
	scale: Vec3;
	rotation: Vec3;
	position: Vec3;
}

export interface GSScene {
	id: string;
	filePath: string;
	name: string;
	scale: Vec3;
	rotation: Vec3;
	position: Vec3;
	buffer?: SplatBuffer;
}

export const gssResetTransform = {
	scale: { x: 1, y: 1, z: 1 },
	rotation: { x: 0, y: 0, z: 0 },
	position: { x: 0, y: 0, z: 0 },
};

export function gssCreate(filePath: string, name: string): GSScene {
	return {
		id: crypto.randomUUID(),
		filePath: filePath,
		name: name,
		scale: { x: 1, y: 1, z: 1 },
		rotation: { x: 0, y: 0, z: 0 },
		position: { x: 0, y: 0, z: 0 },
	};
}

export function gssCreateBuffer(
	fileName: string,
	buffer: SplatBuffer
): GSScene {
	const scene = gssCreate(fileName, fileName);
	scene.buffer = buffer;
	return scene;
}

export function gssDeserialize(scene: SerialGSScene): GSScene {
	const gssBase = gssCreate(scene.filePath, scene.name);
	gssBase.scale = scene.scale;
	gssBase.rotation = scene.rotation;
	gssBase.position = scene.position;
	return gssBase;
}

export function gssSerialize(scene: GSScene): SerialGSScene {
	return {
		filePath: scene.filePath,
		name: scene.name,
		scale: scene.scale,
		rotation: scene.rotation,
		position: scene.position,
	};
}

function gssUpdateTransform(container: THREE.Object3D, scene: GSScene) {
	console.log("updating transform", container, scene);
	container.position.set(scene.position.x, scene.position.y, scene.position.z);
	container.rotation.set(scene.rotation.x, scene.rotation.y, scene.rotation.z);
	container.scale.set(scene.scale.x, scene.scale.y, scene.scale.z);
	container.updateMatrix();
	container.updateMatrixWorld(true);
}

export function gssUpdateTransforms(viewer: DropInViewer, scenes: GSScene[]) {
	console.log("GSS: Update Transforms", scenes);
	scenes.forEach((scene, index) => {
		const sceneContainer = viewer.getSplatScene(index);
		console.log(sceneContainer);

		if (!sceneContainer) {
			console.error("sceneContainer is null");
			return;
		}

		gssUpdateTransform(sceneContainer, scene);
		gssUpdateTransform(sceneContainer.parent, scene);
	});
}
