import type { Vec3 } from "@/utils/data";
import type { DetectedFloor } from "@/utils/detectFloor";
import {
	alignSceneFloor,
	floorAlignmentSnapshot,
	sceneTransformSignature,
	type FloorAlignmentTransform,
} from "@/utils/floorAlignment";
import { create } from "zustand";
import { useGSStore } from "./useGSStore";
import { useInteractions, UserState } from "./useInteractions";

interface FloorAlignmentState {
	mode: "manual" | "automatic";
	searchHeight: number;
	detection: DetectedFloor | null;
	status: "idle" | "detecting" | "ready" | "failed";
	error: string;
	setSearchHeight: (height: number) => void;
	autoDetect: (sceneId: string) => void;
	setDetection: (result: DetectedFloor) => void;
	failDetection: (message: string) => void;
	sceneId: string;
	points: Vec3[];
	sourceTransform: string;
	placeAtZero: boolean;
	undoState: {
		sceneId: string;
		before: FloorAlignmentTransform;
		after: FloorAlignmentTransform;
	} | null;
	start: (sceneId: string) => void;
	addPoint: (point: Vec3) => void;
	removePoint: () => void;
	cancel: () => void;
	setPlaceAtZero: (value: boolean) => void;
	apply: () => void;
	undo: () => void;
}

function updateScene(sceneId: string, transform: FloorAlignmentTransform) {
	const store = useGSStore.getState();
	const current = store.gsmap.scenes[sceneId];
	if (!current) throw new Error("The scene is no longer available.");
	store.setSceneTransform(sceneId, {
		...transform,
		nodes: {
			...current.artifacts,
			...transform.barriers,
			...transform.portals,
		},
	});
}

export const useFloorAlignment = create<FloorAlignmentState>((set, get) => ({
	sceneId: "",
	mode: "manual",
	searchHeight: 0.6,
	detection: null,
	status: "idle",
	error: "",
	setSearchHeight: (searchHeight) => set({ searchHeight }),
	autoDetect: (sceneId) => {
		get().start(sceneId);
		set({ mode: "automatic", status: "detecting" });
	},
	setDetection: (detection) =>
		set({ detection, points: detection.points, status: "ready", error: "" }),
	failDetection: (error) => set({ error, status: "failed" }),
	points: [],
	sourceTransform: "",
	placeAtZero: true,
	undoState: null,
	start: (sceneId) => {
		const scene = useGSStore.getState().gsmap.scenes[sceneId];
		if (!scene) return;
		if (document.pointerLockElement) document.exitPointerLock();
		useInteractions.getState().unlock();
		useInteractions.getState().setUserState(UserState.None);
		useInteractions.getState().setCurrentSceneId(sceneId);
		set({
			sceneId,
			mode: "manual",
			detection: null,
			status: "idle",
			error: "",
			points: [],
			sourceTransform: sceneTransformSignature(scene),
		});
	},
	addPoint: (point) =>
		set((state) =>
			state.points.length < 3 ? { points: [...state.points, point] } : {}
		),
	removePoint: () => set((state) => ({ points: state.points.slice(0, -1) })),
	cancel: () =>
		set({
			sceneId: "",
			points: [],
			status: "idle",
			detection: null,
			error: "",
		}),
	setPlaceAtZero: (placeAtZero) => set({ placeAtZero }),
	apply: () => {
		const { sceneId, points, placeAtZero, sourceTransform } = get();
		const scene = useGSStore.getState().gsmap.scenes[sceneId];
		if (!scene || sceneTransformSignature(scene) !== sourceTransform)
			throw new Error(
				"The scene transform changed. Restart floor alignment and pick again."
			);
		const before = floorAlignmentSnapshot(scene);
		const after = alignSceneFloor(scene, points, placeAtZero);
		updateScene(sceneId, after);
		set({ sceneId: "", points: [], undoState: { sceneId, before, after } });
	},
	undo: () => {
		const previous = get().undoState;
		if (!previous) return;
		const scene = useGSStore.getState().gsmap.scenes[previous.sceneId];
		if (
			!scene ||
			JSON.stringify(floorAlignmentSnapshot(scene)) !==
				JSON.stringify(previous.after)
		)
			throw new Error(
				"The scene placement or ground nodes changed since alignment; undo is no longer available."
			);
		updateScene(previous.sceneId, previous.before);
		set({ undoState: null, sceneId: "", points: [] });
	},
}));
