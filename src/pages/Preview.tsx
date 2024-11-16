import mapUrl from "../assets/maps/test2.json?url";
import Viewer from "../components/Viewer";

export default function Preview() {
	return (
		<>
			<Viewer debug={false} file={mapUrl} />
		</>
	);
}
