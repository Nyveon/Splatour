import { Vec3 } from "@/utils/data";
import type {
	SceneFormatType,
	SplatBuffer,
} from "@mkkellogg/gaussian-splats-3d";
import { KSplatLoader, LoaderUtils } from "@mkkellogg/gaussian-splats-3d";
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
		super("Invalid file format");
		this.name = "SplatFormatError";
	}
}

/**
 * Turns a ply/splat/ksplat file into a loaded splat buffer
 * ! .ply and .splat are currently disabled
 * @param fileBufferData of the file
 * @param format GS3D format of the file
 * @returns Promise of the loaded splat buffer
 */
export async function fileToSplatBuffer(file: File) {
	const fileName = file.name;
	const format = LoaderUtils.sceneFormatFromPath(fileName);

	if (!format) {
		throw new SplatFormatError();
	}

	const fileData = await file.arrayBuffer();
	return fileBufferToSplatBuffer(fileData, format);
}

function fileBufferToSplatBuffer(
	fileBufferData: ArrayBuffer,
	format: SceneFormatType
): Promise<SplatBuffer> {
	if (format === 0) {
		// splat
		throw new Error("Not yet implement, try with .ksplat");
		// return GaussianSplats3D.PlyLoader.loadFromFileData(
		// 	fileBufferData.data,
		// 	alphaRemovalThreshold,
		// 	compressionLevel,
		// 	true,
		// 	outSphericalHarmonicsDegree,
		// 	sectionSize,
		// 	sceneCenter,
		// 	blockSize,
		// 	bucketSize
		// );
	} else if (format === 2) {
		//ply
		throw new Error("Not yet implement, try with .ksplat");
		// return GaussianSplats3D.SplatLoader.loadFromFileData(
		// 	fileBufferData.data,
		// 	alphaRemovalThreshold,
		// 	compressionLevel,
		// 	true,
		// 	sectionSize,
		// 	sceneCenter,
		// 	blockSize,
		// 	bucketSize
		// );
	} else if (format === 1) {
		//ksplat
		return KSplatLoader.loadFromFileData(fileBufferData);
	}
	throw new Error("Invalid file format");
}
