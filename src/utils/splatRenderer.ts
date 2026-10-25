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
		enableLod: false,
		accumExtSplats: true,
		// Covariances preserve independent X/Y/Z scaling in existing maps.
		covSplats: true,
		// Keep splats behind the previous view available during fast camera turns.
		// Z-depth sorting drops them until the asynchronous sorter catches up.
		sortRadial: true,
	});
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
				: undefined;
	const mesh = new SplatMesh({
		...(fileBytes ? { fileBytes, fileName: filePath } : { url: filePath }),
		fileType,
		extSplats: true,
		covSplats: true,
		lod: false,
		enableLod: false,
		// Scene collision and interaction use the project's explicit node geometry.
		raycastable: false,
	});
	mesh.name = `Splat scene: ${filePath}`;
	mesh.maxSh = 3;
	return mesh;
}
