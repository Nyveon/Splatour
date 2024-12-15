import MapCreate from "@/components/editor/map/MapCreate";
import MapExport from "@/components/editor/map/MapExport";
import MapImport from "@/components/editor/map/MapImport";
import MapName from "@/components/editor/map/MapName";
import MapSave from "@/components/editor/map/MapSave";
import { useGSStore } from "@/hooks/useGSStore";
import styled from "@emotion/styled";

const NameHeader = styled.h1`
	padding: 0;
	margin: 0;

	font-size: 1.25rem;
	font-weight: normal;
`;

export default function MapToolbar() {
	const isEditing = !!useGSStore((state) => state.gsmap.directoryHandle);

	if (isEditing) {
		return (
			<>
				<MapName />
				<MapSave />
				<MapExport />
			</>
		);
	} else {
		return (
			<>
				<NameHeader>Temporary Map</NameHeader>
				<MapImport />
				<MapCreate />
			</>
		);
	}
}
