import EditRotation from "@/components/editor/scenes/properties/EditRotation";
import EditScale from "@/components/editor/scenes/properties/EditScale";
import EditTranslation from "@/components/editor/scenes/properties/EditTranslation";
import Icon from "@/components/Icon";
import { color, unstyledButtonCSS } from "@/utils/theme";
import styled from "@emotion/styled";
import {
	DisclosureButton as BaseDisclosureButton,
	DisclosurePanel as BaseDisclosurePanel,
	Disclosure,
} from "@headlessui/react";

const TransformationsSection = styled.div`
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
	gap: 0.5rem;
	border-radius: 0.25rem;

	svg {
		transition: all 0.2s ease;
	}

	&[data-open] {
		svg {
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

	margin-top: 0.25rem;

	& > div {
		padding-block: 0.5rem;
		border-top: thin solid ${color.borderHalf};

		&:last-child {
			padding-bottom: 0;
		}
	}

	transition: height 0.2s ease;
	height: max-content;
	overflow: hidden;

	&[data-transition] {
		height: 0;
	}
`;

export default function Transformations({ sceneId }: { sceneId: string }) {
	return (
		<Disclosure as={TransformationsSection}>
			<DisclosureButton>
				<Icon icon="chevron-right" />
				Transform
			</DisclosureButton>
			<DisclosurePanel transition>
				<EditTranslation sceneId={sceneId} />
				<EditScale sceneId={sceneId} />
				<EditRotation sceneId={sceneId} />
			</DisclosurePanel>
		</Disclosure>
	);
}
