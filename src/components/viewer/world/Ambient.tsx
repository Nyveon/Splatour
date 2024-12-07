import SkyBox from "./SkyBox";

export default function Ambient() {
	return (
		<>
			<ambientLight intensity={0.5} />
			<directionalLight intensity={0.8} position={[10, 20, 10]} />
			<SkyBox />
		</>
	);
}
