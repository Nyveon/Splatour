import JoystickControls from "@/components/viewer/controls/JoystickControls";
import Player from "@/components/viewer/controls/Player";
import { PointerLockControls } from "@/components/viewer/controls/PointerLockControls";
import GS3DViewer from "@/components/viewer/GS3DViewer";
import DebugUtils from "@/components/viewer/interface/DebugUtils";
import Ambient from "@/components/viewer/world/Ambient";
import { KeyMap } from "@/utils/constants";
import styled from "@emotion/styled";
import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";
import GSM from "./GSM";

const ViewerContainer = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	max-width: 100vw;
	max-height: 100vh;
	margin: 0;
	padding: 0;
	overflow: hidden;
`;

export default function Viewer() {
	const viewerContainerRef = useRef<HTMLDivElement>(null);
	const pointerLockControlsRef = useRef<PointerLockControlsImpl>(null);

	function handleClick() {
		if (!pointerLockControlsRef.current || !viewerContainerRef.current) {
			return;
		}

		if (!pointerLockControlsRef.current.isLocked) {
			pointerLockControlsRef.current.lock();
		}
	}

	return (
		<ViewerContainer ref={viewerContainerRef} id="#viewer">
			<KeyboardControls map={KeyMap}>
				<Canvas
					camera={{ position: [0, 3.5, 10], fov: 75 }}
					gl={{ antialias: false }}
					onClick={handleClick}
				>
					<PointerLockControls ref={pointerLockControlsRef} />
					<Player />

					<Ambient />
					<DebugUtils viewerContainerRef={viewerContainerRef} />
					<GS3DViewer />
				</Canvas>
			</KeyboardControls>
			<JoystickControls />
		</ViewerContainer>
	);
}
