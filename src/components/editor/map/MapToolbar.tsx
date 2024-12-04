import MapCreate from "@/components/editor/map/MapCreate";
import MapExport from "@/components/editor/map/MapExport";
import MapImport from "@/components/editor/map/MapImport";
import MapName from "@/components/editor/map/MapName";
import MapSave from "@/components/editor/map/MapSave";

export default function MapToolbar() {
	return (
		<>
			<MapName />
			<MapSave />
			<MapExport />
			<MapImport />
			<MapCreate />
		</>
	);
}
