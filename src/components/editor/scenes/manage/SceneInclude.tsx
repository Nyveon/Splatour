import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import { getAllFiles } from "@/utils/filesystem";
import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import { Button as BaseButton } from "@headlessui/react";
import { useEffect, useState } from "react";

const FileList = styled.ul`
	display: flex;
	flex-direction: column;
	width: 100%;
`;

const FileListItem = styled.li`
	width: 100%;
`;

const FileButton = styled(BaseButton)<{ onClick: () => void }>`
	display: flex;
	align-items: center;
	width: 100%;
	gap: 0.5rem;
	padding: 0.5rem;
	margin: 0;

	border-left: none;
	border-right: none;
	border-bottom: none;
	border-top: thin solid ${color.borderHalf};
	border-radius: 0.25rem;

	font-family: inherit;
	font-size: inherit;
	font-style: inherit;
	font-weight: inherit;
	line-height: inherit;

	background-color: transparent;

	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;

	&:last-child {
		border-bottom: thin solid ${color.borderHalf};
	}

	&:hover {
		cursor: pointer;
		color: ${color.textLight};
		background-color: ${color.primaryLight};
	}
`;

export default function SceneInclude({
	isOpen,
	close,
	handleSplatSelect,
	directoryHandle,
}: {
	isOpen: boolean;
	close: () => void;
	handleSplatSelect: (file: File) => void;
	directoryHandle: FileSystemDirectoryHandle;
}) {
	const [files, setFiles] = useState<File[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		if (directoryHandle && isOpen) {
			setLoading(true);
			getAllFiles(directoryHandle)
				.then((retrievedFiles) => {
					const filteredFiles = retrievedFiles.filter(
						(file) =>
							file.name.endsWith(".splat") ||
							file.name.endsWith(".ksplat") ||
							file.name.endsWith(".ply")
					);
					setFiles(filteredFiles);
				})
				.catch((error) => {
					console.error("Error retrieving files", error);
					setFiles([]);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [directoryHandle, isOpen]);

	if (!directoryHandle) {
		return (
			<>
				<Modal
					open={isOpen}
					handleClose={() => close()}
					title="Error"
					description="Project directory does not exist or could not be found"
				></Modal>
			</>
		);
	}

	return (
		<>
			<Modal
				open={isOpen}
				handleClose={() => close()}
				title="Include a New Scene"
				description="Select a gaussian splat scene file to add and edit"
			>
				{loading ? (
					<p>Loading files...</p>
				) : files.length > 0 ? (
					<FileList>
						{files.map((file, index) => (
							<FileListItem key={index}>
								<FileButton
									onClick={() => {
										handleSplatSelect(file);
										close();
									}}
								>
									<Icon icon="file" />
									{file.name}
								</FileButton>
							</FileListItem>
						))}
					</FileList>
				) : (
					<p>Directory is empty...</p>
				)}
			</Modal>
		</>
	);
}
