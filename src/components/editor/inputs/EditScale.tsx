import EditTransform from "@/components/editor/inputs/EditTransform";

export default function EditScale({ sceneId }: { sceneId: string }) {
	return (
		<EditTransform
			sceneId={sceneId}
			type="scale"
			icon="maximize-2"
			min={-Infinity}
			max={Infinity}
			step={0.5}
		/>
	);
}
