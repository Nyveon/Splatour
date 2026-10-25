import { createSplatRenderer } from "@/utils/splatRenderer";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

/** One sorter/renderer for every visible splat mesh in this Three.js scene. */
export default function SparkLayer() {
	const { gl, scene, invalidate } = useThree();
	useEffect(() => {
		const spark = createSplatRenderer(gl, invalidate);
		scene.add(spark);
		return () => {
			scene.remove(spark);
			spark.dispose();
		};
	}, [gl, scene, invalidate]);
	return null;
}
