import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import { FeatherIconNames } from "feather-icons";
import type { ReactNode } from "react";
import Icon from "../../Icon";
import HelpInfo from "../HelpInfo";

const ToolbarSectionContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
`;

const ToolbarSectionLabel = styled.span`
	display: flex;
	gap: 0.5rem;
	color: ${color.textDisabled};

	svg {
		width: 1rem;
		height: 1rem;
	}
`;

const ToolbarSectionTools = styled.div`
	display: flex;
	gap: 2rem;
`;

interface ToolbarSectionProps {
	label: string;
	icon: FeatherIconNames;
	children: ReactNode;
	helpInfo: string;
}

export default function ToolbarSection({
	label,
	icon,
	children,
	helpInfo,
}: ToolbarSectionProps) {
	return (
		<ToolbarSectionContainer>
			<ToolbarSectionLabel>
				<Icon icon={icon} />
				{label}
				<HelpInfo info={helpInfo} />
			</ToolbarSectionLabel>
			<ToolbarSectionTools>{children}</ToolbarSectionTools>
		</ToolbarSectionContainer>
	);
}
