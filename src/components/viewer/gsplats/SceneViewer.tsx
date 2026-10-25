import { createSplatMesh } from "@/utils/splatRenderer";
import { toastError } from "@/utils/toasts";
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

	useEffect(() => {
		const host = hostRef.current;
		if (!host) return;
		let cancelled = false;
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
				const fileBytes = file ? await file.arrayBuffer() : undefined;
				if (cancelled) return;
				mesh = createSplatMesh(filePath, fileBytes);
				await mesh.initialized;
				settled = true;
				if (cancelled) {
					dispose();
					return;
				}
				host.add(mesh);
				console.info("Splat scene loaded", {
					file: filePath,
					splats: mesh.numSplats,
					shDegree: mesh.extSplats?.getNumSh() ?? 0,
				});
			} catch (error) {
				settled = true;
				dispose();
				if (!cancelled) {
					console.error(`Failed to load ${filePath}`, error);
					toastError(
						`Could not load ${filePath}: ${error instanceof Error ? error.message : String(error)}`
					);
				}
			} finally {
				toast.dismiss(loading);
			}
		})();

		return () => {
			cancelled = true;
			toast.dismiss(loading);
			// A decoder may finish after unmount; dispose it once its promise settles.
			if (settled) dispose();
		};
	}, [filePath, file]);

	return (
		<group ref={ref}>
			<group ref={hostRef} />
		</group>
	);
});

export default SceneViewer;
