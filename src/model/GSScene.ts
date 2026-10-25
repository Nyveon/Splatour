import { Vec3 } from "@/utils/data";
import { GSNode, GSNodeArtifact, GSNodeBarrier, GSNodePortal } from "./GSNode";
import { GSSky } from "./GSSky";
import {
	PostProcessingSettings,
	resolvePostProcessing,
} from "./PostProcessing";

export interface SerialGSScene {
	postProcessing?: PostProcessingSettings;
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
	postProcessing: PostProcessingSettings;
	// Metadata
	id: string;
	filePath: string;
	name: string;

	// Transforms
	scale: Vec3;
	rotation: Vec3;
	position: Vec3;

	// Rendering
	file?: File;
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
		postProcessing: resolvePostProcessing(),
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

/** Keep the original file; each viewer owns and disposes its decoded GPU data. */
export function gssCreateFromFile(file: File): GSScene {
	const scene = gssCreate(file.name, file.name);
	scene.file = file;
	return scene;
}

export function gssDeserialize(scene: SerialGSScene): GSScene {
	const gssBase = gssCreate(scene.filePath, scene.name);
	gssBase.postProcessing = resolvePostProcessing(scene.postProcessing);
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
		postProcessing: resolvePostProcessing(scene.postProcessing),
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
		super(
			"Unsupported scene format. Choose a Gaussian splat .ply or .ksplat file."
		);
		this.name = "SplatFormatError";
	}
}

export function isSupportedSceneFile(fileName: string): boolean {
	return /\.(ply|ksplat)$/i.test(fileName);
}

/** Validate the local asset without storing renderer resources in project state. */
export async function validateSceneFile(file: File): Promise<void> {
	if (!isSupportedSceneFile(file.name)) throw new SplatFormatError();
	if (file.size < 4) throw new Error("Scene file is empty or truncated.");
	if (/\.ply$/i.test(file.name)) {
		const header = await file.slice(0, 65536).text();
		if (!header.startsWith("ply\n") && !header.startsWith("ply\r\n")) {
			throw new Error("Invalid PLY header.");
		}
		if (!header.includes("end_header"))
			throw new Error("Incomplete PLY header.");
	} else if (file.size < 4096) {
		throw new Error("KSPLAT file is truncated.");
	}
}
