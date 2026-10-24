import { RefObject } from "react";
import { create } from "zustand";

interface ViewerState {
	viewerContainerRef: RefObject<HTMLDivElement | null> | null;
	setViewerContainerRef: (ref: RefObject<HTMLDivElement | null>) => void;
}

const useViewerStore = create<ViewerState>((set) => ({
	viewerContainerRef: null,
	setViewerContainerRef: (ref) => set({ viewerContainerRef: ref }),
}));

export default useViewerStore;
