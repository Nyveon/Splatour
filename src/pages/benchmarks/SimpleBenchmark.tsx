import mapUrl from "Khachkars/map.json?url";
import Benchmark from "./Benchmark";

export default function SimpleBenchmark() {
	return <Benchmark mapURL={mapUrl} folder="Khachkars" />;
}
