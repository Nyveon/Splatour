import * as THREE from "three";
import GS3dScene from "./GS3dScene.ts";

export default class GS3dMap {
    private scenes: GS3dScene[];

    constructor() {
        this.scenes = [];
    }

    registerGSScene(scene: GS3dScene): void {
        this.scenes.push(scene);
    }

    addAllToScene(scene: THREE.Scene): void {
        this.scenes.forEach((GSScene) => {
            GSScene.addToScene(scene);
        });
    }

    serialize(): string {
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