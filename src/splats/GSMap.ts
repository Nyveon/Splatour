import { GSScene, SerialGSScene, gssDeserialize } from "./GSScene";

export interface SerialGSMap {
	metadata: {
		name: string;
	};
	scenes: SerialGSScene[];
}

export interface GSMap {
	name: string;
	scenes: GSScene[];
}

export function gsmDeserializeStringJSON(jsonString: string): GSMap {
	const json = JSON.parse(jsonString) as SerialGSMap;
	return gsmDeserializeObjectJSON(json);
}

export function gsmDeserializeObjectJSON(obj: SerialGSMap): GSMap {
	return {
		name: obj.metadata.name,
		scenes: obj.scenes.map((scene: SerialGSScene) => gssDeserialize(scene)),
	};
}

export function gsmCreateEmpty(): GSMap {
	return {
		name: "New Map",
		scenes: [],
	};
}

// export default class GSMap {
// 	name: string;
// 	scenes: GSScene[];

// 	private constructor(name: string, scenes: GSScene[]) {
// 		this.name = name;
// 		this.scenes = scenes;
// 	}

// 	static deserializeStringJSON(jsonString: string) {
// 		const json = JSON.parse(jsonString) as SerialGSMap;
// 		return GSMap.deserializeObjectJSON(json);
// 	}

// 	static deserializeObjectJSON(obj: SerialGSMap) {
// 		return new GSMap(
// 			obj.metadata.name,
// 			obj.scenes.map((scene: SerialGSScene) => GSScene.deserialize(scene))
// 		);
// 	}

// 	static createEmpty() {
// 		return new GSMap("New Map", []);
// 	}
// }
