import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import {
	Field as BaseField,
	Input,
	InputProps,
	Label,
} from "@headlessui/react";

const Field = styled(BaseField)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 0.5rem;
`;

const ColorInput = styled(Input)<InputProps>`
	width: 2rem;
	height: 2rem;

	padding: 0;

	border-radius: 0.25rem;
	border: 1px solid ${color.borderHalf};

	background: none;

	cursor: pointer;

	&:hover {
		border-color: ${color.border};
	}

	&::-webkit-color-swatch-wrapper {
		padding: 0;
	}
`;

export default function ColorPicker({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
}) {
	return (
		<Field>
			<Label>{label}</Label>
			<ColorInput
				type="color"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			></ColorInput>
		</Field>
	);
}
