import styled from "@emotion/styled";
import { KeyboardControls, PointerLockControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { isMobile } from "react-device-detect";
import { Joystick } from "react-joystick-component";
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";
import useFetchGSMap from "../hooks/useFetchGSMap";
import { useJoystickControls } from "../hooks/useJoystickControls";
import GSViewer from "../splats/GSViewer";
import { KeyMap } from "../utils/constants";
import Ambient from "../world/Ambient";
import Debug from "../world/Debug";
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

const debugMobile = true;

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

	const handleMove = (update: IJoystickUpdateEvent) => {
		const x = update.x ?? 0;
		const y = update.y ?? 0;
		useJoystickControls.getState().setJoystickPosition(x, y);
	};

	const handleStop = () => {
		useJoystickControls.getState().setJoystickPosition(0, 0);
	};

	const mobileControls = debugMobile || isMobile;

	return (
		<s.ViewerContainer ref={viewerContainerRef}>
			<KeyboardControls map={KeyMap}>
				<Canvas camera={{ position: [0, 3.5, 10], fov: 75 }}>
					{mobileControls && <PointerLockControls />}
					<Player />

					<Ambient />
					{debug && <Debug viewerContainerRef={viewerContainerRef} />}
					{gsmap && <GSViewer gsmap={gsmap} />}
				</Canvas>
			</KeyboardControls>
			{mobileControls && (
				<s.JoystickContainer>
					<Joystick
						size={100}
						sticky={false}
						baseColor="rgba(0,0,0,0.5)"
						stickColor="rgba(255,255,255,0.5)"
						move={handleMove}
						stop={handleStop}
						throttle={60}
					/>
				</s.JoystickContainer>
			)}
		</s.ViewerContainer>
	);
}
