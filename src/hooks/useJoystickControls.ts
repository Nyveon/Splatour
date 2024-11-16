import { create } from "zustand";

interface JoystickState {
	moveX: number;
	moveY: number;
	cameraX: number;
	cameraY: number;
	setMoveJoystickPosition: (moveX: number, moveY: number) => void;
	setCameraJoystickPosition: (cameraX: number, cameraY: number) => void;
}

export const useJoystickControls = create<JoystickState>((set) => ({
	moveX: 0,
	moveY: 0,
	cameraX: 0,
	cameraY: 0,
	setMoveJoystickPosition: (moveX, moveY) => set({ moveX, moveY }),
	setCameraJoystickPosition: (cameraX, cameraY) => set({ cameraX, cameraY }),
}));
