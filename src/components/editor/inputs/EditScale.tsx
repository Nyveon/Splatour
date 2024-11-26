import Icon from "@/components/Icon";
import Stepper from "@/components/input/Stepper";
import { useGSStore } from "@/hooks/useGSStore";
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

export default function EditScale({ sceneId }: { sceneId: string }) {
	const setSceneTransform = useGSStore((state) => state.setSceneTransform);
	const sceneScale = useGSStore((state) => state.gsmap.scenes[sceneId].scale);

	const handleScaleChange = (axis: string, value: number) => {
		setSceneTransform(sceneId, {
			scale: { ...sceneScale, [axis]: value },
		});
	};

	const axes = ["x", "y", "z"] as const;

	return (
		<EditWrapper
			onClick={(e) => {
				e.stopPropagation();
			}}
		>
			<Icon icon="maximize-2"></Icon>
			<EditFields>
				{axes.map((axis) => (
					<li key={axis}>
						<Stepper
							value={sceneScale[axis]}
							valueHandler={(value) => handleScaleChange(axis, value)}
							label={axis}
						/>
					</li>
				))}
			</EditFields>
		</EditWrapper>
	);
}
