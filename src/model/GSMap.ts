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
	};
	scenes: SerialGSScene[];
}

export interface GSMap {
	name: string;
	scenes: Record<string, GSScene>;
	directoryHandle?: FileSystemDirectoryHandle;
}

export function gsmDeserializeStringJSON(jsonString: string): GSMap {
	const json = JSON.parse(jsonString) as SerialGSMap;
	return gsmDeserializeObjectJSON(json);
}

export function gsmDeserializeObjectJSON(obj: SerialGSMap): GSMap {
	return {
		name: obj.metadata.name,
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
		},
		scenes: Object.values(map.scenes).map(gssSerialize),
	};
}

export function gsmCreateEmpty(): GSMap {
	return {
		name: "New Map",
		scenes: {},
	};
}
