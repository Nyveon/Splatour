import styled from "@emotion/styled";
import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { isMobile } from "react-device-detect";
import { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";
import GSMap from "../splats/GSMap";
import GSViewer from "../splats/GSViewer";
import { KeyMap } from "../utils/constants";
import Ambient from "../world/Ambient";
import Debug from "../world/Debug";
import JoystickControls from "../world/JoystickControls";
import Player from "../world/Player";
import { PointerLockControls } from "../world/PointerLockControls";

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

export default function Viewer({
	debug,
	debugMobile,
	gsmap,
}: {
	debug: boolean;
	debugMobile: boolean;
	gsmap: GSMap;
}) {
	const viewerContainerRef = useRef<HTMLDivElement>(null);
	const pointerLockControlsRef = useRef<PointerLockControlsImpl>(null);

	const mobileControls = debugMobile || isMobile;

	function handleClick() {
		if (!pointerLockControlsRef.current || !viewerContainerRef.current) {
			return;
		}

		if (!pointerLockControlsRef.current.isLocked) {
			pointerLockControlsRef.current.lock();
		}
	}

	return (
		<s.ViewerContainer ref={viewerContainerRef} id="#viewer">
			<KeyboardControls map={KeyMap}>
				<Canvas
					camera={{ position: [0, 3.5, 10], fov: 75 }}
					gl={{ antialias: false }}
					onClick={handleClick}
				>
					{!mobileControls && (
						<PointerLockControls ref={pointerLockControlsRef} />
					)}
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
