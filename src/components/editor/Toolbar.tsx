import MapCreate from "@/components/editor/file/MapCreate";
import MapExport from "@/components/editor/file/MapExport";
import MapImport from "@/components/editor/file/MapImport";
import ToggleDebug from "@/components/editor/inputs/ToggleDebug";
import ToggleMobileDebug from "@/components/editor/inputs/ToggleMobileDebug";
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
