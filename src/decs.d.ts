declare module "@mkkellogg/gaussian-splats-3d" {
	import * as THREE from "three";

	export interface SplatSceneParams {
		path: string;
		[key: string]: unknown;
	}

	export class DropInViewer {
		constructor(options?: DropInViewerOptions);
		addSplatScenes(scenes: SplatSceneParams[], flag: boolean): Promise<void>;
		getSplatScene(index: number): THREE.Object3D;
		dispose(): void;
	}

	export interface DropInViewerOptions {
		sharedMemoryForWorkers?: boolean;
		logLevel?: number;
	}
}
