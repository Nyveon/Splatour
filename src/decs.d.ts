declare module "@mkkellogg/gaussian-splats-3d" {
	import type { Object3D, Vector3 } from "three";

	export interface SplatSceneParams {
		path: string;
		[key: string]: unknown;
	}

	export interface SceneSettings {
		showLoadingUI: boolean;
		splatAlphaRemovalThreshold: number;
	}

	export class Viewer {
		addSplatBuffers(
			splatBuffers: SplatBuffer[],
			options: SceneSettings[]
		): Promise<void>;
	}

	export class DropInViewer {
		constructor(options?: DropInViewerOptions);
		addSplatScenes(
			scenes: SplatSceneParams[],
			showLoadingUI: boolean
		): Promise<void>;
		addSplatScene(scenePath: string, options: SceneSettings): Promise<void>;
		getSplatScene(index: number): Object3D;
		dispose(): Promise<void>;
		viewer: Viewer;
		getSceneCount(): number;
		splatMesh: {
			getSplatCount(): number;
		};
	}

	export interface DropInViewerOptions {
		sharedMemoryForWorkers?: boolean;
		logLevel?: number;
		dynamicScene?: boolean;
		sceneFadeInRateMultiplier?: number;
	}

	type SceneFormatType = 0 | 1 | 2 | 3 | null;

	export class LoaderUtils {
		static sceneFormatFromPath(path: string): SceneFormatType;
	}

	export class SplatBuffer {}

	export class SplatLoader {
		static loadFromFileData(
			splatFileData: ArrayBuffer,
			minimumAlpha: number,
			compressionLevel: number,
			optimizeSplatData: boolean,
			sectionSize: number,
			sceneCenter: Vector3,
			blockSize: number,
			bucketSize: number
		): Promise<SplatBuffer>;
	}

	export class KSplatLoader {
		static loadFromFileData(data: ArrayBuffer): Promise<SplatBuffer>;
	}
}
