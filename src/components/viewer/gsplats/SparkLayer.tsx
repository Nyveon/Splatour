import { invalidateScene } from "@/utils/rendering";
import { createSplatRenderer } from "@/utils/splatRenderer";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

/** One sorter/renderer for every visible splat mesh in this Three.js scene. */
export default function SparkLayer() {
	const { gl, scene, invalidate } = useThree();
	useEffect(() => {
		const changed = () => invalidateScene(scene, invalidate);
		const spark = createSplatRenderer(gl, changed);
		const normalSortInterval = spark.minSortIntervalMs;
		const enterVR = () => {
			spark.minSortIntervalMs = 0;
			changed();
		};
		const exitVR = () => {
			spark.minSortIntervalMs = normalSortInterval;
			changed();
		};
		gl.xr.addEventListener("sessionstart", enterVR);
		gl.xr.addEventListener("sessionend", exitVR);
		if (gl.xr.isPresenting) enterVR();
		scene.add(spark);
		changed();
		return () => {
			gl.xr.removeEventListener("sessionstart", enterVR);
			gl.xr.removeEventListener("sessionend", exitVR);
			scene.remove(spark);
			spark.dispose();
		};
	}, [gl, scene, invalidate]);
	return null;
}
