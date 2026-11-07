import { create } from "zustand";

interface ProductSelection {
	sceneId: string;
	artifactId: string;
}
interface ProductState {
	active: ProductSelection | null;
	cartOpen: boolean;
	openCart: () => void;
	closeCart: () => void;
	deleteItem: (sceneId: string, artifactId: string) => void;
	aimed: ProductSelection | null;
	setAimed: (aimed: ProductSelection | null) => void;
	quantities: Record<string, number>;
	open: (sceneId: string, artifactId: string) => void;
	close: () => void;
	add: (sceneId: string, artifactId: string, step?: number) => void;
	remove: (sceneId: string, artifactId: string, step?: number) => void;
}

export const productCartKey = (sceneId: string, artifactId: string) =>
	`${sceneId}:${artifactId}`;

export const useProductStore = create<ProductState>((set) => ({
	active: null,
	cartOpen: false,
	openCart: () => set({ cartOpen: true, active: null, aimed: null }),
	closeCart: () => set({ cartOpen: false }),
	deleteItem: (sceneId, artifactId) =>
		set((state) => {
			const quantities = { ...state.quantities };
			delete quantities[productCartKey(sceneId, artifactId)];
			return { quantities };
		}),
	aimed: null,
	setAimed: (aimed) =>
		set((state) =>
			state.aimed?.sceneId === aimed?.sceneId &&
			state.aimed?.artifactId === aimed?.artifactId
				? state
				: { aimed }
		),
	quantities: {},
	open: (sceneId, artifactId) =>
		set({ active: { sceneId, artifactId }, cartOpen: false }),
	close: () => set({ active: null }),
	add: (sceneId, artifactId, step = 1) =>
		set((state) => {
			const key = productCartKey(sceneId, artifactId);
			return {
				quantities: {
					...state.quantities,
					[key]: (state.quantities[key] ?? 0) + step,
				},
			};
		}),
	remove: (sceneId, artifactId, step = 1) =>
		set((state) => {
			const key = productCartKey(sceneId, artifactId);
			const quantities = { ...state.quantities };
			const next = (quantities[key] ?? 0) - step;
			if (next > 0) quantities[key] = next;
			else delete quantities[key];
			return { quantities };
		}),
}));
