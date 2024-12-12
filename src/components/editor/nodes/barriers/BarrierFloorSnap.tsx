import styled from "@emotion/styled";
import NodePanel from "../NodePanel";

const Note = styled.span`
	font-style: italic;
	text-align: left;
`;

export default function BarrierFloorSnap() {
	return (
		<NodePanel label="Floor Snap" icon="help-circle" vertical={true}>
			<Note>No rotation around the X or Z axes. Y position fixed at 0.</Note>
		</NodePanel>
	);
}
