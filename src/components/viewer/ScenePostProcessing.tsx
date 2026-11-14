import { useFrame } from "@react-three/fiber";

export default function ScenePostProcessing() {
	useFrame(({ gl, scene, camera }) => {
		gl.render(scene, camera);
	}, 1);
	return null;
}
