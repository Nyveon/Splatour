import { create } from "zustand";

export interface SettingsState {
	debug: boolean;
	setDebug: (debug: boolean) => void;
	mobileDebug: boolean;
	setMobileDebug: (mobileDebug: boolean) => void;

	initializeSettings: (defaults: {
		debug: boolean;
		mobileDebug: boolean;
	}) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
	debug: false,
	setDebug: (debug) => set({ debug }),
	mobileDebug: false,
	setMobileDebug: (mobileDebug) => set({ mobileDebug }),

	initializeSettings: (defaults) => set(defaults),
}));
