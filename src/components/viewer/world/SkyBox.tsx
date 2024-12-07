import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions } from "@/hooks/useInteractions";
import { gssSkyGradient, SkyboxGradient } from "@/model/GSSky";
import { Environment, GradientTexture, Sky } from "@react-three/drei";
import { useEffect, useState } from "react";
import { BackSide } from "three";

export default function SkyBox() {
	const currentSceneId = useInteractions((state) => state.currentSceneId);
	const currentSceneSky = useGSStore(
		(state) => state.gsmap.scenes[currentSceneId]?.sky
	);
	const [skyboxGradient, setSkyboxGradient] = useState<SkyboxGradient | null>(
		null
	);

	useEffect(() => {
		if (!currentSceneSky) {
			setSkyboxGradient(null);
			return;
		}

		setSkyboxGradient(gssSkyGradient(currentSceneSky));
	}, [currentSceneSky]);

	return (
		<Environment background near={0.1} far={1000} resolution={256}>
			{skyboxGradient && (
				<mesh>
					<sphereGeometry args={[10, 12, 12]} />
					<meshBasicMaterial side={BackSide}>
						<GradientTexture
							stops={skyboxGradient.stops}
							colors={skyboxGradient.colors}
							size={256}
						/>
					</meshBasicMaterial>
				</mesh>
			)}

			<Sky
				turbidity={10}
				sunPosition={[1, 0.05, 0]}
				rayleigh={2}
				mieCoefficient={0.02}
				mieDirectionalG={0.8}
			/>
		</Environment>
	);
}
