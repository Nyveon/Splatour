import ToggleDebug from "@/components/editor/inputs/ToggleDebug";
import ToggleMobileDebug from "@/components/editor/inputs/ToggleMobileDebug";
import styled from "@emotion/styled";
import Button from "../Button";
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
	console.log("toolbar");

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
