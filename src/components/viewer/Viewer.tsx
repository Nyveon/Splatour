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
import { useEffect, useRef } from "react";
import type { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";
import CylinderPlacer from "../editor/scenes/elements/CyllinderPlacer";
import Crosshair from "./interface/Crosshair";

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

export default function Viewer({ children }: { children: ReactNode }) {
	const viewerContainerRef = useRef<HTMLDivElement>(null);
	const pointerLockControlsRef = useRef<PointerLockControlsImpl>(null);
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
					camera={{ position: [0, playerHeight, 10], fov: 90 }}
					gl={{
						antialias: false,
					}}
					dpr={1} //? this can be lowered even more for better performance
					onClick={handleClick}
				>
					<PointerLockControls
						ref={pointerLockControlsRef}
						onLock={() => lockIn()}
						onUnlock={() => unlock()}
					/>
					<Player />
					<Ambient />
					<CylinderPlacer />
					{children}
				</Canvas>
			</KeyboardControls>
			<JoystickControls />
			<Crosshair />
		</ViewerContainer>
	);
}
