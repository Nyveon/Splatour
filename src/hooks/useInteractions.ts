import { create } from "zustand";

//todo: maybe some day add different type of interactables

export interface InteractableState {
	interactable: boolean;
	isLocked: boolean;
	lockIn: () => void;
	unlock: () => void;
	setInteractable: (interactable: boolean) => void;
}

const useInteractions = create<InteractableState>((set) => ({
	interactable: false,
	isLocked: false,
	lockIn: () => set({ isLocked: true }),
	unlock: () => set({ isLocked: false }),
	setInteractable: (interactable: boolean) => set({ interactable }),
}));

export default useInteractions;
