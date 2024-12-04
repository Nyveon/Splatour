import styled from "@emotion/styled";
import MapToolbar from "./map/MapToolbar";
import ModeSelector from "./ModeSelector";
import SettingsToolbar from "./settings/SettingsToolbar";

const ToolbarSide = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 1.5rem;
`;

export default function Toolbar() {
	return (
		<>
			<ToolbarSide role="toolbar">
				<MapToolbar />
				<SettingsToolbar />
			</ToolbarSide>

			<ToolbarSide role="toolbar">
				<ModeSelector />
			</ToolbarSide>
		</>
	);
}
