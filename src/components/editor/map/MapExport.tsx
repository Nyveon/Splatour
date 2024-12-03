import Button from "@/components/input/Button";
import { useGSStore } from "@/hooks/useGSStore";
import { gsmSerialize } from "@/model/GSMap";
import { mapAssetsSubfolder } from "@/utils/constants";
import {
	downloadFile,
	fetchAsUint8Array,
	fileAsUint8Array,
	getAllFiles,
} from "@/utils/filesystem";
import { strToU8, zip } from "fflate";

async function insertViewerTemplate(outputFolder: Record<string, Uint8Array>) {
	const basePath = "./export";
	const viewerFiles = [
		"assets/index.css",
		"assets/index.js",
		"assets/main.woff2",
		"coi.js",
		"index.html",
	];

	for (const fileName of viewerFiles) {
		const filePath = `${basePath}/${fileName}`;
		outputFolder[fileName] = await fetchAsUint8Array(filePath);
	}
}

export default function MapExport() {
	const directoryHandle = useGSStore((state) => state.gsmap.directoryHandle);

	async function insertMapData(outputFolder: Record<string, Uint8Array>) {
		if (!directoryHandle) {
			throw new Error("Project directory not found");
		}

		const subfolder = mapAssetsSubfolder;
		const allFiles = await getAllFiles(directoryHandle);
		const originalGSMap = useGSStore.getState().gsmap;
		const gsmap = {
			...originalGSMap,
			scenes: {
				...originalGSMap.scenes,
			},
		};

		for (const [sceneId, scene] of Object.entries(gsmap.scenes)) {
			const sceneFile = allFiles.find((file) => file.name === scene.filePath);

			if (!sceneFile) {
				throw new Error(`Scene file not found: ${scene.filePath}`);
			}

			outputFolder[`${subfolder}/${scene.filePath}`] =
				await fileAsUint8Array(sceneFile);

			// temporary modification of gsmap scene file paths
			gsmap.scenes[sceneId] = {
				...scene,
				filePath: `./${subfolder}/${scene.filePath}`,
			};
		}

		const gsmapSerialized = JSON.stringify(gsmSerialize(gsmap));
		const gsmapBuffer = strToU8(gsmapSerialized);

		outputFolder[`${subfolder}/gsmap.json`] = gsmapBuffer;
	}

	async function exportMap() {
		const outputFolder: Record<string, Uint8Array> = {};

		//todo: configurable inclusion of viewer template
		await insertViewerTemplate(outputFolder);
		await insertMapData(outputFolder);

		console.log(outputFolder);

		zip(outputFolder, (err, data) => {
			if (err) {
				throw new Error("Compression failed");
			}

			downloadFile(data, "test.zip", "application/zip");
		});
	}

	return (
		<Button
			title={
				directoryHandle
					? "Export the project as a website .zip file"
					: "Can't export without a project directory"
			}
			label="Export"
			icon="download"
			variant={directoryHandle ? "primary" : "disabled"}
			onClick={() => void exportMap()}
		/>
	);
}
