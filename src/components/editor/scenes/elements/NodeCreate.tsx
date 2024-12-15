import Button from "@/components/input/Button";
import { useInteractions, UserState } from "@/hooks/useInteractions";
import styled from "@emotion/styled";
import { FeatherIconNames } from "feather-icons";

const StyledButton = styled(Button)`
	align-self: center;
`;

export default function NodeCreate({
	targetState,
	label,
	icon = "plus-circle",
	disabled = false,
}: {
	targetState: UserState;
	label: string;
	icon?: FeatherIconNames;
	disabled?: boolean;
}) {
	const setUserState = useInteractions((state) => state.setUserState);

	function handleClick() {
		setUserState(targetState);
	}

	return (
		<StyledButton
			title={`Create a ${label}`}
			label={label}
			icon={icon}
			onClick={handleClick}
			variant={disabled ? "disabled" : "primary"}
		/>
	);
}
