import styled from "@emotion/styled";
import { KeyboardControls, PointerLockControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { isMobile } from "react-device-detect";
import useFetchGSMap from "../hooks/useFetchGSMap";
import GSViewer from "../splats/GSViewer";
import { KeyMap } from "../utils/constants";
import Ambient from "../world/Ambient";
import Debug from "../world/Debug";
import Joysticks from "../world/Joysticks";
import Player from "../world/Player";

const s = {
	ViewerContainer: styled.div`
		position: relative;
		width: 100%;
		height: 100%;
		max-width: 100vw;
		max-height: 100vh;
		margin: 0;
		padding: 0;
		overflow: hidden;
	`,

	JoystickContainer: styled.div`
		position: absolute;
		bottom: 24px;
		left: 24px;
	`,
};

const debugMobile = false;

export default function Viewer({
	debug,
	file,
}: {
	debug: boolean;
	file: string;
}) {
	const { gsmap, error, loading } = useFetchGSMap(file);
	const viewerContainerRef = useRef(null);

	if (loading) return <h1>Loading...</h1>;

	if (error) return <h1>Error: {error.message}</h1>;

	const mobileControls = debugMobile || isMobile;

	if (!gsmap) {
		return <div>loading</div>;
	}

	return (
		<s.ViewerContainer ref={viewerContainerRef}>
			<KeyboardControls map={KeyMap}>
				<Canvas
					camera={{ position: [0, 3.5, 10], fov: 75 }}
					gl={{ antialias: false }}
				>
					{!mobileControls && <PointerLockControls />}
					<Player />

					<Ambient />
					{debug && <Debug viewerContainerRef={viewerContainerRef} />}
					{gsmap && <GSViewer gsmap={gsmap} />}
				</Canvas>
			</KeyboardControls>
			{mobileControls && <Joysticks />}
		</s.ViewerContainer>
	);
}
