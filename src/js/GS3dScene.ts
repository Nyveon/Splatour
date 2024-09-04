import * as THREE from 'three';
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';

export default class Scene {
    filePath: string;
    scaleX: number; //todo: make a vector type?
    scaleY: number;
    scaleZ: number;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
    positionX: number;
    positionY: number;
    positionZ: number;
    viewer: any; // DropInViewer

    constructor(filePath: string) {
        this.viewer = new GaussianSplats3D.DropInViewer({
            'sharedMemoryForWorkers': false, //todo: this should be configurable
            // 'gpuAcceleratedSort': true //todo: this should be on?
        });

        this.filePath = filePath;
        this.viewer.addSplatScenes([
            {
                'path': filePath,
                'scale': [1, 1, 1],
                'position': [0, 0, 0],
                'splatAlphaRemovalThreshold': 5 //todo: make configurable?
            }
        ], true);

        console.log(`Scene created with file path: ${filePath}`);
    }

    setScale(x: number, y: number, z: number) {
        this.scaleX = x;
        this.scaleY = y;
        this.scaleZ = z;

        this.viewer.scale.set(x, y, z);
    }

    setRotationDegrees(x: number, y: number, z: number) {
        this.rotationX = THREE.MathUtils.degToRad(x);
        this.rotationY = THREE.MathUtils.degToRad(y);
        this.rotationZ = THREE.MathUtils.degToRad(z);

        this.viewer.rotation.set(x, y, z);
    }

    setPosition(x: number, y: number, z: number) {
        this.positionX = x;
        this.positionY = y;
        this.positionZ = z;

        this.viewer.position.set(x, y, z);
    }

    addToScene(scene: THREE.Scene) {
        scene.add(this.viewer);
    }
}