import Button from "@/components/input/Button";
import { useGSStore } from "@/hooks/useGSStore";
import { gsmSerialize } from "@/model/GSMap";
import { findMapFile, getAllFiles } from "@/utils/filesystem";

export default function MapSave() {
	const directoryHandle = useGSStore((state) => state.gsmap.directoryHandle);

	async function handleProjectSave() {
		if (!directoryHandle) {
			throw new Error("Project directory not found");
		}

		const files = await getAllFiles(directoryHandle);
		const mapFile = findMapFile(files);
		const mapFileName = mapFile.name;
		console.log(`Attempting to save ${mapFile.name}`);
		const fileHandle = await directoryHandle.getFileHandle(mapFileName);

		const mapData = useGSStore.getState().gsmap;
		const serializedMap = JSON.stringify(gsmSerialize(mapData));

		const writeable = await fileHandle.createWritable();
		await writeable.write(serializedMap);
		await writeable.close();
		console.log("Map file saved.");
		//todo: success toast
	}

	return (
		<Button
			title={
				directoryHandle
					? "Save changes to the map file"
					: "No project directory to save to"
			}
			label="Save"
			icon="save"
			variant={directoryHandle ? "primary" : "disabled"}
			onClick={() => void handleProjectSave()}
		/>
	);
}
