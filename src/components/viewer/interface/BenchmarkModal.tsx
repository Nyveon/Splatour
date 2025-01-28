import Modal from "@/components/Modal";

export default function BenchmarkModal({
	benchmarkName,
	startBenchmark,
}: {
	benchmarkName: string;
	startBenchmark: () => void;
}) {
	//todo: make this only click-able when already loaded

	return (
		<Modal
			open={true}
			handleClose={() => null}
			title={benchmarkName}
			description="Once the scene is done loading, press start. The benchmark will take 30 seconds."
		>
			<button onClick={startBenchmark}>Start</button>
		</Modal>
	);
}
