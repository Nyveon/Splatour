import Viewer from "@/components/viewer/Viewer";
import { gsmDeserializeObjectJSON, SerialGSMap } from "@/model/GSMap";
import SceneStatic from "./gsplats/SceneStatic";

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
					return <SceneStatic key={sceneId} scene={scene} />;
				})}
			</Viewer>
		</>
	);
}
