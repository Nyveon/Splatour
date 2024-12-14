import styled from "@emotion/styled";
import ArtifactPlacer from "../editor/nodes/artifacts/ArtifactPlacer";
import BarrierSolidPlacer from "../editor/nodes/barriers/BarrierSolidPlacer";
import BarrierWallPlacer from "../editor/nodes/barriers/BarrierWallPlacer";
import PortalPlacer from "../editor/nodes/portals/PortalEdgePlacer";
import GSMapEditable from "./MapDynamic";
import Viewer from "./Viewer";
import DebugUtils from "./interface/DebugUtils";
import Hotkeys from "./interface/Hotkeys";

const Preview = styled.section`
	position: relative;
	flex-grow: 1;
	flex-shrink: 1;
	overflow: hidden;
`;

// function Portal() {
// 	const [currentScene, setCurrentScene] = useState("A");
// 	const sceneAId = "b02fe564-0a6d-4f65-bd90-ddceaffb58b1"; // Scene A ID
// 	const sceneBId = "46961920-f626-4220-8c4e-0c1bca0afa98"; // Scene B ID

// 	// Positions of the portals
// 	const portalAPosition = useRef(new Vector3(-1.4, 0, -3.75)); // Portal A
// 	const portalBPosition = useRef(new Vector3(-1.3, 0, -3.75)); // Portal B

// 	const portalSize = [1, 2, 1]; // Size of the portal boxes (width, height, depth)

// 	useFrame(({ camera }) => {
// 		const playerPos = camera.position.clone();

// 		// Check if the player is touching Portal A
// 		if (
// 			Math.abs(playerPos.x - portalAPosition.current.x) < portalSize[0] / 2 &&
// 			Math.abs(playerPos.z - portalAPosition.current.z) < portalSize[2] / 2
// 		) {
// 			if (currentScene !== "B") {
// 				console.log("hi");
// 				setCurrentScene("B");
// 				useInteractions.getState().setCurrentSceneId(sceneBId); // Switch to Scene B
// 			}
// 		}

// 		// Check if the player is touching Portal B
// 		if (
// 			Math.abs(playerPos.x - portalBPosition.current.x) < portalSize[0] / 2 &&
// 			Math.abs(playerPos.z - portalBPosition.current.z) < portalSize[2] / 2
// 		) {
// 			if (currentScene !== "A") {
// 				console.log("hi");
// 				setCurrentScene("A");
// 				useInteractions.getState().setCurrentSceneId(sceneAId); // Switch to Scene A
// 			}
// 		}
// 	});

// 	return (
// 		<>
// 			{/* Portal A */}
// 			<Box args={portalSize} position={portalAPosition.current}>
// 				<meshBasicMaterial
// 					attach="material"
// 					color={currentScene === "A" ? "#ff0000" : "#aaaaaa"} // Red for Scene A
// 					opacity={0.5}
// 					transparent
// 				/>
// 			</Box>

// 			{/* Portal B */}
// 			<Box args={portalSize} position={portalBPosition.current}>
// 				<meshBasicMaterial
// 					attach="material"
// 					color={currentScene === "B" ? "#0000ff" : "#aaaaaa"} // Blue for Scene B
// 					opacity={0.5}
// 					transparent
// 				/>
// 			</Box>
// 		</>
// 	);
// }

export default function EditorView() {
	return (
		<Preview>
			<Viewer>
				<Hotkeys />
				<DebugUtils />
				<GSMapEditable />
				<ArtifactPlacer />
				<BarrierSolidPlacer />
				<BarrierWallPlacer />
				<PortalPlacer />
			</Viewer>
		</Preview>
	);
}
