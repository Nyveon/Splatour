import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

// todo: parametrize this per benchmark
const BENCHMARK_DURATION_S = 30;

export default function BenchmarkTool({
	endBenchmark,
}: {
	endBenchmark: () => void;
}) {
	const startTime = useRef(performance.now());

	console.log("Starting benchmark");

	useFrame((state) => {
		const currentTime = performance.now();
		const elapsed = (currentTime - startTime.current) / 1000;
		if (elapsed > BENCHMARK_DURATION_S) {
			endBenchmark();
		} else {
			const angle = elapsed * 0.5;
			state.camera.position.x = Math.sin(angle) * 10;
			state.camera.position.z = Math.cos(angle) * 10;
			state.camera.lookAt(0, 0, 0);
		}
	});

	return null;
}
