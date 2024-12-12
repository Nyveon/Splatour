import { useGSStore } from "@/hooks/useGSStore";
import { useShallow } from "zustand/react/shallow";
import Barrier from "./Barrier";

export default function SceneBarriers({ sceneId }: { sceneId: string }) {
	const barrierIds = useGSStore(
		useShallow((state) => Object.keys(state.gsmap.scenes[sceneId].barriers))
	);

	if (!barrierIds) {
		return null;
	}

	return (
		<>
			{barrierIds.map((barrierId) => {
				return (
					<Barrier key={barrierId} sceneId={sceneId} barrierId={barrierId} />
				);
			})}
		</>
	);
}
