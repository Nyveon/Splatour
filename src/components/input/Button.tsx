import Icon from "@/components/Icon";
import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import { Button as BaseButton } from "@headlessui/react";
import { FeatherIconNames } from "feather-icons";

const BaseStyledButton = styled(BaseButton)<React.ComponentProps<"button">>`
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

	font-family: inherit;
	font-size: inherit;

	cursor: pointer;

	svg {
		width: 1rem;
		height: 1rem;
	}
`;

const variants = {
	primary: styled(BaseStyledButton)`
		background-color: ${color.primary};

		&:hover {
			background-color: ${color.primaryLight};
		}
	`,

	danger: styled(BaseStyledButton)`
		background-color: ${color.danger};

		&:hover {
			background-color: ${color.dangerLight};
		}
	`,

	disabled: styled(BaseStyledButton)`
		background-color: ${color.backgroundMedium};
		color: ${color.textDisabled};
		cursor: not-allowed;
	`,

	small: styled(BaseStyledButton)`
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;

		margin: 0;
		padding: 0.25rem;
		width: 1.25rem;
		height: 1.25rem;
		line-height: 1.25rem;

		border-radius: 50%;
		border: none;

		font-family: "Courier New", Courier, monospace;

		background-color: ${color.primary};

		&:hover {
			background-color: ${color.primaryLight};
		}

		svg {
			width: 0.8rem;
			height: 0.8rem;
		}
	`,
};

type Variant = keyof typeof variants;

interface ButtonProps {
	title: string;
	label?: string;
	variant?: Variant;
	icon?: FeatherIconNames;
	onClick?: () => void;
}

export default function Button({
	title,
	label = "",
	variant = "primary",
	icon,
	onClick,
}: ButtonProps) {
	const ButtonComponent = variants[variant] || BaseStyledButton;

	return (
		<ButtonComponent onClick={onClick} title={title}>
			{icon && <Icon icon={icon} />}
			{label}
		</ButtonComponent>
	);
}
