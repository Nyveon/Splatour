import BenchmarkViewer from "@/components/viewer/BenchmarkViewer";
import CompositeViewer from "@/components/viewer/gsplats/CompositeViewer";
import useFetchGSMap from "@/hooks/useFetchGSMap";
import { useGSStore } from "@/hooks/useGSStore";
import { gsmDeserializeObjectJSON } from "@/model/GSMap";

export default function Benchmark({
	mapURL,
	folder = "",
}: {
	mapURL: string;
	folder?: string;
}) {
	const setGSMap = useGSStore((state) => state.setGSMap);
	const { serialMap, error, loading } = useFetchGSMap(mapURL);

	if (loading) return <h1>Loading...</h1>;

	if (error) return <h1>Error: {error.message}</h1>;

	if (!serialMap) return <h1>No data found?</h1>;

	if (folder) {
		serialMap.scenes.forEach((scene) => {
			if (!scene.filePath.startsWith(folder)) {
				scene.filePath = folder + "/" + scene.filePath;
			}
		});
	}

	setGSMap(gsmDeserializeObjectJSON(serialMap));

	return (
		<BenchmarkViewer benchmarkName="Khachkar Test 1">
			<CompositeViewer />
		</BenchmarkViewer>
	);
}
