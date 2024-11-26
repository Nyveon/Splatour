import Icon from "@/components/Icon";
import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import { Button as BaseButton } from "@headlessui/react";
import { FeatherIconNames } from "feather-icons";

interface StyledButtonProps extends React.ComponentProps<"button"> {
	variant: Variant;
}

const s = {
	Button: styled(BaseButton)<StyledButtonProps>`
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

		svg {
			width: 1rem;
			height: 1rem;
		}
	`,
};

type Variant = "primary" | "danger";

interface ButtonProps {
	label: string;
	variant?: Variant;
	icon?: FeatherIconNames;
	onClick?: () => void;
}

export default function Button({
	label,
	variant = "primary",
	icon,
	onClick,
}: ButtonProps) {
	return (
		<s.Button variant={variant} onClick={onClick}>
			{icon && <Icon icon={icon} />}
			{label}
		</s.Button>
	);
}
