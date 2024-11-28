import testmap from "@/assets/maps/test2.json";
import { GSMap, gsmDeserializeObjectJSON } from "@/model/GSMap";
import { GSScene } from "@/model/GSScene";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface SceneState {
	gsmap: GSMap;
	setGSMap: (transform: Partial<GSMap>) => void;
	setSceneTransform: (sceneId: string, transform: Partial<GSScene>) => void;
	setDeleteScene: (sceneId: string) => void;
	setAddScene: (scene: GSScene) => void;
}

const initialGSMap = gsmDeserializeObjectJSON(testmap);

export const useGSStore = create<SceneState>()(
	immer((set) => ({
		gsmap: initialGSMap,
		setGSMap: (transform) =>
			set((state) => {
				Object.assign(state.gsmap, transform);
			}),
		setSceneTransform: (sceneId, transform) =>
			set((state) => {
				const scene = state.gsmap.scenes[sceneId];
				if (scene) {
					Object.assign(scene, transform);
				}
			}),
		setDeleteScene: (sceneId) =>
			set((state) => {
				delete state.gsmap.scenes[sceneId];
			}),
		setAddScene: (scene: GSScene) =>
			set((state) => {
				state.gsmap.scenes[scene.id] = scene;
			}),
	}))
);
