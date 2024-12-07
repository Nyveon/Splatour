import { useInteractions, UserState } from "@/hooks/useInteractions";
import { AppIcons } from "@/utils/theme";
import styled from "@emotion/styled";
import Icon from "../Icon";

const Mode = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const ModeLabel = styled.div`
	display: flex;
	align-items: center;
	gap: 0.2rem;

	font-style: italic;

	svg {
		width: 1rem;
		height: 1rem;
		transform: skewX(-15deg);
	}
`;

const modeMap = {
	[UserState.None]: { icon: AppIcons.Placement, label: "None" },
	[UserState.Artifacts]: { icon: AppIcons.Artifact, label: "Artifacts" },
	[UserState.Barriers]: { icon: AppIcons.Barrier, label: "Barriers" },
	[UserState.Portals]: { icon: AppIcons.Portal, label: "Portals" },
};

export default function ModeSelector() {
	const userState = useInteractions((state) => state.userState);
	const { icon, label } = modeMap[userState] || {
		icon: "help-circle",
		label: "Unknown",
	};

	return (
		<Mode>
			Mode
			<ModeLabel>
				<Icon icon={icon} />
				{label}
			</ModeLabel>
		</Mode>
	);
}
