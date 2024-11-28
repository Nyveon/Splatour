import mapUrl from "../assets/maps/test3.json?url";
import Viewer from "../components/viewer/Viewer";
import useFetchGSMap from "../hooks/useFetchGSMap";

export default function Preview() {
	const { error, loading } = useFetchGSMap(mapUrl);

	if (loading) return <h1>Loading...</h1>;

	if (error) return <h1>Error: {error.message}</h1>;

	//todo: fix this
	return (
		<>
			<Viewer />
		</>
	);
}
