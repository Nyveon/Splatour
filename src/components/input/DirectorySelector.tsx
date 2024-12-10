import { toastError, toastUnknownError } from "@/utils/toasts";
import styled from "@emotion/styled";
import Button from "./Button";

const FileSelectorWrapper = styled.div`
	display: flex;
	gap: 0.5rem;
`;

export default function FileSelector({
	onDirectorySelect,
	options,
}: {
	onDirectorySelect: (directory: FileSystemDirectoryHandle) => void;
	options?: DirectoryPickerOptions;
}) {
	const handleFileSelection = async () => {
		try {
			const directoryHandle = await window.showDirectoryPicker(options ?? {});

			onDirectorySelect(directoryHandle);
		} catch (error) {
			if (!(error instanceof Error)) {
				toastUnknownError();
				return;
			}

			switch (error?.name) {
				case "AbortError":
					toastError("Directory selection cancelled");
					break;
				case "NotAllowedError":
					toastError("Directory permission denied");
					break;
				case "NotFoundError":
					toastError("Directory not found");
					break;
				default:
					toastError(`Error selecting directory: ${error.message}`);
					break;
			}
			console.error("Directory selection canceled or failed:", error);
		}
	};

	return (
		<FileSelectorWrapper>
			<Button
				title="Chose a folder"
				label="Choose Directory"
				icon="folder"
				onClick={() => void handleFileSelection()}
			/>
			<span>No folder selected</span>
		</FileSelectorWrapper>
	);
}
