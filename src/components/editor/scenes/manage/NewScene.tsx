import Button from "@/components/input/Button";
import { useGSStore } from "@/hooks/useGSStore";
import { fileToSplatBuffer, gssCreateBuffer } from "@/model/GSScene";
import { useState } from "react";
import SceneImport from "./SceneImport";
import SceneInclude from "./SceneInclude";

export default function NewScene() {
	const directoryHandle = useGSStore((state) => state.gsmap.directoryHandle);
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
				title={`${directoryHandle ? "Include" : "Import"} a new scene file`}
				icon="plus-circle"
				label={`${directoryHandle ? "Add" : "Import"} scene`}
				onClick={() => setModalOpen(true)}
			/>
			{directoryHandle ? (
				<SceneInclude
					isOpen={modalOpen}
					close={() => setModalOpen(false)}
					handleSplatSelect={(file) => void handleSplatSelect(file)}
					directoryHandle={directoryHandle}
				/>
			) : (
				<SceneImport
					isOpen={modalOpen}
					close={() => setModalOpen(false)}
					handleSplatSelect={(file) => void handleSplatSelect(file)}
				/>
			)}
		</>
	);
}
