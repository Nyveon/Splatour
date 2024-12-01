import { RefObject } from "react";
import { create } from "zustand";

interface ViewerState {
	viewerContainerRef: RefObject<HTMLDivElement> | null;
	setViewerContainerRef: (ref: RefObject<HTMLDivElement>) => void;
}

const useViewerStore = create<ViewerState>((set) => ({
	viewerContainerRef: null,
	setViewerContainerRef: (ref) => set({ viewerContainerRef: ref }),
}));

export default useViewerStore;
