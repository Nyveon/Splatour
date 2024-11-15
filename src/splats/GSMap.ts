import GSScene, { SerialGSScene } from "./GSScene";

interface SerialGSMap {
	name: string;
	scenes: SerialGSScene[];
}

export default class GSMap {
	name: string;
	scenes: GSScene[];

	private constructor(name: string, scenes: GSScene[]) {
		this.name = name;
		this.scenes = scenes;
	}

	static deserializeStringJSON(jsonString: string) {
		const json = JSON.parse(jsonString);
		return GSMap.deserializeObjectJSON(json);
	}

	static deserializeObjectJSON(obj: SerialGSMap) {
		return new GSMap(
			obj.name,
			obj.scenes.map((scene: SerialGSScene) => GSScene.deserialize(scene)),
		);
	}
}
