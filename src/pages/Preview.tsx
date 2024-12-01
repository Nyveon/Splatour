import mapURL from "@/assets/maps/mobile.json?url";
import ExportedViewer from "@/components/viewer/ExportedView";

export default function Preview() {
	return <ExportedViewer mapURL={mapURL} />;
}
