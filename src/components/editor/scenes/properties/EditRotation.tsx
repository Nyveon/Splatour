import EditTransform from "@/components/editor/scenes/properties/EditTransform";
import * as THREE from "three";

export default function EditRotation({ sceneId }: { sceneId: string }) {
	return (
		<EditTransform
			sceneId={sceneId}
			type="rotation"
			slider={true}
			icon="rotate-cw"
			min={0}
			max={360}
			step={1}
			convertTo={(value) => THREE.MathUtils.degToRad(value)}
			convertFrom={(value) => THREE.MathUtils.radToDeg(value)}
		/>
	);
}
