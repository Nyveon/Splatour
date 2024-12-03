import { create } from "zustand";

//todo: maybe some day add different type of interactables

export interface InteractableState {
	interactable: boolean;
	setInteractable: (interactable: boolean) => void;
}

export const useInteractable = create<InteractableState>((set) => ({
	interactable: false,
	setInteractable: (interactable: boolean) => set({ interactable }),
}));
