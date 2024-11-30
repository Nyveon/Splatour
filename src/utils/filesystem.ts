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
