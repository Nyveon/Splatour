import { SparkRenderer, SplatFileType, SplatMesh } from "@sparkjsdev/spark";
import type { WebGLRenderer } from "three";

export function createSplatRenderer(
	renderer: WebGLRenderer,
	onDirty?: () => void
): SparkRenderer {
	const spark = new SparkRenderer({
		renderer,
		onDirty,
		minAlpha: 1 / 255,
		enableLod: true,
		lodTraverseMode: "dynamic",
		minSortIntervalMs: 33,
		lodSplatScale: 1,
		lodRenderScale: 2,
		coneFov0: 140,
		coneFov: 170,
		coneFoveate: 0.75,
		behindFoveate: 0.5,
		// Interaction uses map nodes instead of splat raycasting.
		lodRaycast: 0,
		accumExtSplats: true,
		// Covariances preserve independent X/Y/Z scaling in existing maps.
		covSplats: true,
		// Keep splats behind the previous view available during fast camera turns.
		// Z-depth sorting drops them until the asynchronous sorter catches up.
		sortRadial: true,
	});
	spark.lodSplatCount = Math.min(spark.defaultSplatTarget(), 750_000);
	spark.name = "Splatour Spark renderer";
	return spark;
}

/** Preserve source coordinates, SH bands, and all source splats. */
export function createSplatMesh(
	filePath: string,
	fileBytes?: ArrayBuffer
): SplatMesh {
	const extension = filePath
		.split(/[?#]/, 1)[0]
		.split(".")
		.pop()
		?.toLowerCase();
	const fileType =
		extension === "ply"
			? SplatFileType.PLY
			: extension === "ksplat"
				? SplatFileType.KSPLAT
				: extension === "spz"
					? SplatFileType.SPZ
					: extension === "rad"
						? SplatFileType.RAD
						: undefined;
	const mesh = new SplatMesh({
		...(fileBytes ? { fileBytes, fileName: filePath } : { url: filePath }),
		fileType,
		extSplats: true,
		covSplats: true,
		// RAD already contains its LOD hierarchy.
		lod: fileType !== SplatFileType.RAD,
		// Fetch complete scenes upfront.
		paged: false,
		lodAbove: 250_000,
		// LOD leaves already contain the original splats.
		nonLod: false,
		enableLod: true,
		// Scene collision and interaction use the project's explicit node geometry.
		raycastable: false,
	});
	mesh.name = `Splat scene: ${filePath}`;
	mesh.maxSh = 3;
	return mesh;
}
