import JoystickControls from "@/components/viewer/controls/JoystickControls";
import Player from "@/components/viewer/controls/Player";
import { PointerLockControls } from "@/components/viewer/controls/PointerLockControls";
import Ambient from "@/components/viewer/world/Ambient";
import { useInteractions } from "@/hooks/useInteractions";
import useViewerStore from "@/hooks/useViewerContext";
import { KeyMap, playerHeight } from "@/utils/constants";
import styled from "@emotion/styled";
import { KeyboardControls } from "@react-three/drei/web/KeyboardControls";
import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import type { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";
import VRControls from "./controls/VRControls";
import ZoomControls from "./controls/ZoomControls";
import SparkLayer from "./gsplats/SparkLayer";
import ControlsHint from "./interface/ControlsHint";
import Crosshair from "./interface/Crosshair";
import InformationHotkey from "./interface/InformationHotkey";
import ScenePostProcessing from "./ScenePostProcessing";

const ViewerContainer = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
`;

export default function Viewer({
	children,
	preventPointerLock = false,
	enableVR = false,
}: {
	children: ReactNode;
	preventPointerLock?: boolean;
	enableVR?: boolean;
}) {
	const viewerContainerRef = useRef<HTMLDivElement>(null);
	const pointerLockControlsRef = useRef<PointerLockControlsImpl>(null);
	const [inVR, setInVR] = useState(false);
	const lockIn = useInteractions((state) => state.lockIn);
	const unlock = useInteractions((state) => state.unlock);
	const setViewerContainerRef = useViewerStore(
		(state) => state.setViewerContainerRef
	);

	useEffect(() => {
		if (viewerContainerRef.current) {
			setViewerContainerRef(viewerContainerRef);
		}
	}, [setViewerContainerRef]);

	function handleClick() {
		if (preventPointerLock || inVR) return;
		if (!pointerLockControlsRef.current || !viewerContainerRef.current) {
			return;
		}

		if (!pointerLockControlsRef.current.isLocked) {
			pointerLockControlsRef.current.lock();
		}
	}

	return (
		<KeyboardControls map={KeyMap}>
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
					dpr={[1, 2]}
					onClick={handleClick}
				>
					<SparkLayer />
					<ScenePostProcessing />
					{enableVR && (
						<VRControls
							containerRef={viewerContainerRef}
							onSessionChange={setInVR}
						/>
					)}
					<PointerLockControls
						enabled={!inVR}
						ref={pointerLockControlsRef}
						onLock={() => lockIn()}
						onUnlock={() => unlock()}
					/>
					<Player />
					<ZoomControls controlsRef={pointerLockControlsRef} />
					<Ambient />
					{children}
				</Canvas>
				{!inVR && (
					<>
						<JoystickControls />
						<Crosshair />
						<ControlsHint />
						<InformationHotkey />
					</>
				)}
			</ViewerContainer>
		</KeyboardControls>
	);
}
