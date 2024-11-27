import MapCreate from "@/components/editor/map/MapCreate";
import MapExport from "@/components/editor/map/MapExport";
import MapImport from "@/components/editor/map/MapImport";
import ToggleDebug from "@/components/editor/settings/ToggleDebug";
import ToggleMobileDebug from "@/components/editor/settings/ToggleMobileDebug";
import styled from "@emotion/styled";

const ToolbarContainer = styled.div`
	display: flex;
	gap: 1rem;
	justify-content: center;
	align-items: center;
`;

export default function Toolbar() {
	return (
		<ToolbarContainer role="toolbar">
			<MapImport />
			<MapExport />
			<MapCreate />

			<ToggleDebug />
			<ToggleMobileDebug />
		</ToolbarContainer>
	);
}
