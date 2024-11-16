import * as THREE from "three";

export default class GS3dScene {
	filePath: string;
    name: string;
	private scale: { x: number; y: number; z: number } = { x: 1, y: 1, z: 1 };
	private rotation: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
	private position: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };

	private container: THREE.Group;
	private visibility: boolean = true;
	sceneIndex: number = -1;

	constructor(filePath: string, name: string) {
		this.filePath = filePath;
        this.name = name;
		this.container = new THREE.Group();
	}

	register(index: number, viewer: any): void {
		this.sceneIndex = index;
		this.container.add(viewer.getSplatScene(index));
		this.updateContainer();
	}

	getContainer(): THREE.Group {
		return this.container;
	}

	updateContainer(): void {
		if (this.sceneIndex !== -1) {
			this.container.scale.set(this.scale.x, this.scale.y, this.scale.z);
			this.container.position.set(
				this.position.x,
				this.position.y,
				this.position.z
			);
			this.container.rotation.set(
				this.rotation.x,
				this.rotation.y,
				this.rotation.z
			);
			this.container.visible = this.visibility;
		}
	}

	setScale(x: number, y: number, z: number): void {
		this.scale = {
			x: x,
			y: y,
			z: z,
		};

		this.updateContainer();
	}

    setLinkedScale(scale: number): void {
        this.scale = {
            x: scale,
            y: scale,
            z: scale,
        };

        this.updateContainer();
    }

    updateLinkedScale(delta: number): void {
        this.scale = {
            x: this.scale.x + delta,
            y: this.scale.x + delta,
            z: this.scale.x + delta,
        };

        this.updateContainer();
    }

    getScale(): { x: number; y: number; z: number } {
        return this.scale;
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

		this.updateContainer();
	}

	setRotationDegrees(x: number, y: number, z: number): void {
		this.rotation = {
			x: THREE.MathUtils.degToRad(x),
			y: THREE.MathUtils.degToRad(y),
			z: THREE.MathUtils.degToRad(z),
		};

		this.updateContainer();
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

		this.updateContainer();
	}

	getSplatScene(): any {
		return {
			path: this.filePath,
			scale: [1, 1, 1],
			position: [0, 0, 0],
			splatAlphaRemovalThreshold: 20,
		};
	}

	setVisibility(visible: boolean): void {
		this.visibility = visible;
		this.updateContainer();
	}

	toggleVisibility(): void {
		this.visibility = !this.visibility;
		this.updateContainer();
	}

	serialize(): Object {
		return {
            name: this.name,
			filePath: this.filePath,
			scale: this.scale,
			rotation: this.rotation,
			position: this.position,
		};
	}

	static deserialize(json: string): GS3dScene {
		const obj = JSON.parse(json);
		const scene = new GS3dScene(obj.filePath, obj.name);
		scene.setScale(obj.scale.x, obj.scale.y, obj.scale.z);
		scene.setPosition(obj.position.x, obj.position.y, obj.position.z);
		scene.setRotationRadians(obj.rotation.x, obj.rotation.y, obj.rotation.z);
		return scene;
	}

    static deserializeFromJSON(obj: any): GS3dScene {
        const scene = new GS3dScene(obj.filePath, obj.name);
        scene.setScale(obj.scale.x, obj.scale.y, obj.scale.z);
        scene.setPosition(obj.position.x, obj.position.y, obj.position.z);
        scene.setRotationRadians(obj.rotation.x, obj.rotation.y, obj.rotation.z);
        return scene;
    }
}
