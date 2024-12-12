import { GSMap, gsmCreateEmpty } from "@/model/GSMap";
import { GSNode, nodeIsArtifact, nodeIsBarrier } from "@/model/GSNode";
import { GSScene } from "@/model/GSScene";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface SceneState {
	gsmap: GSMap;
	setGSMap: (transform: Partial<GSMap>) => void;
	setSceneTransform: (sceneId: string, transform: Partial<GSScene>) => void;
	setDeleteScene: (sceneId: string) => void;
	setAddScene: (scene: GSScene) => void;
	setAddNode: (sceneId: string, node: GSNode) => void;
	setDeleteNode: (sceneId: string, nodeId: string) => void;
	setNodeTransform: (
		sceneId: string,
		nodeId: string,
		transform: Partial<GSNode>
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
					if (nodeIsArtifact(node)) {
						scene.artifacts[node.id] = node;
					} else if (nodeIsBarrier(node)) {
						scene.barriers[node.id] = node;
					} else {
						throw new Error("Unknown node type");
					}

					scene.nodes[node.id] = node;
				} else {
					throw new Error("Scene not found");
				}
			}),
		setDeleteNode: (sceneId, nodeId) =>
			set((state) => {
				const scene = state.gsmap.scenes[sceneId];
				if (scene) {
					const node = scene.nodes[nodeId];

					if (nodeIsArtifact(node)) {
						delete scene.artifacts[nodeId];
					} else if (nodeIsBarrier(node)) {
						delete scene.barriers[nodeId];
					} else {
						throw new Error("Unknown node type");
					}

					delete scene.nodes[nodeId];
				}
			}),
		setNodeTransform: (sceneId, nodeId, transform) =>
			set((state) => {
				const scene = state.gsmap.scenes[sceneId];
				if (scene) {
					const node = scene.nodes[nodeId];

					if (nodeIsArtifact(node)) {
						const artifact = scene.artifacts[nodeId];
						Object.assign(artifact, transform);
					} else if (nodeIsBarrier(node)) {
						const barrier = scene.barriers[nodeId];
						Object.assign(barrier, transform);
					} else {
						throw new Error("Unknown node type");
					}

					Object.assign(node, transform);
				}

				console.log(useGSStore.getState());
			}),
	}))
);
