import Button from "@/components/input/Button";
import DirectorySelector from "@/components/input/DirectorySelector";
import Modal from "@/components/Modal";
import { useGSStore } from "@/hooks/useGSStore";
import { gsmDeserializeStringJSON } from "@/model/GSMap";
import { fileToSplatBuffer } from "@/model/GSScene";
import { getAllFiles } from "@/utils/filesystem";
import { useState } from "react";

/*
todo:
* 1. Select a directory
* 2. Read all files in the directory
3. If there is a map file, load it
4. Refactor buffer loading to request the files from that same directory
5. Refactor new scene to look in this directory by default
*/

export default function MapImport() {
	const [modalOpen, setModalOpen] = useState(false);
	const setGSMap = useGSStore((state) => state.setGSMap);

	const handleDirectorySelect = async (
		directoryHandle: FileSystemDirectoryHandle
	) => {
		const files = await getAllFiles(directoryHandle);

		const jsonFiles = files.filter((file) => file.name.endsWith(".json"));

		if (jsonFiles.length < 1) {
			console.error("No JSON files found in directory");
			return;
		} else if (jsonFiles.length > 1) {
			console.error("Multiple JSON files found in directory");
			return;
		}

		const mapFile = jsonFiles[0];
		const mapData = await mapFile.text();

		let gsmap;

		try {
			gsmap = gsmDeserializeStringJSON(mapData);
			console.log(gsmap);
		} catch {
			console.error("Invalid or corrupted GSMap JSON file format");
			return;
		}

		// Check that all scene files are present
		for (const scene of Object.values(gsmap.scenes)) {
			const filePath = scene.filePath;
			if (!files.find((file) => file.name === filePath)) {
				console.error(`Scene file not found: ${filePath}`);
				return;
			}
		}

		// Buffer all scenes
		for (const sceneId of Object.keys(gsmap.scenes)) {
			const filePath = gsmap.scenes[sceneId].filePath;

			try {
				const file = files.find((file) => file.name === filePath);
				if (!file) {
					throw new Error(`Scene file not found: ${filePath}`);
				}

				const splatBuffer = await fileToSplatBuffer(file);
				gsmap.scenes[sceneId].buffer = splatBuffer;
			} catch {
				console.error(`Failed to load scene buffer: ${filePath}`);
				return;
			}
		}

		gsmap.directoryHandle = directoryHandle;
		setGSMap(gsmap);
		console.log("Loaded GSMap");

		setModalOpen(false);
	};

	return (
		<>
			<Button
				title="Import a map file"
				icon="upload"
				label="Upload"
				onClick={() => setModalOpen(true)}
			/>
			<Modal
				open={modalOpen}
				handleClose={() => setModalOpen(false)}
				title="Load a GS3DMap project"
				description="Select a directory containing the project JSON and assets"
			>
				<DirectorySelector
					onDirectorySelect={(directoryHandle: FileSystemDirectoryHandle) =>
						void handleDirectorySelect(directoryHandle)
					}
				/>
			</Modal>
		</>
	);
}
