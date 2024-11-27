import EditTransform from "@/components/editor/scenes/EditTransform";

export default function EditScale({ sceneId }: { sceneId: string }) {
	return (
		<EditTransform
			sceneId={sceneId}
			type="scale"
			icon="maximize-2"
			min={-Infinity}
			max={Infinity}
			step={0.5}
			linkable={true}
		/>
	);
}
