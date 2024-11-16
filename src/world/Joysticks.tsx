import styled from "@emotion/styled";
import { Joystick } from "react-joystick-component";
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";
import { useJoystickControls } from "../hooks/useJoystickControls";

const joystickMargin = 24;

const s = {
	LeftJoystickContainer: styled.div`
		position: absolute;
		bottom: ${joystickMargin + 12}px;
		left: ${joystickMargin}px;
	`,

	RightJoystickContainer: styled.div`
		position: absolute;
		bottom: ${joystickMargin + 12}px;
		right: ${joystickMargin}px;
	`,
};

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

export default function Joysticks() {
	return (
		<>
			<s.LeftJoystickContainer>
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
			</s.LeftJoystickContainer>
			<s.RightJoystickContainer>
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
			</s.RightJoystickContainer>
		</>
	);
}
