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
import HoverInfo from "../../HelpInfo";

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
	padding-right: 0.5rem;

	svg {
		transition: all 0.2s ease;
	}

	&[data-open] {
		.label-icon svg {
			color: ${color.textLight};
		}

		.svg-chevron-right {
			transform: rotate(90deg);
		}
	}

	&[data-hover] {
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
	gap: 0.5rem;
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
	helpInfo: string;
}

export default function SceneCardPanel({
	label,
	children,
	icon,
	helpInfo,
}: SceneSubcardProps) {
	return (
		<Disclosure as={DisclosureWrapper}>
			<DisclosureButton>
				<Icon icon="chevron-right" />
				<DisclosureLabel>
					<Icon icon={icon} className="label-icon" />
					{label}
				</DisclosureLabel>
				<HoverInfo info={helpInfo} />
			</DisclosureButton>
			<DisclosurePanel transition>{children}</DisclosurePanel>
		</Disclosure>
	);
}
