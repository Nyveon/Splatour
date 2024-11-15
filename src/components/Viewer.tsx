import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PointerLockControls, KeyboardControls } from "@react-three/drei";
import styled from "@emotion/styled";
import Player from "../objects/Player";
import Debug from "../objects/Debug";
import Ambient from "../objects/Ambient";
import GSViewer from "../splats/GSViewer";
import GSMap from "../splats/GSMap";
import { KeyMap } from "../utils/constants";

const ViewerContainer = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	max-width: 100vw;
	max-height: 100vh;
	margin: 0;
	padding: 0;
`;

const gsmap = GSMap.deserializeJSON(
	'{"metadata":{"version":0,"name":"Test Map"},"scenes":[{"name":"Garden","filePath":"garden.ksplat","scale":{"x":1.7000000000000006,"y":1,"z":1},"rotation":{"x":2.69,"y":0,"z":0},"position":{"x":0,"y":4,"z":0}},{"name":"Living Room","filePath":"LivingRoom.ply","scale":{"x":1,"y":1,"z":1},"rotation":{"x":0,"y":0.37,"z":3.14},"position":{"x":-9,"y":3,"z":16}}]}'
);

export default function Viewer({ debug }: { debug: boolean }) {
	// const [ gsmap, setGSMap ] = useState(null);

	return (
		<ViewerContainer>
			<KeyboardControls map={KeyMap}>
				<Canvas camera={{ position: [0, 3.5, 10], fov: 75 }}>
					{debug && <Debug />}
					<Ambient />
					<PointerLockControls />
					<Player />
					<GSViewer gsmap={gsmap} />
				</Canvas>
			</KeyboardControls>
		</ViewerContainer>
	);
}
