import { create } from "zustand";

export interface SettingsState {
	debug: boolean;
	setDebug: (debug: boolean) => void;
	mobileDebug: boolean;
	setMobileDebug: (mobileDebug: boolean) => void;
	debugNodes: boolean;
	setDebugNodes: (debugNodes: boolean) => void;
	noclip: boolean;
	setNoclip: (noclip: boolean) => void;

	initializeSettings: (defaults: {
		debug: boolean;
		mobileDebug: boolean;
		debugNodes: boolean;
		noclip: boolean;
	}) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
	debug: false,
	setDebug: (debug) => set({ debug }),
	mobileDebug: false,
	setMobileDebug: (mobileDebug) => set({ mobileDebug }),
	debugNodes: false,
	setDebugNodes: (debugNodes) => set({ debugNodes }),
	noclip: false,
	setNoclip: (noclip) => set({ noclip }),

	initializeSettings: (defaults) => set(defaults),
}));
