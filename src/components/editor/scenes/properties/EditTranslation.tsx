import EditTransform from "@/components/editor/scenes/properties/EditTransform";

export default function EditTranslation({ sceneId }: { sceneId: string }) {
	return (
		<EditTransform
			sceneId={sceneId}
			type="position"
			icon="move"
			min={-Infinity}
			max={Infinity}
			step={0.5}
		/>
	);
}
