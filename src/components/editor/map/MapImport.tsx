import Button from "@/components/input/Button";
import DirectorySelector from "@/components/input/DirectorySelector";
import Modal from "@/components/Modal";
import { useGSStore } from "@/hooks/useGSStore";
import { fileToSplatBuffer } from "@/model/GSScene";
import {
	findAndReadMapFile,
	getAllFiles,
	verifySceneFilePresence,
} from "@/utils/filesystem";
import { toastError, toastSuccess, toastUnknownError } from "@/utils/toasts";
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
		try {
			const files = await getAllFiles(directoryHandle);
			const gsmap = await findAndReadMapFile(files);
			verifySceneFilePresence(files, gsmap);

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
				} catch (err) {
					throw new Error(`Failed to load scene buffer: ${filePath}, ${err}`);
				}
			}

			gsmap.directoryHandle = directoryHandle;
			setGSMap(gsmap);
			console.log("Loaded GSMap");

			setModalOpen(false);
            toastSuccess("GSMap loaded successfully");
		} catch (error) {
			if (!(error instanceof Error)) {
				toastUnknownError();
				return;
			}

			toastError(`Error loading GSMap: ${error.message}`);
		}
	};

	return (
		<>
			<Button
				title="Select and import a project directory"
				icon="upload"
				label="Load"
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
