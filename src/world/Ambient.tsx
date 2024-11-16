import { Sky } from "@react-three/drei";

export default function Ambient() {
	return (
		<>
			<ambientLight intensity={0.5} />
			<directionalLight intensity={0.8} position={[10, 20, 10]} />
			<Sky
				turbidity={10}
				sunPosition={[1, 0.05, 0]}
				rayleigh={2}
				mieCoefficient={0.02}
				mieDirectionalG={0.8}
			/>
		</>
	);
}
