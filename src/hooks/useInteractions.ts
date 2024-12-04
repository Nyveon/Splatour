import { create } from "zustand";

// User->Player<->world interactions are handled here

//todo: maybe some day add different type of interactables

export enum UserState {
	None,
	Artifacts,
	Barriers,
	Portals,
}

export interface InteractableState {
	interactable: boolean;
	setInteractable: (interactable: boolean) => void;

	isLocked: boolean;
	lockIn: () => void;
	unlock: () => void;

	teleportPending: null | { x: number; y: number; z: number };
	setTeleportPending: (
		target: null | { x: number; y: number; z: number }
	) => void;

	userState: UserState;
	setUserState: (state: UserState) => void;
}

export const useInteractions = create<InteractableState>((set) => ({
	interactable: false,
	setInteractable: (interactable: boolean) => set({ interactable }),

	isLocked: false,
	lockIn: () => set({ isLocked: true }),
	unlock: () => set({ isLocked: false }),

	teleportPending: null,
	setTeleportPending: (target: null | { x: number; y: number; z: number }) =>
		set({ teleportPending: target }),

	userState: UserState.None,
	setUserState: (userState: UserState) => set({ userState }),
}));
