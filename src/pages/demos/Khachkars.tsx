import mapUrl from "Khachkars/map.json?url";
import CompositePreview from "./CompositePreview";

export default function Khachkars() {
	return <CompositePreview mapURL={mapUrl} folder="Khachkars" />;
}
