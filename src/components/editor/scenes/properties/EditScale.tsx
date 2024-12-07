import EditTransform from "@/components/editor/scenes/properties/EditTransform";

export default function EditScale({ sceneId }: { sceneId: string }) {
	return (
		<EditTransform
			sceneId={sceneId}
			type="scale"
			icon="maximize-2"
			min={0.1}
			max={Infinity}
			step={0.1}
			linkable={true}
		/>
	);
}
