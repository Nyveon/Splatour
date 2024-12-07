import ColorPicker from "@/components/input/ColorPicker";
import { useGSStore } from "@/hooks/useGSStore";
import { GSSkyFlat } from "@/model/GSSky";
import { isHexColor } from "@/utils/data";

export default function BackdropFlat({ sceneId }: { sceneId: string }) {
	const setSceneTransform = useGSStore((state) => state.setSceneTransform);
	const sky = useGSStore(
		(state) => state.gsmap.scenes[sceneId].sky!
	) as GSSkyFlat;

	function handleChange(color: string) {
		if (!isHexColor(color)) {
			console.error("Invalid color", color);
			return;
		}

		setSceneTransform(sceneId, {
			sky: {
				type: "flat",
				primary: color,
			},
		});
	}

	return (
		<ColorPicker
			label="Background Color"
			value={sky.primary}
			onChange={(e) => {
				handleChange(e);
			}}
		/>
	);
}
