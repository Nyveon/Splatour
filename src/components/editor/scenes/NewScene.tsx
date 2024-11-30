import Button from "@/components/input/Button";
import FileSelector from "@/components/input/FileSelector";
import Modal from "@/components/Modal";
import { useGSStore } from "@/hooks/useGSStore";
import { fileToSplatBuffer, gssCreateBuffer } from "@/model/GSScene";
import { useState } from "react";

export default function NewScene() {
	const [modalOpen, setModalOpen] = useState(false);
	const setAddScene = useGSStore((state) => state.setAddScene);

	const handleSplatSelect = async (file: File) => {
		try {
			const splatBuffer = await fileToSplatBuffer(file);

			const newGss = gssCreateBuffer(file.name, splatBuffer);

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
