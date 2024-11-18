import styled from "@emotion/styled";

const s = {
	label: styled.label`
		cursor: pointer;
		user-select: none;
	`,
};

interface CheckboxProps {
	label: string;
	value: boolean;
	onChange: (value: boolean) => void;
}

export default function Checkbox({ label, value, onChange }: CheckboxProps) {
	return (
		<s.label>
			<input
				type="checkbox"
				checked={value}
				onChange={(event) => onChange(event.target.checked)}
			/>
			{label}
		</s.label>
	);
}
