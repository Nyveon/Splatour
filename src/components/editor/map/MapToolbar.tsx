import MapCreate from "@/components/editor/map/MapCreate";
import MapExport from "@/components/editor/map/MapExport";
import MapImport from "@/components/editor/map/MapImport";
import MapName from "@/components/editor/map/MapName";
import MapSave from "@/components/editor/map/MapSave";
import { useGSStore } from "@/hooks/useGSStore";
import styled from "@emotion/styled";
import HelpInfo from "../HelpInfo";

const NameHeader = styled.h1`
	padding: 0;
	margin: 0;

	font-size: 1.25rem;
	font-weight: normal;
`;

const helpInfo = `
# Maps

A map is a collection of *:gaussian splat scenes* and *:web or 3d nodes* that can be viewed in the viewer.

## *icon-play* Starting

Click the *:icon-file-plus* *:Create* button to select an empty folder on your computer to save the map to.

Or, click the *:icon-upload* *:Load* button to select an already existing project folder to load into the editor.

## *icon-edit* Working

After creating or loading a map, the editor will switch to *:Editing Mode*.
In this mode, you can add *:scenes* and *:nodes*, change their properties,
and save your changes with the *:icon-save* *:Save* button.

## *icon-save* Exporting

When you are finished editing your map, you can export the viewer and all data as a *:.zip* file with the *:icon-download* *:Export* button.
`;

export default function MapToolbar() {
	const isEditing = !!useGSStore((state) => state.gsmap.directoryHandle);

	return (
		<>
			{isEditing ? (
				<>
					<MapName />
					<MapSave />
					<MapExport />
				</>
			) : (
				<>
					<NameHeader>Temporary Map</NameHeader>
					<MapImport />
					<MapCreate />
				</>
			)}
			<HelpInfo info={helpInfo} />
		</>
	);
}
