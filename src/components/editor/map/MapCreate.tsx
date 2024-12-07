import Button from "@/components/input/Button";
import DirectorySelector from "@/components/input/DirectorySelector";
import Modal from "@/components/Modal";
import { useGSStore } from "@/hooks/useGSStore";
import { gsmCreateEmpty, gsmSerialize } from "@/model/GSMap";
import { getAllFiles } from "@/utils/filesystem";
import { useState } from "react";

export default function MapCreate() {
	const [modalOpen, setModalOpen] = useState(false);
	const setGSMap = useGSStore((state) => state.setGSMap);

	const handleDirectorySelect = async (
		directoryHandle: FileSystemDirectoryHandle
	) => {
		const files = await getAllFiles(directoryHandle);

		if (files.length > 0) {
			throw new Error(`Selected folder is not empty`);
		}

		const blankMap = gsmCreateEmpty();

		try {
			const mapFileHandle = await directoryHandle.getFileHandle("map.json", {
				create: true,
			});
			const serializedMap = JSON.stringify(gsmSerialize(blankMap));
			const writeable = await mapFileHandle.createWritable();
			await writeable.write(serializedMap);
			await writeable.close();
		} catch (err) {
			console.error(`Failed to create map file: ${err}`);
			return;
		}

		blankMap.directoryHandle = directoryHandle;
		setGSMap(blankMap);
		setModalOpen(false);
	};

	return (
		<>
			<Button
				title="Create a new (blank) map"
				label="Create"
				icon="file-plus"
				onClick={() => setModalOpen(true)}
			/>
			<Modal
				open={modalOpen}
				handleClose={() => setModalOpen(false)}
				title="Create a new map"
				description="Create a new map by selecting or creating an empty folder on your computer"
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
