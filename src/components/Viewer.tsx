import styled from "@emotion/styled";
import { KeyboardControls, PointerLockControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import GSMap from "../splats/GSMap";
import GSViewer from "../splats/GSViewer";
import { KeyMap } from "../utils/constants";
import Ambient from "../world/Ambient";
import Debug from "../world/Debug";
import Player from "../world/Player";

const ViewerContainer = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	max-width: 100vw;
	max-height: 100vh;
	margin: 0;
	padding: 0;
`;

function useGSMap() {
	const [gsmap, setGSMap] = useState<GSMap | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState<Boolean>(true);

	useEffect(() => {
		fetch("/empty.json", { mode: "no-cors" })
			.then((response) => {
				if (response.status >= 400) {
					throw new Error("Server error");
				}
				return response.json();
			})
			.then((data: any) => {
				console.log(data);
				return setGSMap(GSMap.deserializeObjectJSON(data));
			})
			.catch((error: Error) => setError(error))
			.finally(() => setLoading(false));
	}, []);

	return { gsmap, error, loading };
}

export default function Viewer({ debug }: { debug: boolean }) {
	const { gsmap, error, loading } = useGSMap();

	if (loading) return <h1>Loading...</h1>;

	if (error) return <h1>Error: {error.message}</h1>;

	return (
		<ViewerContainer>
			<KeyboardControls map={KeyMap}>
				<Canvas camera={{ position: [0, 3.5, 10], fov: 75 }}>
					{debug && <Debug />}
					<Ambient />
					<PointerLockControls />
					<Player />
					{gsmap && <GSViewer gsmap={gsmap} />}
				</Canvas>
			</KeyboardControls>
		</ViewerContainer>
	);
}
