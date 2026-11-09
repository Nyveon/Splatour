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
			"Unsupported scene format. Choose a Gaussian splat .ply, .ksplat, .spz, or .rad file."
		);
		this.name = "SplatFormatError";
	}
}

export function isSupportedSceneFile(fileName: string): boolean {
	return /\.(ply|ksplat|spz|rad)$/i.test(fileName);
}

/** Check the small SPZ header without decoding the full point cloud. */
async function validateSpzFile(file: File): Promise<void> {
	let header = new Uint8Array(await file.slice(0, 32).arrayBuffer());
	const gzip = header[0] === 0x1f && header[1] === 0x8b;
	if (gzip) {
		const reader = file
			.stream()
			.pipeThrough(new DecompressionStream("gzip"))
			.getReader();
		try {
			header = new Uint8Array(16);
			let offset = 0;
			while (offset < header.length) {
				const { value, done } = await reader.read();
				if (done) throw new Error("Incomplete SPZ header.");
				const count = Math.min(value.length, header.length - offset);
				header.set(value.subarray(0, count), offset);
				offset += count;
			}
		} catch {
			throw new Error("Invalid or truncated gzip-compressed SPZ file.");
		} finally {
			await reader.cancel().catch(() => undefined);
		}
	}
	if (header.length < (gzip ? 16 : 32))
		throw new Error("Incomplete SPZ header.");
	const view = new DataView(
		header.buffer,
		header.byteOffset,
		header.byteLength
	);
	if (view.getUint32(0, true) !== 0x5053474e)
		throw new Error("Invalid SPZ header.");
	const version = view.getUint32(4, true);
	if (gzip ? version < 1 || version > 3 : version !== 4)
		throw new Error(`Unsupported SPZ version: ${version}.`);
	if (view.getUint32(8, true) === 0)
		throw new Error("SPZ file contains no splats.");
	if (!gzip) {
		const streams = header[15];
		const tableOffset = view.getUint32(16, true);
		if (!streams || tableOffset < 32 || tableOffset + streams * 16 >= file.size)
			throw new Error("SPZ attribute data is truncated.");
	}
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
	} else if (/\.spz$/i.test(file.name)) {
		await validateSpzFile(file);
	} else if (/\.rad$/i.test(file.name)) {
		const bytes = await file.slice(0, 8).arrayBuffer();
		if (bytes.byteLength < 8 || new DataView(bytes).getUint32(0, true) !== 0x30444152)
			throw new Error("Invalid RAD header.");
		const metadataBytes = new DataView(bytes).getUint32(4, true);
		if (!metadataBytes || metadataBytes + 8 >= file.size)
			throw new Error("RAD file is truncated.");
	} else if (file.size < 4096) {
		throw new Error("KSPLAT file is truncated.");
	}
}
