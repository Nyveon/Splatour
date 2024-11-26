import Icon from "@/components/Icon";
import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import { Checkbox as BaseCheckbox, Field, Label } from "@headlessui/react";

const CheckboxField = styled(Field)`
	display: flex;
	gap: 0.5rem;
	align-items: center;
`;

const CheckboxInput = styled(BaseCheckbox)`
	border: thin solid ${color.border};
	border-radius: 0.25rem;

	background-color: ${color.backgroundLight};
	color: ${color.primary};

	cursor: pointer;
	user-select: none;

	&[data-checked] {
		svg {
			opacity: 100%;
		}
	}

	svg {
		opacity: 0%;
		width: 1rem;
		height: 1rem;
		stroke-width: 3;
	}

	&[data-hover] {
		border-color: ${color.textLight};
	}
`;

interface CheckboxProps {
	label: string;
	value: boolean;
	onChange: (value: boolean) => void;
}

export default function Checkbox({ label, value, onChange }: CheckboxProps) {
	return (
		<CheckboxField>
			<CheckboxInput checked={value} onChange={onChange}>
				<Icon icon="check" />
			</CheckboxInput>
			<Label>{label}</Label>
		</CheckboxField>
	);
}
