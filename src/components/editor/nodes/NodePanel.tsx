import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import type { FeatherIconNames } from "feather-icons";
import type { ReactNode } from "react";
import Icon from "../../Icon";

const Panel = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;

	gap: 0.5rem;
	border-top: 1px solid ${color.borderHalf};
	/* padding-top: 0.5rem; */
	padding-inline: 0.5rem;
    padding-block: 0.75rem;
`;

const Label = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;

	svg {
		width: 1rem;
		height: 1rem;
	}
`;

export default function NodePanel({
	icon,
	label,
	children,
}: {
	icon: FeatherIconNames;
	label: string;
	children: ReactNode;
}) {
	return (
		<Panel>
			<Label>
				<Icon icon={icon} />
				{label}
			</Label>
			{children}
		</Panel>
	);
}
