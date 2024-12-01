import mapURL from "@/assets/maps/mobile.json?url";
import ExportedView from "@/components/viewer/ExportedView";
import useFetchGSMap from "@/hooks/useFetchGSMap";

export default function Preview() {
	const { serialMap, error, loading } = useFetchGSMap(mapURL);

	if (loading) return <h1>Loading...</h1>;

	if (error) return <h1>Error: {error.message}</h1>;

	if (!serialMap) return <h1>No data found?</h1>;

	return <ExportedView serialMap={serialMap} />;
}
