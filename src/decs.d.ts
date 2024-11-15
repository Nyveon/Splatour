declare module "@mkkellogg/gaussian-splats-3d" {
	export interface SplatSceneParams {
		path: string;
		[key: string]: unknown;
	}

	export class DropInViewer {
		constructor(options?: DropInViewerOptions);
		addSplatScenes(scenes: SplatSceneParams[], flag: boolean): Promise<void>;
		dispose(): void;
	}

	export interface DropInViewerOptions {
		sharedMemoryForWorkers?: boolean;
	}
}
