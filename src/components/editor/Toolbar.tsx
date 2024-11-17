import styled from "@emotion/styled";
import Button from "../Button";

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
			<Button text="Upload" icon="upload" />
			<Button text="Export" icon="download" />
			<Button text="Create" icon="file-plus" />
		</s.Toolbar>
	);
}
