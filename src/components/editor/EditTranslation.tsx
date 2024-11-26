import { useGSStore } from "../../hooks/useGSStore";
import { GSScene } from "../../splats/GSScene";

export default function EditTranslation({ scene }: { scene: GSScene }) {
	const setSceneTransform = useGSStore((state) => state.setSceneTransform);

	const handlePositionChange = (axis: string, value: number) => {
		setSceneTransform(scene.id, {
			position: { ...scene.position, [axis]: value },
		});
		// console.log("temp disable");
	};

	return (
		<div>
			<input
				type="number"
				value={scene.position.x}
				onChange={(e) => handlePositionChange("x", parseFloat(e.target.value))}
			/>
			<input
				type="number"
				value={scene.position.y}
				onChange={(e) => handlePositionChange("y", parseFloat(e.target.value))}
			/>
			<input
				type="number"
				value={scene.position.z}
				onChange={(e) => handlePositionChange("z", parseFloat(e.target.value))}
			/>
		</div>
	);
}
