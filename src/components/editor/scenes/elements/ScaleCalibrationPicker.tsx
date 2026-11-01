import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions } from "@/hooks/useInteractions";
import { useScaleCalibration } from "@/hooks/useScaleCalibration";
import { pickSplatSurface } from "@/utils/pickSplatSurface";
import { toastError } from "@/utils/toasts";
import { Html, Line } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export default function ScaleCalibrationPicker() {
	const { gl, camera, scene } = useThree();
	const sceneId = useScaleCalibration((state) => state.sceneId);
	const points = useScaleCalibration((state) => state.points);
	const currentSceneId = useInteractions((state) => state.currentSceneId);
	const selectedScene = useGSStore((state) => state.gsmap.scenes[sceneId]);
	useEffect(() => {
		if (sceneId && (currentSceneId !== sceneId || !selectedScene))
			useScaleCalibration.getState().cancel();
	}, [sceneId, currentSceneId, selectedScene]);
	useEffect(() => () => useScaleCalibration.getState().cancel(), []);
	useEffect(() => {
		if (!sceneId) return;
		const canvas = gl.domElement;
		const pick = (event: PointerEvent) => {
			if (event.button !== 0) return;
			event.preventDefault();
			event.stopImmediatePropagation();
			if (useScaleCalibration.getState().points.length >= 2) return;
			try {
				const point = pickSplatSurface(scene, sceneId, camera, canvas, event);
				if (!point) {
					toastError(
						"No surface found. Click a visible reference mark on the selected scene."
					);
					return;
				}
				useScaleCalibration
					.getState()
					.addPoint({ x: point.x, y: point.y, z: point.z });
			} catch (error) {
				toastError(error instanceof Error ? error.message : String(error));
			}
		};
		const stopClick = (event: MouseEvent) => event.stopImmediatePropagation();
		const escape = (event: KeyboardEvent) => {
			if (event.key === "Escape") useScaleCalibration.getState().cancel();
		};
		const cursor = canvas.style.cursor;
		canvas.style.cursor = "crosshair";
		canvas.addEventListener("pointerdown", pick, true);
		canvas.addEventListener("click", stopClick, true);
		window.addEventListener("keydown", escape);
		return () => {
			canvas.style.cursor = cursor;
			canvas.removeEventListener("pointerdown", pick, true);
			canvas.removeEventListener("click", stopClick, true);
			window.removeEventListener("keydown", escape);
		};
	}, [sceneId, gl, camera, scene]);
	if (!sceneId) return null;
	const positions = points.map(
		(p) => [p.x, p.y, p.z] as [number, number, number]
	);
	return (
		<group>
			{positions.map((point, index) => (
				<mesh key={index} position={point} renderOrder={1000}>
					<sphereGeometry args={[0.025, 12, 12]} />
					<meshBasicMaterial
						color={index ? "#78e08f" : "#ff7979"}
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
			{positions.length === 2 && (
				<Line
					points={positions}
					color="#ffd166"
					depthTest={false}
					depthWrite={false}
					lineWidth={2}
				/>
			)}
		</group>
	);
}
