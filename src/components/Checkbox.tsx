interface CheckboxProps {
	label: string;
	value: boolean;
	onChange: (value: boolean) => void;
}

export default function Checkbox({ label, value, onChange }: CheckboxProps) {
	return (
		<label>
			<input
				type="checkbox"
				checked={value}
				onChange={(event) => onChange(event.target.checked)}
			/>
			{label}
		</label>
	);
}
