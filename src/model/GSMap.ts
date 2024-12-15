import { formatVersion } from "@/utils/constants";
import {
	GSScene,
	SerialGSScene,
	gssDeserialize,
	gssSerialize,
} from "./GSScene";

export interface SerialGSMap {
	metadata: {
		name: string;
		version: number;
		defaultScene: string;
	};
	scenes: SerialGSScene[];
}

export interface GSMap {
	name: string;
	scenes: Record<string, GSScene>;
	directoryHandle?: FileSystemDirectoryHandle;
	defaultScene: string;
}

export function gsmDeserializeStringJSON(jsonString: string): GSMap {
	const json = JSON.parse(jsonString) as SerialGSMap;
	return gsmDeserializeObjectJSON(json);
}

export function gsmDeserializeObjectJSON(obj: SerialGSMap): GSMap {
	return {
		name: obj.metadata.name,
		defaultScene: obj.metadata.defaultScene,
		scenes: obj.scenes.reduce(
			(acc, scene) => {
				const deserialized = gssDeserialize(scene);
				acc[deserialized.id] = deserialized;
				return acc;
			},
			{} as Record<string, GSScene>
		),
	};
}

export function gsmSerialize(map: GSMap): SerialGSMap {
	return {
		metadata: {
			name: map.name,
			version: formatVersion,
			defaultScene: map.defaultScene,
		},
		scenes: Object.values(map.scenes).map(gssSerialize),
	};
}

export function gsmCreateEmpty(): GSMap {
	return {
		name: "New Map",
		defaultScene: "",
		scenes: {},
	};
}
