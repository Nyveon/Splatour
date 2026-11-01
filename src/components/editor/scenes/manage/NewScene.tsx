import Button from "@/components/input/Button";
import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions } from "@/hooks/useInteractions";
import { gssCreateFromFile, validateSceneFile } from "@/model/GSScene";
import { toastError, toastSuccess, toastUnknownError } from "@/utils/toasts";
import { useState } from "react";
import SceneImport from "./SceneImport";
import SceneInclude from "./SceneInclude";

export default function NewScene() {
	const directoryHandle = useGSStore((state) => state.gsmap.directoryHandle);
	const [modalOpen, setModalOpen] = useState(false);
	const setAddScene = useGSStore((state) => state.setAddScene);

	const handleSplatSelect = async (file: File) => {
		try {
			await validateSceneFile(file);
			const newGss = gssCreateFromFile(file);
			setAddScene(newGss);
			useInteractions.getState().setCurrentSceneId(newGss.id);
			setModalOpen(false);
			toastSuccess("Scene added");
		} catch (error) {
			if (!(error instanceof Error)) {
				toastUnknownError();
				return;
			}

			toastError(`Error loading scene: ${error.message}`);
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
