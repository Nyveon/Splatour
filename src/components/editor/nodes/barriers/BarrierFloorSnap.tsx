import styled from "@emotion/styled";
import NodePanel from "../NodePanel";

const Note = styled.span`
	font-style: italic;
	text-align: left;
`;

export default function BarrierFloorSnap() {
	return (
		<NodePanel label="Floor Snap" icon="help-circle" vertical={true}>
			<Note>Does not apply scene&apos;s rotation or scale.</Note>
		</NodePanel>
	);
}
