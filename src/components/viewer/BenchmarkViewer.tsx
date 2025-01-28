import Ambient from "@/components/viewer/world/Ambient";
import useViewerStore from "@/hooks/useViewerContext";
import { playerHeight } from "@/utils/constants";
import styled from "@emotion/styled";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import BenchmarkModal from "./interface/BenchmarkModal";
import BenchmarkReport from "./interface/BenchmarkReport";
import BenchmarkTool from "./interface/BenchmarkTool";

const ViewerContainer = styled.div`
	position: relative;
	width: 1280px;
	height: 720px;
	margin: 0;
	padding: 0;
`;

/**
 * Stripped down version of Viewer.tsx
 * Fixed size, no controls, no interactions
 */
export default function BenchmarkViewer({
	benchmarkName,
	children,
}: {
	benchmarkName: string;
	children: ReactNode;
}) {
	const [benchmarkStarted, setBenchmarkStarted] = useState(false);
	const [benchmarkEnded, setBenchmarkEnded] = useState(false);

	const viewerContainerRef = useRef<HTMLDivElement>(null);
	const setViewerContainerRef = useViewerStore(
		(state) => state.setViewerContainerRef
	);

	useEffect(() => {
		if (viewerContainerRef.current) {
			setViewerContainerRef(viewerContainerRef);
		}
	}, [setViewerContainerRef]);

	function startBenchmark() {
		setBenchmarkStarted(true);
	}

	function endBenchmark() {
		setBenchmarkEnded(true);
	}

	const benchmarkOngoing = benchmarkStarted && !benchmarkEnded;

	return (
		<ViewerContainer ref={viewerContainerRef} id="#viewer">
			<Canvas
				camera={{
					position: [0, playerHeight, 0],
					fov: 90,
					rotation: [0, 0, 0],
					up: [0, 1, 0],
				}}
				gl={{
					antialias: false,
				}}
				dpr={1} //? this can be lowered even more for better performance
			>
				<Ambient />
				{children}
				{benchmarkOngoing && <Perf deepAnalyze={true} overClock={true} />}
				{benchmarkOngoing && <BenchmarkTool endBenchmark={endBenchmark} />}
			</Canvas>
			{!benchmarkStarted && (
				<BenchmarkModal
					benchmarkName={benchmarkName}
					startBenchmark={startBenchmark}
				/>
			)}
			{benchmarkEnded && <BenchmarkReport benchmarkName={benchmarkName} />}
		</ViewerContainer>
	);
}
