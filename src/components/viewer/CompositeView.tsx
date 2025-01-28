import { useGSStore } from "@/hooks/useGSStore";
import { gsmDeserializeObjectJSON, SerialGSMap } from "@/model/GSMap";
import { useEffect } from "react";
import Viewer from "./Viewer";
import CompositeViewer from "./gsplats/CompositeViewer";

export default function CompositeView({
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
		<Viewer>
			<CompositeViewer />
		</Viewer>
	);
}
