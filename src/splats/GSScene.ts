export interface SerialGSScene {
	filePath: string;
	name: string;
	scale: { x: number; y: number; z: number };
	rotation: { a: number; b: number; c: number; d: number };
	position: { x: number; y: number; z: number };
}

export default class GSScene {
	filePath: string;
	name: string;
	scale: { x: number; y: number; z: number } = { x: 1, y: 1, z: 1 };
	rotation: { a: number; b: number; c: number; d: number } = {
		a: 0,
		b: 0,
		c: 0,
		d: 1,
	};
	position: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };

	constructor(filePath: string, name: string) {
		this.filePath = filePath;
		this.name = name;
	}

	getOptions() {
		return {
			scale: [this.scale.x, this.scale.y, this.scale.z],
			rotation: [
				this.rotation.a,
				this.rotation.b,
				this.rotation.c,
				this.rotation.d,
			],
			position: [this.position.x, this.position.y, this.position.z],
		};
	}

	static deserialize(scene: SerialGSScene): GSScene {
		const newScene = new GSScene(scene.filePath, scene.name);
		newScene.scale = scene.scale;
		// newScene.rotation = scene.rotation;
		newScene.position = scene.position;
		return newScene;
	}
}
