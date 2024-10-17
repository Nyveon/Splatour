import * as THREE from "three";
import GS3dScene from "./GS3dScene.ts";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";

export default class GS3dMap {
	private viewer: any;
	private scenes: GS3dScene[] = [];

	constructor() {
		this.viewer = new GaussianSplats3D.DropInViewer({
			dynamicScene: true,
		});
	}

	registerGSScene(scene: GS3dScene): void {
		this.scenes.push(scene);
	}

	addToScene(worldScene: THREE.Scene): void {
		this.viewer
			.addSplatScenes(
				this.scenes.map((scene) => scene.getSplatScene()),
				true
			)
			.then(() => {
				this.scenes.forEach((scene, index) => {
					scene.register(index, this.viewer);
					worldScene.add(scene.getContainer());
					console.log("here");
				});
			});

		worldScene.add(this.viewer);
	}

	serialize(): string {
        //todo: serialization is wrong D:
		return JSON.stringify({
			scenes: this.scenes.map((scene) => scene.serialize()),
		});
	}

	static deserialize(json: string) {
		const obj = JSON.parse(json);
		const map = new GS3dMap();

		obj.scenes.forEach((scene: string) => {
			map.registerGSScene(GS3dScene.deserialize(scene));
		});

		return map;
	}
}
