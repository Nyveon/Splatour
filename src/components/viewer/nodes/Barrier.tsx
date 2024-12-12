import { useGSStore } from "@/hooks/useGSStore";
import { BarrierShape } from "@/model/GSNode";
import BarrierSolid from "./BarrierSolid";

export default function Barrier({ sceneId, barrierId }: { sceneId: string; barrierId: string; }) {
    const shape = useGSStore((state) => state.gsmap.scenes[sceneId].barriers[barrierId].shape);
    
    if (shape === BarrierShape.Wall) {
        console.error("not yet implemented")
        return null;
    } else if (shape === BarrierShape.Solid) {
        return <BarrierSolid sceneId={sceneId} barrierId={barrierId} />;
    } else {
        return null;
    }
}