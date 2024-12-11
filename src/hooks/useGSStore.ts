import { GSMap, gsmCreateEmpty } from "@/model/GSMap";
import { GSNode, GSNodeArtifact, nodeIsArtifact } from "@/model/GSNode";
import { GSScene } from "@/model/GSScene";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface SceneState {
	gsmap: GSMap;
	setGSMap: (transform: Partial<GSMap>) => void;
	setSceneTransform: (sceneId: string, transform: Partial<GSScene>) => void;
	setDeleteScene: (sceneId: string) => void;
	setAddScene: (scene: GSScene) => void;

	//todo: refactor these to just a single nodes dict/array
	// with a type parameter
	setAddNode: (sceneId: string, node: GSNode) => void;
	setDeleteNode: (sceneId: string, nodeId: string) => void;
	setNodeTransform: (
		sceneId: string,
		nodeId: string,
		transform: Partial<GSNodeArtifact>
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
		setAddNode: (sceneId, node) =>
			set((state) => {
				const scene = state.gsmap.scenes[sceneId];
				if (scene) {
					scene.nodes[node.id] = node;

					if (nodeIsArtifact(node)) {
						scene.artifacts[node.id] = node;
					} else {
						console.error("Unknown node type", node);
					}
				}
			}),
		setDeleteNode: (sceneId, nodeId) =>
			set((state) => {
				const scene = state.gsmap.scenes[sceneId];
				if (scene) {
					const node = scene.nodes[nodeId];

					if (nodeIsArtifact(node)) {
						delete scene.artifacts[nodeId];
					} else {
						console.error("Unknown node type", node);
					}

					delete scene.nodes[nodeId];
				}
			}),
		setNodeTransform: (sceneId, nodeId, transform) =>
			set((state) => {
				const scene = state.gsmap.scenes[sceneId];
				console.log("here", transform);
				if (scene) {
					const node = scene.nodes[nodeId];
					Object.assign(node, transform);
					console.log(nodeId, sceneId, scene);

					if (nodeIsArtifact(node)) {
						const artifact = scene.artifacts[nodeId];
						if (artifact) {
							Object.assign(artifact, transform);
						}
					} else {
						console.error("Unknown node type", node);
					}
				}

				console.log(useGSStore.getState());
			}),
	}))
);
