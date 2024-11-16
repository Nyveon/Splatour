import { create } from "zustand";

interface JoystickState {
	x: number;
	y: number;
    setJoystickPosition: (x: number, y: number) => void;
}

export const useJoystickControls = create<JoystickState>((set) => ({
	x: 0,
	y: 0,
    setJoystickPosition: (x, y) => set({ x, y }),
}));
