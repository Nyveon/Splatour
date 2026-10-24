import { Vec3 } from "@/utils/data";
import type { SplatBuffer } from "@mkkellogg/gaussian-splats-3d";
import {
	KSplatLoader,
	LoaderUtils,
	PlyLoader,
	SceneFormat,
} from "@mkkellogg/gaussian-splats-3d";
import { GSNode, GSNodeArtifact, GSNodeBarrier, GSNodePortal } from "./GSNode";
import { GSSky } from "./GSSky";

export interface SerialGSScene {
	id: string;
	filePath: string;
	name: string;
	scale: Vec3;
	rotation: Vec3;
	position: Vec3;
	sky: GSSky | null;
	artifacts: Record<string, GSNodeArtifact>;
	barriers: Record<string, GSNodeBarrier>;
	portals: Record<string, GSNodePortal>;
}

export interface GSScene {
	// Metadata
	id: string;
	filePath: string;
	name: string;

	// Transforms
	scale: Vec3;
	rotation: Vec3;
	position: Vec3;

	// Rendering
	buffer?: SplatBuffer;
	hidden?: boolean;

	// Skybox
	sky?: GSSky;

	// Elements
	nodes: Record<string, GSNode>;
	artifacts: Record<string, GSNodeArtifact>;
	barriers: Record<string, GSNodeBarrier>;
	portals: Record<string, GSNodePortal>;
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
		nodes: {},
		artifacts: {},
		barriers: {},
		portals: {},
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
	if (scene.id) gssBase.id = scene.id;
	gssBase.scale = scene.scale;
	gssBase.rotation = scene.rotation;
	gssBase.position = scene.position;
	if (scene.sky) gssBase.sky = scene.sky;

	gssBase.artifacts = scene.artifacts ?? {};
	gssBase.barriers = scene.barriers ?? {};
	gssBase.portals = scene.portals ?? {};
	gssBase.nodes = {
		...gssBase.artifacts,
		...gssBase.barriers,
		...gssBase.portals,
	};

	return gssBase;
}

export function gssSerialize(scene: GSScene): SerialGSScene {
	return {
		id: scene.id,
		filePath: scene.filePath,
		name: scene.name,

		scale: scene.scale,
		rotation: scene.rotation,
		position: scene.position,

		sky: scene.sky ?? null,

		artifacts: scene.artifacts ?? {},
		barriers: scene.barriers ?? {},
		portals: scene.portals ?? {},
	};
}

export class SplatFormatError extends Error {
	constructor() {
		super("Unsupported scene format. Choose a Gaussian splat .ply or .ksplat file.");
		this.name = "SplatFormatError";
	}
}

export function isSupportedSceneFile(fileName: string): boolean {
	return /\.(ply|ksplat)$/i.test(fileName);
}

/** Load a Gaussian splat PLY or KSPLAT file for editing. */
export async function fileToSplatBuffer(file: File): Promise<SplatBuffer> {
	if (!isSupportedSceneFile(file.name)) {
		throw new SplatFormatError();
	}

	const format = LoaderUtils.sceneFormatFromPath(file.name.toLowerCase());
	const fileData = await file.arrayBuffer();
	if (format === SceneFormat.Ply) {
		// Match the viewer's alpha threshold and keep an optimized in-memory buffer.
		return PlyLoader.loadFromFileData(fileData, 20, 1, true);
	}
	return KSplatLoader.loadFromFileData(fileData);
}
