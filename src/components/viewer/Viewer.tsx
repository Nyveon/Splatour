import JoystickControls from "@/components/viewer/controls/JoystickControls";
import Player from "@/components/viewer/controls/Player";
import { PointerLockControls } from "@/components/viewer/controls/PointerLockControls";
import GSViewer from "@/components/viewer/GSViewer";
import DebugUtils from "@/components/viewer/interface/DebugUtils";
import Ambient from "@/components/viewer/world/Ambient";
import { KeyMap } from "@/utils/constants";
import styled from "@emotion/styled";
import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";

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

	console.log("viewer");

	return (
		<s.ViewerContainer ref={viewerContainerRef} id="#viewer">
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
					<GSViewer />
				</Canvas>
			</KeyboardControls>
			<JoystickControls />
		</s.ViewerContainer>
	);
}
