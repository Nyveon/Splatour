import Icon from "@/components/Icon";
import Stepper from "@/components/input/Stepper";
import { useGSStore } from "@/hooks/useGSStore";
import { GSScene } from "@/model/GSScene";

export default function EditTranslation({ scene }: { scene: GSScene }) {
	const setSceneTransform = useGSStore((state) => state.setSceneTransform);

	const handlePositionChange = (axis: string, value: number) => {
		setSceneTransform(scene.id, {
			position: { ...scene.position, [axis]: value },
		});
	};

	return (
		<div>
			<Icon icon="move"></Icon>
			<ul>
				<li>
					<Stepper
						value={scene.position.x}
						valueHandler={(value) => handlePositionChange("x", value)}
						label="x"
					/>
				</li>
				<li>y</li>
				<li>z</li>
			</ul>
			{/* <input
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
			/> */}
		</div>
	);
}
