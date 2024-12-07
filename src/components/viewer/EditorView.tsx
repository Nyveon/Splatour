import styled from "@emotion/styled";
import ArtifactPlacer from "../editor/nodes/artifacts/ArtifactPlacer";
import GSMapEditable from "./MapDynamic";
import Viewer from "./Viewer";
import DebugUtils from "./interface/DebugUtils";

const Preview = styled.section`
	position: relative;
	flex-grow: 1;
	flex-shrink: 1;
	overflow: hidden;
`;

export default function EditorView() {
	return (
		<Preview>
			<Viewer>
				<DebugUtils />
				<GSMapEditable />
				<ArtifactPlacer />
			</Viewer>
		</Preview>
	);
}
