import Button from "@/components/input/Button";
import FileSelector from "@/components/input/FileSelector";
import Modal from "@/components/Modal";
import { useGSStore } from "@/hooks/useGSStore";
import { gssCreateBuffer } from "@/model/GSScene";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import { useState } from "react";

function fileBufferToSplatBuffer(
	fileBufferData: ArrayBuffer,
	format: GaussianSplats3D.SceneFormat
): Promise<GaussianSplats3D.SplatBuffer> {
	if (format === GaussianSplats3D.SceneFormat.Ply) {
		throw new Error("Not yet implement, try with .ksplat");
		// return GaussianSplats3D.PlyLoader.loadFromFileData(
		// 	fileBufferData.data,
		// 	alphaRemovalThreshold,
		// 	compressionLevel,
		// 	true,
		// 	outSphericalHarmonicsDegree,
		// 	sectionSize,
		// 	sceneCenter,
		// 	blockSize,
		// 	bucketSize
		// );
	} else if (format === GaussianSplats3D.SceneFormat.Splat) {
		throw new Error("Not yet implement, try with .ksplat");
		// return GaussianSplats3D.SplatLoader.loadFromFileData(
		// 	fileBufferData.data,
		// 	alphaRemovalThreshold,
		// 	compressionLevel,
		// 	true,
		// 	sectionSize,
		// 	sceneCenter,
		// 	blockSize,
		// 	bucketSize
		// );
	} else if (format === GaussianSplats3D.SceneFormat.KSplat) {
		return GaussianSplats3D.KSplatLoader.loadFromFileData(fileBufferData);
	}
	throw new Error("Invalid format");
}

export default function NewScene() {
	const [modalOpen, setModalOpen] = useState(false);
	const setAddScene = useGSStore((state) => state.setAddScene);

	const handleSplatSelect = async (file: File) => {
		try {
			const fileName = file.name;
			const format = GaussianSplats3D.LoaderUtils.sceneFormatFromPath(fileName);

			if (!format) {
				//todo: toast
				console.error("Invalid file format");
				return;
			}

			const fileData = await file.arrayBuffer();

			const splatBufferPromise = fileBufferToSplatBuffer(fileData, format);

			const splatBuffer = await splatBufferPromise;

			const newGss = gssCreateBuffer(fileName, splatBuffer);

			setAddScene(newGss);

			setModalOpen(false);

			console.log("Done loading buffer");
		} catch (error) {
			//todo: toast
			console.error("File selection canceled or failed:", error);
		}
	};

	return (
		<>
			<Button
				title="Add new scene"
				icon="plus-circle"
				label="Add Scene"
				onClick={() => setModalOpen(true)}
			/>
			<Modal
				open={modalOpen}
				handleClose={() => setModalOpen(false)}
				title="Add a New Scene"
				description="Upload a gaussian splat scene file to start editing"
			>
				<FileSelector
					onFileSelect={(file: File) => void handleSplatSelect(file)}
					options={{
						//todo: could add "startIn" when working in a directory
						multiple: false,
						excludeAcceptAllOption: true,
						types: [
							{
								description: "Gaussian Splat Scene",
								accept: {
									"application/splat": [".ply", ".splat", ".ksplat"],
								},
							},
						],
					}}
				/>
			</Modal>
		</>
	);
}
