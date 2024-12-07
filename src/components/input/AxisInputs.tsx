import { axes, axis } from "@/utils/constants";
import styled from "@emotion/styled";
import Slider from "./Slider";
import Stepper from "./Stepper";

const InputFields = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
`;

export interface AxisInputsProps {
	values: Record<axis, number>;
	handleChange: (axis: axis, value: number) => void;
	min: number;
	max: number;
	step: number;
	convertFrom?: (value: number) => number;
	linked?: boolean;
	slider?: boolean;
}

export default function AxisInputs({
	values,
	handleChange,
	min,
	max,
	step,
	convertFrom = (value) => value,
	linked = false,
	slider = false,
}: AxisInputsProps) {
	const inputs = linked ? [axes[0]] : axes;
	const InputComponent = slider ? Slider : Stepper;

	return (
		<InputFields>
			{inputs.map((axis) => (
				<div key={axis}>
					<InputComponent
						value={convertFrom(values[axis])}
						valueHandler={(value) => handleChange(axis, value)}
						label={axis}
						min={min}
						max={max}
						step={step}
					/>
				</div>
			))}
		</InputFields>
	);
}
