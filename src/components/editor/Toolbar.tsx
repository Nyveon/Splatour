import styled from "@emotion/styled";
import Button from "../Button";
import ToggleDebug from "./ToggleDebug";
import ToggleMobileDebug from "./ToggleMobileDebug";
import UploadMap from "./UploadMap";

const s = {
	Toolbar: styled.div`
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
	`,
};

export default function Toolbar() {
	return (
		<s.Toolbar role="toolbar">
			<UploadMap />

			<Button label="Export" icon="download" />
			<Button label="Create" icon="file-plus" />

			<ToggleDebug />
			<ToggleMobileDebug />
		</s.Toolbar>
	);
}
