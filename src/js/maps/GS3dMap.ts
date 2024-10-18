import * as THREE from "three";
import GS3dScene from "./GS3dScene.ts";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";

export default class GS3dMap {
	private viewer: any;
    private name: string;
	private scenes: GS3dScene[] = [];

	constructor(name: string) {
		this.viewer = new GaussianSplats3D.DropInViewer({
			dynamicScene: true,
		});
        this.name = name;
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
            name: this.name,
			scenes: this.scenes.map((scene) => scene.serialize()),
		});
	}

	static deserialize(json: string) {
		const obj = JSON.parse(json);
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
