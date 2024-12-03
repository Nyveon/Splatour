import styled from "@emotion/styled";
import GSMapEditable from "./MapDynamic";
import Viewer from "./Viewer";
import DebugUtils from "./interface/DebugUtils";

const Preview = styled.section`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 100%;
`;

export default function EditorView() {
	return (
		<Preview>
			<Viewer>
				<DebugUtils />
				<GSMapEditable />
			</Viewer>
		</Preview>
	);
}
