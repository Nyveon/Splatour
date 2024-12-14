import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import MapToolbar from "./map/MapToolbar";
import ModeSelector from "./ModeSelector";
import FlySpeed from "./settings/FlySpeed";
import ToggleDebug from "./settings/ToggleDebug";
import ToggleForceVisible from "./settings/ToggleForceVisible";
import ToggleMobileDebug from "./settings/ToggleMobileDebug";
import ToggleNoclip from "./settings/ToggleNoclip";
import ToggleNodeVisibility from "./settings/ToggleNodeVisibility";

const ToolbarContainer = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	height: 100%;
	gap: 1.5rem;
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

			<ToggleDebug />
			<ToggleMobileDebug />

			<Separator />

			<ToggleNodeVisibility />
			<ToggleForceVisible />

			<Separator />

			<ToggleNoclip />
			<FlySpeed />

			<Space />
			<Separator />

			<ModeSelector />
		</ToolbarContainer>
	);
}
