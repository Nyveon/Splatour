import ToggleDebug from "@/components/editor/inputs/ToggleDebug";
import ToggleMobileDebug from "@/components/editor/inputs/ToggleMobileDebug";
import UploadMap from "@/components/editor/UploadMap";
import Button from "@/components/input/Button";
import styled from "@emotion/styled";

const ToolbarContainer = styled.div`
	display: flex;
	gap: 1rem;
	justify-content: center;
	align-items: center;
`;

export default function Toolbar() {
	console.log("toolbar");

	return (
		<ToolbarContainer role="toolbar">
			<UploadMap />

			<Button label="Export" icon="download" />
			<Button label="Create" icon="file-plus" />

			<ToggleDebug />
			<ToggleMobileDebug />
		</ToolbarContainer>
	);
}
