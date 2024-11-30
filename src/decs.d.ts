declare module "@mkkellogg/gaussian-splats-3d" {
	import * as THREE from "three";

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
		getSplatScene(index: number): THREE.Object3D;
		dispose(): Promise<void>;
		viewer: Viewer;
	}

	export interface DropInViewerOptions {
		sharedMemoryForWorkers?: boolean;
		logLevel?: number;
		dynamicScene?: boolean;
		sceneFadeInRateMultiplier?: number;
	}

	export enum SceneFormat {
		Ply = 0,
		Splat = 1,
		KSplat = 2,
	}

	type SceneFormatType = SceneFormat | null;

	export class LoaderUtils {
		static sceneFormatFromPath(path: string): SceneFormatType;
	}

	export class SplatBuffer {}


    // static loadFromFileData(splatFileData, minimumAlpha, compressionLevel, optimizeSplatData,
    // sectionSize, sceneCenter, blockSize, bucketSize)
    export class SplatLoader {
        static loadFromFileData(
            splatFileData: ArrayBuffer,
            minimumAlpha: number,
            compressionLevel: number,
            optimizeSplatData: boolean,
            sectionSize: number,
            sceneCenter: THREE.Vector3,
            blockSize: number,
            bucketSize: number
        ): Promise<SplatBuffer>;
    }

    export class KSplatLoader {
        static loadFromFileData(data: ArrayBuffer): Promise<SplatBuffer>;
    }
}
