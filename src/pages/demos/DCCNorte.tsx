import mapUrl from "DCC_Norte/map.json?url";
import Preview from "./Preview";

export default function DCCNorte() {
	return <Preview mapURL={mapUrl} folder="DCC_Norte" />;
}
