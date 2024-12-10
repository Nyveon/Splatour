import Viewer from "@/components/viewer/Viewer";
import { useGSStore } from "@/hooks/useGSStore";
import { gsmDeserializeObjectJSON, SerialGSMap } from "@/model/GSMap";
import { useEffect } from "react";
import SceneStatic from "./gsplats/SceneStatic";

export default function ExportedView({
	serialMap,
}: {
	serialMap: SerialGSMap;
}) {
	const gsmap = gsmDeserializeObjectJSON(serialMap);
	const setGSMap = useGSStore((state) => state.setGSMap);

	useEffect(() => {
		setGSMap(gsmap);
	}, [setGSMap, gsmap]);

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
