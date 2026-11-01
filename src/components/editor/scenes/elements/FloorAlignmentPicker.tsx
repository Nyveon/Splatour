import { useFloorAlignment } from "@/hooks/useFloorAlignment";
import { useInteractions } from "@/hooks/useInteractions";
import type { Vec3 } from "@/utils/data";
import { detectFloor } from "@/utils/detectFloor";
import { floorPlane } from "@/utils/floorAlignment";
import { toastError } from "@/utils/toasts";
import { Html, Line } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { SplatMesh } from "@sparkjsdev/spark";
import { useEffect } from "react";
import { Raycaster, Vector2, Vector3, type Intersection } from "three";

const colors = ["#ff7979", "#78e08f", "#7ed6ff"];

/** Raycast only the selected source mesh, once per click, never per frame. */
export default function FloorAlignmentPicker() {
	const { gl, camera, scene } = useThree();
	const sceneId = useFloorAlignment((state) => state.sceneId);
	const points = useFloorAlignment((state) => state.points);
	const mode = useFloorAlignment((state) => state.mode);
	const status = useFloorAlignment((state) => state.status);
	const searchHeight = useFloorAlignment((state) => state.searchHeight);
	const currentSceneId = useInteractions((state) => state.currentSceneId);
	useEffect(() => {
		if (sceneId && currentSceneId !== sceneId)
			useFloorAlignment.getState().cancel();
	}, [sceneId, currentSceneId]);
	useEffect(() => () => useFloorAlignment.getState().cancel(), []);
	useEffect(() => {
		if (!sceneId || mode !== "automatic" || status !== "detecting") return;
		const timer = window.setTimeout(() => {
			try {
				let target: SplatMesh | undefined;
				scene.traverse((object) => {
					if (object.userData.floorAlignmentSceneId !== sceneId) return;
					object.traverseVisible((child) => {
						if (child instanceof SplatMesh && child.isInitialized)
							target = child;
					});
				});
				if (!target)
					throw new Error(
						"Wait for the selected scene to load and make sure it is visible."
					);
				target.updateWorldMatrix(true, false);
				const mesh = target;
				const samples: Vec3[] = [],
					world = new Vector3();
				let seen = 0,
					seed = 42;
				mesh.forEachSplat((_index, center, _scales, _quaternion, opacity) => {
					if (opacity < 0.2) return;
					world.copy(center).applyMatrix4(mesh.matrixWorld);
					if (
						Math.abs(world.y) > searchHeight ||
						![world.x, world.y, world.z].every(Number.isFinite)
					)
						return;
					seen++;
					seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
					const index =
						samples.length < 8000
							? samples.length
							: Math.floor((seed / 4294967296) * seen);
					if (index < 8000)
						samples[index] = { x: world.x, y: world.y, z: world.z };
				});
				useFloorAlignment.getState().setDetection(detectFloor(samples));
			} catch (error) {
				useFloorAlignment
					.getState()
					.failDetection(
						error instanceof Error ? error.message : String(error)
					);
			}
		}, 50);
		return () => window.clearTimeout(timer);
	}, [sceneId, mode, status, searchHeight, scene]);
	useEffect(() => {
		if (!sceneId) return;
		const canvas = gl.domElement;
		const pick = (event: PointerEvent) => {
			if (event.button !== 0) return;
			event.preventDefault();
			event.stopImmediatePropagation();
			if (useFloorAlignment.getState().mode !== "manual") return;
			if (useFloorAlignment.getState().points.length >= 3) return;
			try {
				const bounds = canvas.getBoundingClientRect();
				const ray = new Raycaster();
				ray.setFromCamera(
					new Vector2(
						((event.clientX - bounds.left) / bounds.width) * 2 - 1,
						(-(event.clientY - bounds.top) / bounds.height) * 2 + 1
					),
					camera
				);
				const hits: Intersection[] = [];
				scene.traverse((object) => {
					if (object.userData.floorAlignmentSceneId !== sceneId) return;
					object.traverseVisible((child) => {
						if (!(child instanceof SplatMesh) || !child.isInitialized) return;
						child.updateWorldMatrix(true, false);
						const wasRaycastable = child.raycastable;
						try {
							child.raycastable = true;
							child.raycast(ray, hits);
						} finally {
							child.raycastable = wasRaycastable;
						}
					});
				});
				hits.sort((a, b) => a.distance - b.distance);
				const point = hits[0]?.point;
				if (!point) {
					toastError(
						"No splat surface found. Click a visible part of this scene's floor."
					);
					return;
				}
				useFloorAlignment
					.getState()
					.addPoint({ x: point.x, y: point.y, z: point.z });
			} catch (error) {
				toastError(error instanceof Error ? error.message : String(error));
			}
		};
		const stopClick = (event: MouseEvent) => {
			event.stopImmediatePropagation();
		};
		const escape = (event: KeyboardEvent) => {
			if (event.key === "Escape") useFloorAlignment.getState().cancel();
		};
		canvas.addEventListener("pointerdown", pick, true);
		canvas.addEventListener("click", stopClick, true);
		window.addEventListener("keydown", escape);
		const cursor = canvas.style.cursor;
		canvas.style.cursor = mode === "manual" ? "crosshair" : "default";
		return () => {
			canvas.removeEventListener("pointerdown", pick, true);
			canvas.removeEventListener("click", stopClick, true);
			window.removeEventListener("keydown", escape);
			canvas.style.cursor = cursor;
		};
	}, [sceneId, mode, gl, scene, camera]);
	if (!sceneId) return null;
	const positions = points.map(
		(point) => [point.x, point.y, point.z] as [number, number, number]
	);
	let normalLine: [number, number, number][] | undefined;
	try {
		const { center, normal } = floorPlane(points);
		normalLine = [
			center.toArray(),
			center.clone().addScaledVector(normal, 0.5).toArray(),
		];
	} catch {
		/* An incomplete or invalid triangle has no normal preview. */
	}
	return (
		<group>
			{positions.map((point, index) => (
				<mesh key={index} position={point} renderOrder={1000}>
					<sphereGeometry args={[0.045, 12, 12]} />
					<meshBasicMaterial
						color={colors[index]}
						depthTest={false}
						depthWrite={false}
						toneMapped={false}
					/>
					<Html
						center
						style={{
							pointerEvents: "none",
							color: "white",
							textShadow: "0 1px 3px black",
						}}
					>
						{index + 1}
					</Html>
				</mesh>
			))}
			{positions.length > 1 && (
				<Line
					points={
						positions.length === 3 ? [...positions, positions[0]] : positions
					}
					color="#ffd166"
					depthTest={false}
					depthWrite={false}
					lineWidth={2}
				/>
			)}
			{normalLine && (
				<Line
					points={normalLine}
					color="#78e08f"
					depthTest={false}
					depthWrite={false}
					lineWidth={2}
				/>
			)}
		</group>
	);
}
