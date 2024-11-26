import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import { Checkbox as BaseCheckbox, Field, Label } from "@headlessui/react";
import Icon from "./Icon";

const s = {
	Field: styled(Field)`
		display: flex;
		gap: 0.5rem;
		align-items: center;
	`,

	Checkbox: styled(BaseCheckbox)`
		border: thin solid ${color.border};
		border-radius: 0.25rem;

		background-color: ${color.backgroundLight};
		color: ${color.primary};

		cursor: pointer;
		user-select: none;

		&[data-checked] {
			/* background-color: ${color.primary}; */

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
	`,
};

interface CheckboxProps {
	label: string;
	value: boolean;
	onChange: (value: boolean) => void;
}

export default function Checkbox({ label, value, onChange }: CheckboxProps) {
	return (
		<s.Field>
			<s.Checkbox checked={value} onChange={onChange}>
				<Icon icon="check" />
			</s.Checkbox>
			<Label>{label}</Label>
		</s.Field>
	);
}
