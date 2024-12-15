import Icon from "@/components/Icon";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import { isMobile } from "react-device-detect";

const ControlsContainer = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;
	z-index: 1000;
	margin-left: 2rem;
	margin-bottom: 2rem;

	padding: 0.5rem;
	border-radius: 0.5rem;

	background-color: ${color.backgroundLight};

	opacity: 40%;
	overflow: hidden;

	&:hover {
		opacity: 100%;

		.controls-content {
			height: max-content;
			width: max-content;
			opacity: 100;
			padding-top: 0.5rem;
		}
	}

	cursor: pointer;
`;

const HintHover = styled.div`
	display: flex;
	gap: 0.25rem;

	svg {
		width: 1rem;
		height: 1rem;
	}
`;

const Controls = styled.div`
	height: 0;
	width: 0;
	opacity: 0;
	transition: all 0.2s ease;

	display: flex;
	flex-direction: column;
	gap: 0.25rem;

	white-space: nowrap;
`;

const ControlSubGroup = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 1rem;

	svg {
		width: 1rem;
		height: 1rem;
	}
`;

const GroupSide = styled.div`
	display: flex;
	gap: 0.5rem;
`;

export default function ControlsHints() {
	const debugMobile = useSettingsStore((state) => state.mobileDebug);
	const mobileControls = debugMobile || isMobile;

	if (mobileControls) {
		return null;
	}

	return (
		<ControlsContainer>
			<HintHover>
				<Icon icon="help-circle" />
				<strong>Controls</strong>
			</HintHover>
			<Controls className="controls-content">
				<ControlSubGroup>
					<GroupSide>
						<Icon icon="eye" />
						Lock in:
					</GroupSide>
					<GroupSide>Click viewer</GroupSide>
				</ControlSubGroup>

				<ControlSubGroup>
					<GroupSide>
						<Icon icon="eye-off" />
						Unlock:
					</GroupSide>
					<GroupSide>Escape key</GroupSide>
				</ControlSubGroup>

				<ControlSubGroup>
					<GroupSide>
						<Icon icon="move" />
						Move:
					</GroupSide>
					<GroupSide>WASD keys</GroupSide>
				</ControlSubGroup>

				<ControlSubGroup>
					<GroupSide>
						<Icon icon="camera" />
						Look:
					</GroupSide>
					<GroupSide>Move mouse</GroupSide>
				</ControlSubGroup>

				<ControlSubGroup>
					<GroupSide>
						<Icon icon="mouse-pointer" />
						Interact:
					</GroupSide>
					<GroupSide>Click object</GroupSide>
				</ControlSubGroup>
			</Controls>
		</ControlsContainer>
	);
}
