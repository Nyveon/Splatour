import Button from "@/components/input/Button";
import Modal from "@/components/Modal";
import { useState } from "react";

export default function MapImport() {
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<>
			<Button
				title="Import a map file"
				label="Upload"
				icon="upload"
				onClick={() => setModalOpen(true)}
			/>
			<Modal
				open={modalOpen}
				handleClose={() => setModalOpen(false)}
				title="Load a GS3DMap file"
				description="Upload a GS3DMap JSON file to start editing"
			>
				<input type="file" id="fileInput" accept=".json" x-ref="fileInput" />
				<Button title="Confirm and upload" icon="upload" label="Upload" />
			</Modal>
		</>
	);
}
