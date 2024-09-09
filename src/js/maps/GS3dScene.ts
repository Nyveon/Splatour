import * as THREE from "three";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";

export default class GS3dScene {
	filePath: string;
	private scale: { x: number; y: number; z: number } = { x: 1, y: 1, z: 1 };
	private rotation: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
	private position: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
	private viewer: any;

	constructor(filePath: string) {
		this.viewer = new GaussianSplats3D.DropInViewer({
			sharedMemoryForWorkers: false, //todo: this should be configurable
			'gpuAcceleratedSort': true, //todo: this might not work on phones
		});

		this.filePath = filePath;
		this.viewer.addSplatScenes(
			[
				{
					path: filePath,
					scale: [1, 1, 1],
					position: [0, 0, 0],
					splatAlphaRemovalThreshold: 10, //todo: make configurable?
				},
			],
			true
		);

		console.log(`Scene created with file path: ${filePath}`);
	}

	setScale(x: number, y: number, z: number): void {
		this.scale = {
			x: x,
			y: y,
			z: z,
		};

		this.viewer.scale.set(this.scale.x, this.scale.y, this.scale.z);
	}

	getRotationDegrees(): { x: number; y: number; z: number } {
		return {
			x: THREE.MathUtils.radToDeg(this.rotation.x),
			y: THREE.MathUtils.radToDeg(this.rotation.y),
			z: THREE.MathUtils.radToDeg(this.rotation.z),
		};
	}

    setRotationRadians(x: number, y: number, z: number): void {
        this.rotation = {
            x: x,
            y: y,
            z: z,
        };

        this.viewer.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
    }

	setRotationDegrees(x: number, y: number, z: number): void {
		this.rotation = {
			x: THREE.MathUtils.degToRad(x),
			y: THREE.MathUtils.degToRad(y),
			z: THREE.MathUtils.degToRad(z),
		};

		this.viewer.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
	}

	getPosition(): { x: number; y: number; z: number } {
		return this.position;
	}

	setPosition(x: number, y: number, z: number): void {
		this.position = {
			x: x,
			y: y,
			z: z,
		};

		this.viewer.position.set(this.position.x, this.position.y, this.position.z);
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

    serialize(): string {
        return JSON.stringify({
            filePath: this.filePath,
            scale: this.scale,
            rotation: this.rotation,
            position: this.position,
        });
    }

    static deserialize(json: string): GS3dScene {
        const obj = JSON.parse(json);
        const scene = new GS3dScene(obj.filePath);
        scene.setScale(obj.scale.x, obj.scale.y, obj.scale.z);
        scene.setPosition(obj.position.x, obj.position.y, obj.position.z);
        scene.setRotationRadians(obj.rotation.x, obj.rotation.y, obj.rotation.z);
        return scene;
    }
}
