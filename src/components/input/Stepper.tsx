import { Field, Input, Label } from "@headlessui/react";
import { ReactNode } from "react";

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
	return (
		<Field>
			{label && <Label>{label}</Label>}

			<button
				onClick={() => {
					if (value - step >= min) {
						valueHandler(value - step);
					}
				}}
			>
				-
			</button>
			<Input type="number" value={value} />
			<button
				onClick={() => {
					if (value + step <= max) {
						valueHandler(value + step);
					}
				}}
			>
				+
			</button>
		</Field>
	);
}
