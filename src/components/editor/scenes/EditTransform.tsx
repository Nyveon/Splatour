import Icon from "@/components/Icon";
import Button from "@/components/input/Button";
import Slider from "@/components/input/Slider";
import Stepper from "@/components/input/Stepper";
import { useGSStore } from "@/hooks/useGSStore";
import { axes, axis } from "@/utils/constants";
import styled from "@emotion/styled";
import { FeatherIconNames } from "feather-icons";
import { useState } from "react";

const EditWrapper = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
`;

const EditBar = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 2rem;
	/* margin-left: 1rem;
	margin-right: 1.5rem; */
`;

const EditFields = styled.ul`
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	width: 100%;
	gap: 0.5rem;
	/* max-width: 7.25rem; */
`;

interface EditTransformProps {
	sceneId: string;
	type: "rotation" | "scale" | "position";
	icon: FeatherIconNames;
	min: number;
	max: number;
	step: number;
	slider?: boolean;
	linkable?: boolean;
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
	linkable = false,
	convertTo = (value) => value,
	convertFrom = (value) => value,
}: EditTransformProps) {
	const [linked, setLinked] = useState(linkable);
	const setSceneTransform = useGSStore((state) => state.setSceneTransform);
	const sceneTransformValue = useGSStore(
		(state) => state.gsmap.scenes[sceneId][type]
	);

	const handleChange = (axis: axis, value: number) => {
		const newValue = convertTo(value);
		if (linked) {
			setSceneTransform(sceneId, {
				[type]: {
					[axes[0]]: newValue,
					[axes[1]]: newValue,
					[axes[2]]: newValue,
				},
			});
		} else {
			setSceneTransform(sceneId, {
				[type]: { ...sceneTransformValue, [axis]: newValue },
			});
		}
	};

	const InputComponent = slider ? Slider : Stepper;

	const inputs = linked ? [axes[0]] : axes;

	return (
		<EditWrapper
			onClick={(e) => {
				e.stopPropagation();
			}}
		>
			<EditBar>
				{linkable ? (
					<Button
						title={`${linked ? "Unlink" : "Link"} axes`}
						variant="small"
						icon={icon}
						onClick={() => {
							setLinked(!linked);
						}}
					></Button>
				) : (
					<Icon icon={icon}></Icon>
				)}
			</EditBar>
			<EditFields>
				{inputs.map((axis) => (
					<li key={axis}>
						<InputComponent
							value={convertFrom(sceneTransformValue[axis])}
							valueHandler={(value) => handleChange(axis, value)}
							label={linked ? <Icon icon="link" /> : axis}
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
