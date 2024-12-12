import Icon from "@/components/Icon";
import { color, unstyledButtonCSS } from "@/utils/theme";
import styled from "@emotion/styled";
import {
	DisclosureButton as BaseDisclosureButton,
	DisclosurePanel as BaseDisclosurePanel,
	Disclosure,
} from "@headlessui/react";
import { FeatherIconNames } from "feather-icons";
import type { ReactNode } from "react";

const DisclosureWrapper = styled.div`
	width: 100%;
	padding: 0.25rem;
	border-radius: 0.25rem;

	background-color: ${color.backgroundMediumDark};
`;

const DisclosureButton = styled(BaseDisclosureButton)`
	${unstyledButtonCSS}

	display: flex;
	width: 100%;
	align-items: center;
	gap: 0.75rem;
	border-radius: 0.25rem;

	svg {
		transition: all 0.2s ease;
	}

	&[data-open] {
		svg {
			color: ${color.textLight};
		}

		.svg-chevron-right {
			transform: rotate(90deg);
		}
	}

	&[data-hover] {
		svg {
			color: ${color.textLight};
		}

		background-color: ${color.backgroundMedium};
	}
`;

const DisclosurePanel = styled(BaseDisclosurePanel)`
	display: flex;
	flex-direction: column;

	margin: 0.5rem;
	margin-top: 0.25rem;

	& > div {
		padding-block: 0.5rem;
		border-top: thin solid ${color.borderHalf};

		&:last-child {
			padding-bottom: 0;
		}

		&:only-of-type {
			padding-block: 0rem;
			border-top: none;
		}
	}

	transition: height 0.2s ease;
	height: max-content;
	overflow: hidden;

	&[data-transition] {
		height: 0;
	}
`;

const DisclosureLabel = styled.span`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	margin-right: 0.5rem;

	svg {
		color: ${color.textDisabled};
	}
`;

interface SceneSubcardProps {
	label: string;
	children: ReactNode;
	icon: FeatherIconNames;
}

export default function SceneCardPanel({
	label,
	children,
	icon,
}: SceneSubcardProps) {
	return (
		<Disclosure as={DisclosureWrapper}>
			<DisclosureButton>
				<Icon icon="chevron-right" />
				<DisclosureLabel>
					{label}
					<Icon icon={icon} />
				</DisclosureLabel>
			</DisclosureButton>
			<DisclosurePanel transition>{children}</DisclosurePanel>
		</Disclosure>
	);
}
