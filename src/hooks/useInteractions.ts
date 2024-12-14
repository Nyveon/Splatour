import { NodeType } from "@/model/GSNode";
import { create } from "zustand";

// User->Player<->world interactions are handled here

export enum UserState {
	None,
	Artifacts,
	BarrierWalls,
	BarrierSolids,
	PortalEdges,
	PortalWarps,
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

	//Editor: selected scene
	//Viewer: current vieweing scene
	currentSceneId: string;
	setCurrentSceneId: (sceneId: string) => void;

	//Selected for editing
	currentNodeId: string;
	currentNodeType: NodeType | null;
	setCurrentNode: (nodeId: string, nodeType: NodeType) => void;
	resetCurrentNode: () => void;
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

	currentSceneId: "",
	setCurrentSceneId: (sceneId: string) => set({ currentSceneId: sceneId }),

	currentNodeId: "",
	currentNodeType: null,
	setCurrentNode: (nodeId: string, nodeType: NodeType) =>
		set({ currentNodeId: nodeId, currentNodeType: nodeType }),
	resetCurrentNode: () => set({ currentNodeId: "", currentNodeType: null }),
}));
