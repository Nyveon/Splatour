import * as THREE from "three";
import GS3dScene from "./GS3dScene.ts";
import GS3dViewer from "./GS3dViewer.ts";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";

const EXPORT_VERSION = 0;

export default class GS3dMap {
	parent: GS3dViewer | null = null;
	private viewer: any;
	private name: string;
	private scenes: GS3dScene[] = [];
	private worldScene: THREE.Scene = new THREE.Scene();

	constructor(name: string) {
		this.name = name;
		this.initializeViewer();
	}

	initializeViewer() {
		this.viewer = new GaussianSplats3D.DropInViewer({
			dynamicScene: true,
		});
	}

	async initializeSplats() {
		await Alpine.raw(this).viewer.addSplatScenes(
			this.scenes.map((scene) => scene.getSplatScene()),
			true
		);

		this.scenes.forEach((scene, index) => {
			scene.register(index, this.viewer);
			this.worldScene.add(scene.getContainer());
		});
	}

	registerGSScene(scene: GS3dScene): void {
		this.scenes.push(scene);
	}

	async deleteGSScene(sceneIndex: number) {
		this.parent?.pauseRenderLoop();

		this.scenes.forEach((scene, _) => {
			scene.getContainer().removeFromParent();
		});
		this.viewer.removeFromParent();
		this.scenes.splice(sceneIndex, 1);
		await this.viewer.dispose();

		this.initializeViewer();
		this.worldScene.add(this.viewer);
		await this.initializeSplats();

		this.parent?.resumeRenderLoop();
	}

	async addToScene(worldScene: THREE.Scene) {
		this.worldScene = worldScene;
		this.worldScene.add(this.viewer);
		await this.initializeSplats();
	}

	serialize(): string {
		return JSON.stringify({
            metadata: {
                version: EXPORT_VERSION,
                name: this.name,
            },
			scenes: this.scenes.map((scene) => scene.serialize()),
		});
	}

	static deserialize(json: string) {
		const obj = JSON.parse(json);
        console.log(obj);
		const map = new GS3dMap(obj.metadata.name);


		obj.scenes.forEach((scene: string) => {
			map.registerGSScene(GS3dScene.deserializeFromJSON(scene));
		});

		return map;
	}

	static deserializeFromJSON(obj: any) {
		const map = new GS3dMap(obj.metadata.name);

		obj.scenes.forEach((scene: string) => {
			map.registerGSScene(GS3dScene.deserializeFromJSON(scene));
		});

		return map;
	}
}
