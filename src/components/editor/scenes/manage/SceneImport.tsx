import FileSelector from "@/components/input/FileSelector";
import Modal from "@/components/Modal";

export default function SceneImport({
	isOpen,
	close,
	handleSplatSelect,
}: {
	isOpen: boolean;
	close: () => void;
	handleSplatSelect: (file: File) => void;
}) {
	return (
		<>
			<Modal
				open={isOpen}
				handleClose={() => close()}
				title="Import a New Scene"
				description="Upload a gaussian splat scene file to start editing"
			>
				<span>
					You are not working in a project directory. Changes{" "}
					<b>will not be saved</b>.
				</span>
				<FileSelector
					onFileSelect={(file: File) => {
						handleSplatSelect(file);
						console.log("test");
					}}
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
