import { useGSStore } from "@/hooks/useGSStore";
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

	svg {
		width: 1rem;
		height: 1rem;
	}
`;

const modeMap = {
	[UserState.None]: { icon: AppIcons.Placement, label: "Editing" },
	[UserState.Artifacts]: {
		icon: AppIcons.Artifact,
		label: "Placing Artifact",
	},
	[UserState.BarrierWalls]: {
		icon: AppIcons.BarrierWall,
		label: "Placing Wall",
	},
	[UserState.BarrierSolids]: {
		icon: AppIcons.BarrierSolid,
		label: "Placing Solid",
	},
	[UserState.PortalEdges]: { icon: AppIcons.Portal, label: "Placing Edge" },
	[UserState.PortalWarps]: {
		icon: AppIcons.Portal,
		label: "Placing Warp",
	},
};

export default function ModeSelector() {
	const userState = useInteractions((state) => state.userState);
	const currentSceneId = useInteractions((state) => state.currentSceneId);
	const currentSceneName = useGSStore(
		(state) => state.gsmap.scenes[currentSceneId]?.name
	);

	const { icon, label } = modeMap[userState] || {
		icon: "help-circle",
		label: "Unknown",
	};

	return (
		<Mode>
			{currentSceneName ? (
				<>
					<ModeLabel>
						<Icon icon={icon} />
						{label}:
					</ModeLabel>
					<ModeLabel>
						<Icon icon="box" />
						{currentSceneName}
					</ModeLabel>
				</>
			) : (
				<ModeLabel>Nothing selected</ModeLabel>
			)}
		</Mode>
	);
}
