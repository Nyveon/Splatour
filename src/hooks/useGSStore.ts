import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import testmap from "../assets/maps/test2.json";
import { GSMap, gsmDeserializeObjectJSON } from "../model/GSMap";
import { GSScene } from "../model/GSScene";

interface SceneState {
	gsmap: GSMap;
	setSceneTransform: (sceneId: string, transform: Partial<GSScene>) => void;
}

const initialGSMap = gsmDeserializeObjectJSON(testmap);

export const useGSStore = create<SceneState>()(
	immer((set) => ({
		gsmap: initialGSMap,
		setSceneTransform: (sceneId, transform) =>
			set((state) => {
				const scene = state.gsmap.scenes[sceneId];
				if (scene) {
					Object.assign(scene, transform);
				}
			}),
	}))
);
