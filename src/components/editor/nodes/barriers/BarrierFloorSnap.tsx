import styled from "@emotion/styled";
import NodePanel from "../NodePanel";

const Note = styled.span`
	font-style: italic;
	text-align: left;
`;

export default function BarrierFloorSnap() {
	return (
		<NodePanel label="Floor Snap" icon="help-circle" vertical={true}>
			<Note>No X or Z axis rotation. No Y axis scaling or translation.</Note>
		</NodePanel>
	);
}
