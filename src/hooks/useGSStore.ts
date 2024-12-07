import { GSMap, gsmCreateEmpty } from "@/model/GSMap";
import { GSScene } from "@/model/GSScene";
import { GSSceneArtifact } from "@/model/GSSceneArtifact";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface SceneState {
	gsmap: GSMap;
	setGSMap: (transform: Partial<GSMap>) => void;
	setSceneTransform: (sceneId: string, transform: Partial<GSScene>) => void;
	setDeleteScene: (sceneId: string) => void;
	setAddScene: (scene: GSScene) => void;
	setAddArtifact: (sceneId: string, artifact: GSSceneArtifact) => void;
	setArtifactTransform: (
		sceneId: string,
		artifactId: string,
		transform: Partial<GSSceneArtifact>
	) => void;
}

const initialGSMap = gsmCreateEmpty();

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
		setAddArtifact: (sceneId, artifact) =>
			set((state) => {
				const scene = state.gsmap.scenes[sceneId];
				if (scene) {
					scene.artifacts[artifact.id] = artifact;
				}
			}),
		setArtifactTransform: (sceneId, artifactId, transform) =>
			set((state) => {
				const scene = state.gsmap.scenes[sceneId];
				if (scene) {
					const artifact = scene.artifacts[artifactId];
					if (artifact) {
						Object.assign(artifact, transform);
					}
				}
			}),
	}))
);
