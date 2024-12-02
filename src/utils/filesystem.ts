import type { GSMap } from "@/model/GSMap";
import { gsmDeserializeStringJSON } from "@/model/GSMap";

/**
 * Get's all files in a folder (as promises)
 * @param directoryHandle folder
 * @returns Array of promises of files
 */
export async function getAllFiles(directoryHandle: FileSystemDirectoryHandle) {
	const promises = [];
	for await (const entry of directoryHandle.values()) {
		if (entry.kind !== "file") {
			continue;
		}
		promises.push(entry.getFile());
	}
	return await Promise.all(promises);
}

/**
 * Finds the map file in a directory, errors if none or too many. Does not verify format.
 * @param files project files
 * @returns json file (potentially the map)
 */
export function findMapFile(files: File[]): File {
	const jsonFiles = files.filter((file) => file.name.endsWith(".json"));

	if (jsonFiles.length < 1) {
		throw new Error("No JSON files found in directory");
	} else if (jsonFiles.length > 1) {
		throw new Error("Multiple JSON files found in directory");
	}

	return jsonFiles[0];
}

/**
 * If a single map file is present, deserializes and returns it. Otherwise errors out.
 * @param files project files
 * @returns the GSMap
 */
export async function findAndReadMapFile(files: File[]): Promise<GSMap> {
	const mapFile = findMapFile(files);
	const mapData = await mapFile.text();

	try {
		return gsmDeserializeStringJSON(mapData);
	} catch (err) {
		throw new Error(`Invalid or corrupted GSMap JSON file format: ${err}`);
	}
}

/**
 * Checks that all scene files of a map are present in the project directory
 * @param files Project files
 * @param gsmap Map object
 */
export function verifySceneFilePresence(files: File[], gsmap: GSMap) {
	const missing = [];

	for (const scene of Object.values(gsmap.scenes)) {
		const filePath = scene.filePath;
		if (!files.find((file) => file.name === filePath)) {
			missing.push(filePath);
		}
	}

	if (missing.length) {
		const missingList = missing.join(", ");
		throw new Error(
			`Missing scene file/s in project directory: ${missingList}`
		);
	}
}
