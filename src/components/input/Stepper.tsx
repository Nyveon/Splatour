import Button from "@/components/input/Button";
import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import { Field, Input, Label } from "@headlessui/react";
import { ReactNode } from "react";

const StepperField = styled(Field)`
	display: flex;
	align-items: center;
    justify-content: center;
	gap: 0.5rem;
`;

const StepperLabel = styled(Label)`
	color: ${color.textLight};
	width: 2rem;
	text-align: center;
`;

const StepperInput = styled(Input)<React.ComponentProps<"input">>`
	text-align: right;

	width: 2.5rem;

	border: thin solid ${color.borderHalf};
	border-radius: 0.25rem;

	background-color: ${color.backgroundMedium};
	color: ${color.textLight};

	font-family: "Courier New", Courier, monospace;
	font-size: 0.8rem;
	line-height: 1.25rem;

	-moz-appearance: textfield;
	appearance: textfield;
	&::-webkit-inner-spin-button,
	&::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
`;

interface StepperProps {
	min?: number;
	max?: number;
	step?: number;
	label?: ReactNode;
	value: number;
	valueHandler: (value: number) => void;
}

export default function Stepper({
	min = -Infinity,
	max = Infinity,
	step = 1,
	label = "",
	value,
	valueHandler,
}: StepperProps) {
	const handleWrite = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		const parsedValue = parseFloat(inputValue);

		if (
			inputValue &&
			isNaN(parsedValue) &&
			parsedValue >= min &&
			parsedValue <= max
		) {
			valueHandler(parsedValue);
		}
	};

	return (
		<StepperField>
			{label && <StepperLabel>{label}</StepperLabel>}

			<Button
				title="Decrement"
				onClick={() => {
					if (value - step >= min) {
						valueHandler(value - step);
					} else {
						valueHandler(min);
					}
				}}
				label="-"
				variant="small"
			/>
			<StepperInput
				type="number"
				value={value.toFixed(1)}
				onChange={handleWrite}
				min={min}
				max={max}
				step={step}
			/>
			<Button
				title="Increment"
				onClick={() => {
					if (value + step <= max) {
						valueHandler(value + step);
					} else {
						valueHandler(max);
					}
				}}
				label="+"
				variant="small"
			/>
		</StepperField>
	);
}
