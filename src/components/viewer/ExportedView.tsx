import Viewer from "@/components/viewer/Viewer";
import { gsmDeserializeObjectJSON, SerialGSMap } from "@/model/GSMap";
import GSViewer from "./GS3DViewer";

export default function ExportedView({
	serialMap,
}: {
	serialMap: SerialGSMap;
}) {
	const gsmap = gsmDeserializeObjectJSON(serialMap);

	return (
		<>
			<Viewer>
				{Object.entries(gsmap.scenes).map(([sceneId, scene]) => {
					return (
						<GSViewer
							key={sceneId}
							sceneData={{ filePath: scene.filePath }}
							scenePosition={scene.position}
							sceneRotation={scene.rotation}
							sceneScale={scene.scale}
						/>
					);
				})}
			</Viewer>
		</>
	);
}
