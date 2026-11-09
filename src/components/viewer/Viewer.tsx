import JoystickControls from "@/components/viewer/controls/JoystickControls";
import Player from "@/components/viewer/controls/Player";
import { PointerLockControls } from "@/components/viewer/controls/PointerLockControls";
import Ambient from "@/components/viewer/world/Ambient";
import { useInteractions } from "@/hooks/useInteractions";
import { useProductStore } from "@/hooks/useProductStore";
import useViewerStore from "@/hooks/useViewerContext";
import { KeyMap, playerHeight } from "@/utils/constants";
import styled from "@emotion/styled";
import { KeyboardControls } from "@react-three/drei/web/KeyboardControls";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import type { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";
import VRControls from "./controls/VRControls";
import ZoomControls from "./controls/ZoomControls";
import SparkLayer from "./gsplats/SparkLayer";
import ControlsHint from "./interface/ControlsHint";
import Crosshair from "./interface/Crosshair";
import InformationHotkey from "./interface/InformationHotkey";
import Cart from "./products/Cart";
import ProductDialog from "./products/ProductDialog";
import ProductPicker from "./products/ProductPicker";
import RenderOnChange from "./RenderOnChange";
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
		if (
			useProductStore.getState().active ||
			useProductStore.getState().cartOpen
		)
			return;
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
					frameloop={inVR ? "always" : "demand"}
					camera={{
						position: [0, playerHeight, 0],
						fov: 90,
						rotation: [0, 0, 0],
						up: [0, 1, 0],
					}}
					gl={{
						antialias: false,
					}}
					// Limit mobile fill rate and render-target memory on high-DPI screens.
					dpr={isMobile ? 1 : [1, 2]}
					onClick={handleClick}
				>
					<RenderOnChange />
					<SparkLayer />
					<ProductPicker />
					<ScenePostProcessing />
					{import.meta.env.DEV && <Perf position="top-right" />}
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
				<ProductDialog onResume={handleClick} />
				<Cart onResume={handleClick} />
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
