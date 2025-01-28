import Modal from "@/components/Modal";
import { toastError, toastSuccess } from "@/utils/toasts";
import { getPerf } from "r3f-perf";

interface PerfReport {
	getReport: () => PerfData;
}

interface PerfData {
	infos: {
		renderer: string;
		vendor: string;
		version: string;
	};
	gl: {
		triangles: number;
	};
	log: {
		cpu: number;
		fps: number;
		gpu: number;
		mem: number;
	};
	max: {
		log: {
			cpu: number;
			fps: number;
			gpu: number;
			mem: number;
		};
	};
}

export default function BenchmarkReport({
	benchmarkName,
}: {
	benchmarkName: string;
}) {
	const perfReport = getPerf() as PerfReport;
	console.log(perfReport);
	const perfData = perfReport.getReport();

	const report = [
		`benchmark: ${benchmarkName}`,
		`renderer: ${perfData.infos.renderer}`,
		`vendor: ${perfData.infos.vendor}`,
		`version: ${perfData.infos.version}`,
		`triangles: ${perfData.gl.triangles}`,
		`cpu: ${perfData.log.cpu}`,
		`fps: ${perfData.log.fps}`,
		`gpu: ${perfData.log.gpu}`,
		`mem: ${perfData.log.mem}`,
		`max cpu: ${perfData.max.log.cpu}`,
		`max fps: ${perfData.max.log.fps}`,
		`max gpu: ${perfData.max.log.gpu}`,
		`max mem: ${perfData.max.log.mem}`,
	];

	function toClipboard() {
		navigator.clipboard
			.writeText(report.join("\n"))
			.then(() => toastSuccess("Benchmark result copied to clipboard"))
			.catch(() => toastError("Failed to copy benchmark result"));
	}

	return (
		<Modal
			open={true}
			handleClose={() => null}
			title="Benchmark 1 Over"
			description="Please share these results with the developer"
		>
			<button onClick={toClipboard}>Copy to clipboard</button>
			<pre>
				<code>{report.join("\n")}</code>
			</pre>
		</Modal>
	);
}
