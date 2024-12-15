import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import MapToolbar from "../map/MapToolbar";
import ModeSelector from "../ModeSelector";
import ToolbarModes from "./ToolbarModes";
import ToolbarMovement from "./ToolbarMovement";
import ToolbarVisibility from "./ToolbarVisibility";

const ToolbarContainer = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	height: 100%;
	gap: 1.5rem;

	@media (max-width: 1300px) {
		font-size: 0.9rem;
		gap: 0.5rem;
	}
`;

const Separator = styled.div`
	width: 2px;
	align-self: stretch;
	background-color: ${color.borderHalf};
	margin: 0.5rem;
`;

const Space = styled.div`
	flex-grow: 1;
`;

export default function Toolbar() {
	return (
		<ToolbarContainer role="toolbar">
			<MapToolbar />

			<Separator />

			<ToolbarModes />

			<Separator />

			<ToolbarVisibility />

			<Separator />

			<ToolbarMovement />

			<Separator />

			<Space />
			<ModeSelector />
		</ToolbarContainer>
	);
}
