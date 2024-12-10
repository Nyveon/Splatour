import { toastError, toastUnknownError } from "@/utils/toasts";
import styled from "@emotion/styled";
import Button from "./Button";

const FileSelectorWrapper = styled.div`
	display: flex;
	gap: 0.5rem;
`;

export default function FileSelector({
	onFileSelect,
	options,
}: {
	onFileSelect: (file: File) => void;
	options?: OpenFilePickerOptions;
}) {
	const handleFileSelection = async () => {
		try {
			const [fileHandle] = await window.showOpenFilePicker(options ?? {});
			const file = await fileHandle.getFile();
			onFileSelect(file);
		} catch (error) {
			if (!(error instanceof Error)) {
				toastUnknownError();
				return;
			}

			switch (error?.name) {
				case "AbortError":
					toastError("File selection cancelled");
					break;
				case "NotAllowedError":
					toastError("File permission denied");
					break;
				case "NotFoundError":
					toastError("File not found");
					break;
				default:
					toastError(`Error selecting file: ${error.message}`);
					break;
			}

            console.error("File selection canceled or failed:", error);
		}
	};

	return (
		<FileSelectorWrapper>
			<Button
				title="Chose a file"
				label="Choose File"
				icon="file"
				onClick={() => void handleFileSelection()}
			/>
			<span>No file selected</span>
		</FileSelectorWrapper>
	);
}
