import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import { Input as BaseInput } from "@headlessui/react";

const Input = styled(BaseInput)<React.ComponentProps<"input">>`
	background-color: ${color.backgroundMedium};
	color: inherit;
	font-size: inherit;
	line-height: inherit;
	border: 1px solid ${color.borderHalf};
	border-radius: 3px;
`;

interface TextInputProps {
	value: string;
	valueHandler: (value: string) => void;
}

export default function TextInput({ value, valueHandler }: TextInputProps) {
	return (
		<Input
			type="text"
			value={value}
			onChange={(e) => valueHandler(e.target.value)}
			onClick={(e) => e.stopPropagation()}
		/>
	);
}
