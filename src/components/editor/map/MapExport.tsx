import Button from "@/components/input/Button";
import { useGSStore } from "@/hooks/useGSStore";
import { gsmSerialize } from "@/model/GSMap";
import { mapAssetsSubfolder } from "@/utils/constants";
import { fetchViewerTemplate } from "@/utils/exportViewer";
import {
	downloadFile,
	fileAsUint8Array,
	getAllFiles,
} from "@/utils/filesystem";
import { isSplitSpz, parseSpzParts } from "@/utils/spzParts";
import { toastError } from "@/utils/toasts";
import { strToU8, zip } from "fflate";

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
			if (isSplitSpz(scene.filePath)) {
				const manifest = parseSpzParts(await sceneFile.text());
				for (const part of manifest.parts) {
					const file = allFiles.find((file) => file.name === part.fileName);
					if (!file || file.size !== part.byteLength)
						throw new Error(`Missing or incomplete SPZ part: ${part.fileName}`);
					outputFolder[`${subfolder}/${part.fileName}`] =
						await fileAsUint8Array(file);
				}
			}
			for (const artifact of Object.values(scene.artifacts)) {
				const image = artifact.product?.image;
				if (!image || outputFolder[`${subfolder}/${image}`]) continue;
				const photo = allFiles.find((file) => file.name === image);
				if (!photo) throw new Error(`Product photo not found: ${image}`);
				outputFolder[`${subfolder}/${image}`] = await fileAsUint8Array(photo);
			}

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
		try {
			const outputFolder = await fetchViewerTemplate();
			await insertMapData(outputFolder);
			const data = await new Promise<Uint8Array>((resolve, reject) => {
				zip(outputFolder, (err, data) => {
					if (err) reject(err);
					else resolve(data);
				});
			});
			downloadFile(data, "test.zip", "application/zip");
		} catch (error) {
			toastError(
				`Map export failed: ${error instanceof Error ? error.message : String(error)}`
			);
		}
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
