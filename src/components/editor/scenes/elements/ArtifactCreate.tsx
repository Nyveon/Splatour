import Button from "@/components/input/Button";
import { useInteractions, UserState } from "@/hooks/useInteractions";
import styled from "@emotion/styled";

const StyledButton = styled(Button)`
	align-self: center;
`;

export default function ArtifactCreate() {
	const setUserState = useInteractions((state) => state.setUserState);

	function handleClick() {
		setUserState(UserState.Artifacts);
	}

	return (
		<StyledButton
			title="Create a new Artifact"
			label="New Artifact"
			icon="plus-circle"
			onClick={handleClick}
		/>
	);
}
