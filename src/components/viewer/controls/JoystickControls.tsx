import { useJoystickControls } from "@/hooks/useJoystickControls";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import styled from "@emotion/styled";
import { isMobile } from "react-device-detect";
import { Joystick } from "react-joystick-component";
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";

const joystickMargin = 24;

const JoystickContainer = styled.div`
	position: absolute;
	bottom: ${joystickMargin}px;
`;

const JoystickContainerLeft = styled(JoystickContainer)`
	left: ${joystickMargin}px;
`;

const JoystickContainerRight = styled(JoystickContainer)`
	right: ${joystickMargin}px;
`;

function BaseJoystick({
	handleMove,
	handleStop,
}: {
	handleMove: (update: IJoystickUpdateEvent) => void;
	handleStop: () => void;
}) {
	return (
		<Joystick
			size={100}
			sticky={false}
			baseColor="rgba(0,0,0,0.5)"
			stickColor="rgba(255,255,255,0.5)"
			move={handleMove}
			stop={handleStop}
			throttle={60}
		/>
	);
}

export default function JoystickControls() {
	const debugMobile = useSettingsStore((state) => state.mobileDebug);
	const mobileControls = debugMobile || isMobile;

	if (!mobileControls) {
		return null;
	}

	return (
		<>
			<JoystickContainerLeft>
				<BaseJoystick
					handleMove={(update) => {
						useJoystickControls
							.getState()
							.setMoveJoystickPosition(update.x ?? 0, update.y ?? 0);
					}}
					handleStop={() => {
						useJoystickControls.getState().setMoveJoystickPosition(0, 0);
					}}
				/>
			</JoystickContainerLeft>
			<JoystickContainerRight>
				<BaseJoystick
					handleMove={(update) => {
						useJoystickControls
							.getState()
							.setCameraJoystickPosition(update.x ?? 0, update.y ?? 0);
					}}
					handleStop={() => {
						useJoystickControls.getState().setCameraJoystickPosition(0, 0);
					}}
				/>
			</JoystickContainerRight>
		</>
	);
}
