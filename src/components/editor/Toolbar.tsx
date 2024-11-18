import styled from "@emotion/styled";
import Button from "../Button";
import Checkbox from "../Checkbox";

const s = {
	Toolbar: styled.div`
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
	`,
};

interface ToolbarProps {
	debug: boolean;
	handleDebugChange: (newDebugValue: boolean) => void;
	debugMobile: boolean;
	handleDebugMobileChange: (newDebugMobileValue: boolean) => void;
}

export default function Toolbar({
	debug,
	handleDebugChange,
	debugMobile,
	handleDebugMobileChange,
}: ToolbarProps) {
	return (
		<s.Toolbar role="toolbar">
			<Button label="Upload" icon="upload" />
			<Button label="Export" icon="download" />
			<Button label="Create" icon="file-plus" />
			<Checkbox label="Debug" value={debug} onChange={handleDebugChange} />
			<Checkbox
				label="Mobile"
				value={debugMobile}
				onChange={handleDebugMobileChange}
			/>
		</s.Toolbar>
	);
}
