import Icon from "@/components/Icon";
import Stepper from "@/components/input/Stepper";
import { useGSStore } from "@/hooks/useGSStore";
import { GSScene } from "@/model/GSScene";
import styled from "@emotion/styled";

const EditWrapper = styled.div`
	display: flex;
	justify-content: space-around;
	width: 100%;
`;

const EditFields = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
`;

export default function EditTranslation({ scene }: { scene: GSScene }) {
	const setSceneTransform = useGSStore((state) => state.setSceneTransform);

	const handlePositionChange = (axis: string, value: number) => {
		setSceneTransform(scene.id, {
			position: { ...scene.position, [axis]: value },
		});
	};

	const axes = ["x", "y", "z"] as const;

	return (
		<EditWrapper
			onClick={(e) => {
				e.stopPropagation();
			}}
		>
			<Icon icon="move"></Icon>
			<EditFields>
				{axes.map((axis) => (
					<li key={axis}>
						<Stepper
							value={scene.position[axis]}
							valueHandler={(value) => handlePositionChange(axis, value)}
							label={axis}
						/>
					</li>
				))}
			</EditFields>
		</EditWrapper>
	);
}
