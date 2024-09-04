import * as THREE from 'three';
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';

export default class Scene {
    filePath: string;
    private scaleX: number; //todo: make a vector type?
    private scaleY: number;
    private scaleZ: number;
    private rotationX: number;
    private rotationY: number;
    private rotationZ: number;
    private positionX: number;
    private positionY: number;
    private positionZ: number;
    private viewer: any;

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

    setScale(x: number, y: number, z: number): void {
        this.scaleX = x;
        this.scaleY = y;
        this.scaleZ = z;

        this.viewer.scale.set(this.scaleX, this.scaleY, this.scaleZ);
    }

    setRotationDegrees(x: number, y: number, z: number): void {
        this.rotationX = THREE.MathUtils.degToRad(x);
        this.rotationY = THREE.MathUtils.degToRad(y);
        this.rotationZ = THREE.MathUtils.degToRad(z);

        this.viewer.rotation.set(x, y, z);
    }

    setPosition(x: number, y: number, z: number): void {
        this.positionX = x;
        this.positionY = y;
        this.positionZ = z;

        this.viewer.position.set(x, y, z);
    }

    addToScene(scene: THREE.Scene): void {
        scene.add(this.viewer);
    }

    setVisibility(visible: boolean): void {
        this.viewer.visible = visible;
    }

    toggleVisibility(): void {
        this.viewer.visible = !this.viewer.visible;
    }

    getRotation(): { x: number, y: number, z: number } {
        return {
            x: THREE.MathUtils.radToDeg(this.rotationX),
            y: THREE.MathUtils.radToDeg(this.rotationY),
            z: THREE.MathUtils.radToDeg(this.rotationZ)
        };
    }

    getPosition(): { x: number, y: number, z: number } {
        return {
            x: this.positionX,
            y: this.positionY,
            z: this.positionZ
        };
    }
}