import Icon from "@/components/Icon";
import Stepper from "@/components/input/Stepper";
import { useGSStore } from "@/hooks/useGSStore";
import { GSScene } from "@/model/GSScene";
import styled from "@emotion/styled";

const s = {
	EditWrapper: styled.div`
		display: flex;
		justify-content: space-around;
		width: 100%;
		/* align-items: center; */
	`,

	FieldList: styled.ul`
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	`,
};

export default function EditScale({ scene }: { scene: GSScene }) {
	const setSceneTransform = useGSStore((state) => state.setSceneTransform);

	const handleScaleChange = (axis: string, value: number) => {
		setSceneTransform(scene.id, {
			scale: { ...scene.scale, [axis]: value },
		});
	};

	const axes = ["x", "y", "z"] as const;

	return (
		<s.EditWrapper
			onClick={(e) => {
				e.stopPropagation();
			}}
		>
			<Icon icon="maximize-2"></Icon>
			<s.FieldList>
				{axes.map((axis) => (
					<li key={axis}>
						<Stepper
							value={scene.scale[axis]}
							valueHandler={(value) => handleScaleChange(axis, value)}
							label={axis}
						/>
					</li>
				))}
			</s.FieldList>
		</s.EditWrapper>
	);
}
