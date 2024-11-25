import { create } from "zustand";
import testmap from "../assets/maps/test2.json";
import { GSMap, gsmDeserializeObjectJSON } from "../splats/GSMap";
// import { GSScene, gssUpdateTransform } from "../splats/GSScene";
// import sceneContainerMap from "../splats/sceneContainerMap";

interface SceneState {
	gsmap: GSMap;
	setGSMap: (gsmap: GSMap) => void;
	// updateScene: (sceneId: string, newProperties: Partial<GSScene>) => void;
	// Can have async in zustand
	// incrementAsync: () => Promise<void>;
}

const initialGSMap = gsmDeserializeObjectJSON(testmap);

export const useGSStore = create<SceneState>((set) => ({
	// gsmap: GSMap.createEmpty(),
	gsmap: initialGSMap,
	setGSMap: (gsmap: GSMap) => set({ gsmap }),
	// updateScene: (sceneId: string, newProperties: Partial<GSScene>) =>
	// 	set((state) => {
	// 		const newScenes = state.gsmap.scenes.map((scene) => {
	// 			if (scene.id === sceneId) {
	// 				const updatedScene = { ...scene, ...newProperties };
	// 				// Update the container
	// 				const container = sceneContainerMap.get(sceneId);
	// 				if (container) {
	// 					gssUpdateTransform(updatedScene, container);
	// 				}
	// 				return updatedScene;
	// 			}
	// 			return scene;
	// 		});
	// 		return {
	// 			gsmap: { ...state.gsmap, scenes: newScenes },
	// 		};
	// 	}),
	// incrementAsync: async () => {
	//    await new Promise((resolve) => setTimeout(resolve, 1000));
	//    set((state) => ({ count: state.count + 1 }));
	// },
}));
