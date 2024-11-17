import styled from "@emotion/styled";
import { KeyboardControls, PointerLockControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { isMobile } from "react-device-detect";
import GSMap from "../splats/GSMap";
import GSViewer from "../splats/GSViewer";
import { KeyMap } from "../utils/constants";
import Ambient from "../world/Ambient";
import Debug from "../world/Debug";
import JoystickControls from "../world/JoystickControls";
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

	CanvasArea: styled.div`
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	`,
};

const debugMobile = false;

export default function Viewer({
	debug,
	gsmap,
}: {
	debug: boolean;
	gsmap: GSMap;
}) {
	const viewerContainerRef = useRef(null);

	const mobileControls = debugMobile || isMobile;

	return (
		<s.ViewerContainer ref={viewerContainerRef} id="#viewer">
			<KeyboardControls map={KeyMap}>
				<s.CanvasArea id="canvas-area" />
				<Canvas
					camera={{ position: [0, 3.5, 10], fov: 75 }}
					gl={{ antialias: false }}
				>
					{!mobileControls && <PointerLockControls selector="#canvas-area" />}
					<Player />

					<Ambient />
					{debug && <Debug viewerContainerRef={viewerContainerRef} />}
					{gsmap && <GSViewer gsmap={gsmap} />}
				</Canvas>
			</KeyboardControls>
			{mobileControls && <JoystickControls />}
		</s.ViewerContainer>
	);
}
