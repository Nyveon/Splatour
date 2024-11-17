import styled from "@emotion/styled";
import { color } from "../utils/theme";

const s = {
	Button: styled.button<{ variant: Variant }>`
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 0.5rem;

		margin: 0;
		padding-inline: 0.5rem;
		padding-block: 0.25rem;

		border: none;
		border-radius: 0.5rem;

		color: ${color.textLight};
		background-color: ${(props) =>
			props.variant === "primary" ? color.primary : color.danger};

		font-family: inherit;
		font-size: inherit;

		cursor: pointer;

		&:hover {
			background-color: ${(props) =>
				props.variant === "primary" ? color.primaryLight : color.dangerLight};
		}
	`,
};

type Variant = "primary" | "danger";

interface ButtonProps {
	variant?: Variant;
	text: string;
}

export default function Button({ variant = "primary", text }: ButtonProps) {
	return <s.Button variant={variant}>{text}</s.Button>;
}
