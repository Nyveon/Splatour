import styled from "@emotion/styled";
import { KeyboardControls, PointerLockControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import GSViewer from "../splats/GSViewer";
import useFetchGSMap from "../splats/useFetchGSMap";
import { KeyMap } from "../utils/constants";
import Ambient from "../world/Ambient";
import Debug from "../world/Debug";
import Player from "../world/Player";

const ViewerContainer = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	max-width: 100vw;
	max-height: 100vh;
	margin: 0;
	padding: 0;
`;

export default function Viewer({ debug }: { debug: boolean }) {
	const { gsmap, error, loading } = useFetchGSMap("/empty.json");
	const viewerContainerRef = useRef(null);

	if (loading) return <h1>Loading...</h1>;

	if (error) return <h1>Error: {error.message}</h1>;

	return (
		<ViewerContainer ref={viewerContainerRef}>
			<KeyboardControls map={KeyMap}>
				<Canvas camera={{ position: [0, 3.5, 10], fov: 75 }}>
					<PointerLockControls />
					<Player />

					<Ambient />
					{debug && <Debug viewerContainerRef={viewerContainerRef} />}
					{gsmap && <GSViewer gsmap={gsmap} />}
				</Canvas>
			</KeyboardControls>
		</ViewerContainer>
	);
}
