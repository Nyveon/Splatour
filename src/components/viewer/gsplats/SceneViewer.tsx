import { invalidateScene } from "@/utils/rendering";
import { createSplatMesh } from "@/utils/splatRenderer";
import { loadSceneSource } from "@/utils/spzParts";
import { toastError } from "@/utils/toasts";
import { useThree } from "@react-three/fiber";
import type { SplatMesh } from "@sparkjsdev/spark";
import { forwardRef, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import type { Group } from "three";

interface SceneViewerProps {
	sceneData: { filePath: string; file?: File };
}

const SceneViewer = forwardRef<Group, SceneViewerProps>(function SceneViewer(
	{ sceneData: { filePath, file } },
	ref
) {
	const hostRef = useRef<Group>(null);
	const invalidate = useThree((state) => state.invalidate);
	const scene = useThree((state) => state.scene);

	useEffect(() => {
		const host = hostRef.current;
		if (!host) return;
		host.userData.splatLoading = true;
		let cancelled = false;
		const controller = new AbortController();
		let settled = false;
		let disposed = false;
		let mesh: SplatMesh | undefined;
		const loading = toast.loading(`Loading ${filePath.split("/").pop()}…`);
		const dispose = () => {
			if (!mesh || disposed) return;
			disposed = true;
			mesh.removeFromParent();
			mesh.dispose();
		};

		void (async () => {
			try {
				const source = file
					? { fileName: file.name, fileBytes: await file.arrayBuffer() }
					: await loadSceneSource(filePath, controller.signal);
				if (cancelled) return;
				mesh = createSplatMesh(source.fileName, source.fileBytes);
				await mesh.initialized;
				settled = true;
				if (cancelled) {
					dispose();
					return;
				}
				host.add(mesh);
				mesh.userData.splatReady = true;
				console.info("Splat scene loaded", {
					file: filePath,
					splats: mesh.numSplats,
					shDegree: mesh.extSplats?.getNumSh() ?? 0,
				});
			} catch (error) {
				controller.abort();
				settled = true;
				dispose();
				if (!cancelled) {
					console.error(`Failed to load ${filePath}`, error);
					toastError(
						`Could not load ${filePath}: ${error instanceof Error ? error.message : String(error)}`
					);
				}
			} finally {
				if (!cancelled) {
					host.userData.splatLoading = false;
					invalidateScene(scene, invalidate);
				}
				toast.dismiss(loading);
			}
		})();

		return () => {
			cancelled = true;
			controller.abort();
			host.userData.splatLoading = false;
			toast.dismiss(loading);
			// A decoder may finish after unmount; dispose it once its promise settles.
			if (settled) dispose();
			invalidateScene(scene, invalidate);
		};
	}, [filePath, file, scene, invalidate]);

	return (
		<group ref={ref}>
			<group ref={hostRef} />
		</group>
	);
});

export default SceneViewer;
