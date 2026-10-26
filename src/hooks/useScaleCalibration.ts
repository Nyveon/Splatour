import type { Vec3 } from "@/utils/data";
import { sceneTransformSignature } from "@/utils/floorAlignment";
import {
	calibrateSceneScale,
	scaleCalibrationSnapshot,
	type ScaleCalibrationTransform,
} from "@/utils/scaleCalibration";
import { create } from "zustand";
import { useFloorAlignment } from "./useFloorAlignment";
import { useGSStore } from "./useGSStore";
import { useInteractions, UserState } from "./useInteractions";

interface ScaleCalibrationState {
	sceneId: string;
	points: Vec3[];
	meters: number;
	sourceTransform: string;
	undoState: {
		sceneId: string;
		before: ScaleCalibrationTransform;
		after: ScaleCalibrationTransform;
	} | null;
	start: (sceneId: string) => void;
	addPoint: (point: Vec3) => void;
	removePoint: () => void;
	setMeters: (meters: number) => void;
	cancel: () => void;
	apply: () => void;
	undo: () => void;
}

function updateScene(sceneId: string, transform: ScaleCalibrationTransform) {
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

export const useScaleCalibration = create<ScaleCalibrationState>(
	(set, get) => ({
		sceneId: "",
		points: [],
		meters: 0.8,
		sourceTransform: "",
		undoState: null,
		start: (sceneId) => {
			const scene = useGSStore.getState().gsmap.scenes[sceneId];
			if (!scene) return;
			useFloorAlignment.getState().cancel();
			if (document.pointerLockElement) document.exitPointerLock();
			useInteractions.getState().unlock();
			useInteractions.getState().setUserState(UserState.None);
			useInteractions.getState().setCurrentSceneId(sceneId);
			set({
				sceneId,
				points: [],
				sourceTransform: sceneTransformSignature(scene),
			});
		},
		addPoint: (point) =>
			set((state) =>
				state.points.length < 2 ? { points: [...state.points, point] } : {}
			),
		removePoint: () => set((state) => ({ points: state.points.slice(0, -1) })),
		setMeters: (meters) => set({ meters }),
		cancel: () => set({ sceneId: "", points: [] }),
		apply: () => {
			const { sceneId, points, meters, sourceTransform } = get();
			const scene = useGSStore.getState().gsmap.scenes[sceneId];
			if (!scene || sceneTransformSignature(scene) !== sourceTransform)
				throw new Error(
					"The scene transform changed. Restart scale calibration and pick again."
				);
			const before = scaleCalibrationSnapshot(scene);
			const after = calibrateSceneScale(scene, points, meters);
			updateScene(sceneId, after);
			set({ sceneId: "", points: [], undoState: { sceneId, before, after } });
		},
		undo: () => {
			const previous = get().undoState;
			if (!previous) return;
			const scene = useGSStore.getState().gsmap.scenes[previous.sceneId];
			if (
				!scene ||
				JSON.stringify(scaleCalibrationSnapshot(scene)) !==
					JSON.stringify(previous.after)
			)
				throw new Error(
					"Scene scale, placement or ground nodes changed; undo is no longer available."
				);
			updateScene(previous.sceneId, previous.before);
			set({ undoState: null, sceneId: "", points: [] });
		},
	})
);
