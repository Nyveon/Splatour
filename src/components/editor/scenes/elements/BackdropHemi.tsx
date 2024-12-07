import ColorPicker from "@/components/input/ColorPicker";
import { useGSStore } from "@/hooks/useGSStore";
import { GSSkyHemi } from "@/model/GSSky";
import { isHexColor } from "@/utils/data";

export default function BackdropHemi({ sceneId }: { sceneId: string }) {
	const setSceneTransform = useGSStore((state) => state.setSceneTransform);
	const sky = useGSStore(
		(state) => state.gsmap.scenes[sceneId].sky!
	) as GSSkyHemi;

	function handleChange(key: "primary" | "secondary", color: string) {
		if (!isHexColor(color)) {
			console.error("Invalid color", color);
			return;
		}

		setSceneTransform(sceneId, {
			sky: {
				...sky,
				[key]: color,
			},
		});
	}

	return (
		<>
			<ColorPicker
				label="Top Color"
				value={sky.primary}
				onChange={(e) => {
					handleChange("primary", e);
				}}
			/>
			<ColorPicker
				label="Bottom Color"
				value={sky.secondary}
				onChange={(e) => {
					handleChange("secondary", e);
				}}
			/>
		</>
	);
}
