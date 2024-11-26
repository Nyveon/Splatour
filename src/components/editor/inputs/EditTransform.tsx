import Icon from "@/components/Icon";
import Slider from "@/components/input/Slider";
import Stepper from "@/components/input/Stepper";
import { useGSStore } from "@/hooks/useGSStore";
import { axes, axis } from "@/utils/constants";
import styled from "@emotion/styled";
import { FeatherIconNames } from "feather-icons";

const EditWrapper = styled.div`
	display: flex;
	justify-content: space-around;
	width: 100%;
`;

const EditFields = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	max-width: 7.25rem;
`;

interface EditTransformProps {
	sceneId: string;
	type: "rotation" | "scale" | "position";
	icon: FeatherIconNames;
	min: number;
	max: number;
	step: number;
	slider?: boolean;
	convertTo?: (value: number) => number;
	convertFrom?: (value: number) => number;
}

export default function EditTransform({
	sceneId,
	type,
	icon,
	min,
	max,
	step,
	slider = false,
	convertTo = (value) => value,
	convertFrom = (value) => value,
}: EditTransformProps) {
	const setSceneTransform = useGSStore((state) => state.setSceneTransform);
	const sceneTransformValue = useGSStore(
		(state) => state.gsmap.scenes[sceneId][type]
	);

	const handleChange = (axis: axis, value: number) => {
		const newValue = convertTo(value);
		setSceneTransform(sceneId, {
			[type]: { ...sceneTransformValue, [axis]: newValue },
		});
	};

	const InputComponent = slider ? Slider : Stepper;

	return (
		<EditWrapper
			onClick={(e) => {
				e.stopPropagation();
			}}
		>
			<Icon icon={icon}></Icon>
			<EditFields>
				{axes.map((axis) => (
					<li key={axis}>
						<InputComponent
							value={convertFrom(sceneTransformValue[axis])}
							valueHandler={(value) => handleChange(axis, value)}
							label={axis}
							min={min}
							max={max}
							step={step}
						/>
					</li>
				))}
			</EditFields>
		</EditWrapper>
	);
}
